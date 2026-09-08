// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title MatchdayMoments
/// @notice A one-of-one fan-moment NFT marketplace that settles listings in native CHZ.
contract MatchdayMoments is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint96 public constant MAX_ROYALTY_BPS = 2_500;
    uint96 public royaltyBps;
    uint256 private _nextTokenId = 1;

    struct Moment {
        address creator;
        uint96 royaltyBps;
        uint256 price;
        bool listed;
    }

    mapping(uint256 tokenId => Moment) private _moments;

    event MomentMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 initialPrice, uint96 royaltyBps);
    event MomentListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event MomentDelisted(uint256 indexed tokenId, address indexed seller);
    event MomentPurchased(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 royaltyPaid);

    error InvalidPrice();
    error NotTokenOwner();
    error NotListed();
    error IncorrectPayment(uint256 expected, uint256 received);
    error TransferFailed();
    error InvalidRoyaltyBps();

    constructor(address initialOwner, uint96 defaultRoyaltyBps)
        ERC721("Stadium Fan Moments", "SFM")
        Ownable(initialOwner)
    {
        if (defaultRoyaltyBps > MAX_ROYALTY_BPS) revert InvalidRoyaltyBps();
        royaltyBps = defaultRoyaltyBps;
    }

    /// @notice Mint a unique moment and list it at a native-CHZ price.
    /// @param metadataURI Immutable IPFS metadata URI (ipfs://CID).
    /// @param price Listing price in wei, e.g. 1 CHZ = 1 ether.
    function mintMoment(string calldata metadataURI, uint256 price) external returns (uint256 tokenId) {
        if (price == 0) revert InvalidPrice();

        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _moments[tokenId] = Moment({creator: msg.sender, royaltyBps: royaltyBps, price: price, listed: true});

        emit MomentMinted(tokenId, msg.sender, metadataURI, price, royaltyBps);
        emit MomentListed(tokenId, msg.sender, price);
    }

    function listMoment(uint256 tokenId, uint256 price) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (price == 0) revert InvalidPrice();

        _moments[tokenId].price = price;
        _moments[tokenId].listed = true;
        emit MomentListed(tokenId, msg.sender, price);
    }

    function delistMoment(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        _moments[tokenId].listed = false;
        emit MomentDelisted(tokenId, msg.sender);
    }

    /// @notice Purchase a listed moment. Native CHZ is split between seller and creator royalty.
    function purchase(uint256 tokenId) external payable nonReentrant {
        Moment storage moment = _moments[tokenId];
        if (!moment.listed) revert NotListed();
        if (msg.value != moment.price) revert IncorrectPayment(moment.price, msg.value);

        address seller = ownerOf(tokenId);
        if (seller == msg.sender) revert NotTokenOwner();

        uint256 royalty = (msg.value * moment.royaltyBps) / 10_000;
        uint256 sellerProceeds = msg.value - royalty;

        moment.listed = false;
        _safeTransfer(seller, msg.sender, tokenId, "");

        if (royalty != 0 && moment.creator != seller) {
            _sendValue(moment.creator, royalty);
        } else {
            sellerProceeds += royalty;
        }
        _sendValue(seller, sellerProceeds);

        emit MomentPurchased(tokenId, seller, msg.sender, msg.value, royalty);
    }

    function getMoment(uint256 tokenId) external view returns (Moment memory) {
        ownerOf(tokenId);
        return _moments[tokenId];
    }

    function setDefaultRoyaltyBps(uint96 newRoyaltyBps) external onlyOwner {
        if (newRoyaltyBps > MAX_ROYALTY_BPS) revert InvalidRoyaltyBps();
        royaltyBps = newRoyaltyBps;
    }

    /// @dev Direct transfers must never leave an old marketplace listing active.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0) && to != address(0) && _moments[tokenId].listed) {
            _moments[tokenId].listed = false;
            emit MomentDelisted(tokenId, from);
        }
        return from;
    }

    function _sendValue(address recipient, uint256 amount) private {
        (bool sent,) = recipient.call{value: amount}("");
        if (!sent) revert TransferFailed();
    }
}
