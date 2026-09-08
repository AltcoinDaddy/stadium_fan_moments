export const matchdayContractAddress = process.env
  .NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS as `0x${string}` | undefined;

export const matchdayMomentsAbi = [
  {
    type: "function",
    name: "mintMoment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "metadataURI", type: "string" },
      { name: "price", type: "uint256" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "purchase",
    stateMutability: "payable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "listMoment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "delistMoment",
    stateMutability: "nonpayable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "owner", type: "address" }],
  },
  {
    type: "event",
    name: "MomentMinted",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "tokenURI", type: "string" },
      { indexed: false, name: "initialPrice", type: "uint256" },
      { indexed: false, name: "royaltyBps", type: "uint96" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MomentListed",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "seller", type: "address" },
      { indexed: false, name: "price", type: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MomentDelisted",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "seller", type: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MomentPurchased",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "seller", type: "address" },
      { indexed: true, name: "buyer", type: "address" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "royaltyPaid", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;
