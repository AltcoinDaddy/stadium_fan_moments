// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MatchdayMoments} from "../contracts/MatchdayMoments.sol";

contract MatchdayMomentsTest is Test {
    MatchdayMoments internal moments;
    address internal creator = makeAddr("creator");
    address internal buyer = makeAddr("buyer");
    address internal reseller = makeAddr("reseller");

    function setUp() public {
        moments = new MatchdayMoments(address(this), 1_000);
        vm.deal(buyer, 10 ether);
    }

    function testMintListsAndStoresMetadata() public {
        vm.prank(creator);
        uint256 tokenId = moments.mintMoment("ipfs://bafy-metadata", 2 ether);
        MatchdayMoments.Moment memory moment = moments.getMoment(tokenId);
        assertEq(moments.ownerOf(tokenId), creator);
        assertEq(moments.tokenURI(tokenId), "ipfs://bafy-metadata");
        assertEq(moment.creator, creator);
        assertEq(moment.price, 2 ether);
        assertTrue(moment.listed);
    }

    function testPurchaseTransfersNftAndNativePayment() public {
        vm.prank(creator);
        uint256 tokenId = moments.mintMoment("ipfs://bafy-metadata", 2 ether);
        uint256 creatorBalanceBefore = creator.balance;
        vm.prank(buyer);
        moments.purchase{value: 2 ether}(tokenId);
        MatchdayMoments.Moment memory moment = moments.getMoment(tokenId);
        assertEq(moments.ownerOf(tokenId), buyer);
        assertEq(creator.balance - creatorBalanceBefore, 2 ether);
        assertFalse(moment.listed);
    }

    function testResalePaysCreatorRoyalty() public {
        vm.prank(creator);
        uint256 tokenId = moments.mintMoment("ipfs://bafy-metadata", 1 ether);
        vm.prank(buyer);
        moments.purchase{value: 1 ether}(tokenId);
        vm.prank(buyer);
        moments.transferFrom(buyer, reseller, tokenId);
        vm.prank(reseller);
        moments.listMoment(tokenId, 2 ether);
        uint256 creatorBalanceBefore = creator.balance;
        uint256 resellerBalanceBefore = reseller.balance;
        vm.deal(buyer, 2 ether);
        vm.prank(buyer);
        moments.purchase{value: 2 ether}(tokenId);
        assertEq(moments.ownerOf(tokenId), buyer);
        assertEq(creator.balance - creatorBalanceBefore, 0.2 ether);
        assertEq(reseller.balance - resellerBalanceBefore, 1.8 ether);
    }

    function testDirectTransferDelistsMoment() public {
        vm.prank(creator);
        uint256 tokenId = moments.mintMoment("ipfs://bafy-metadata", 1 ether);
        vm.prank(creator);
        moments.transferFrom(creator, reseller, tokenId);
        assertFalse(moments.getMoment(tokenId).listed);
    }

    function testPurchaseRejectsIncorrectPayment() public {
        vm.prank(creator);
        uint256 tokenId = moments.mintMoment("ipfs://bafy-metadata", 1 ether);
        vm.prank(buyer);
        vm.expectRevert(abi.encodeWithSelector(MatchdayMoments.IncorrectPayment.selector, 1 ether, 0.5 ether));
        moments.purchase{value: 0.5 ether}(tokenId);
    }
}
