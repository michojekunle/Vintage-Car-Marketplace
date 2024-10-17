export const VINTAGE_CAR_AUCTION_ADDRESS =
  "0x36520821D722A4c4fc966cc5A41fc7f1669dED6B";

export const VINTAGE_CAR_AUCTION_ABI = [
  {
    inputs: [
      {
        internalType: "contract VintageCarNFT",
        name: "_nftContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AuctionEnded", type: "error" },
  { inputs: [], name: "AuctionNotActive", type: "error" },
  { inputs: [], name: "AuctionStillOngoing", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "currentBid", type: "uint256" },
      { internalType: "uint256", name: "sentBid", type: "uint256" },
    ],
    name: "BidTooLow",
    type: "error",
  },
  { inputs: [], name: "BidsExist", type: "error" },
  { inputs: [], name: "InvalidStartPrice", type: "error" },
  { inputs: [], name: "NotApprovedForTransfer", type: "error" },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "NotSeller",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
    ],
    name: "AuctionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startingPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "buyoutPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "auctionEndTime",
        type: "uint256",
      },
    ],
    name: "AuctionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AuctionEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BidPlaced",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "auctions",
    outputs: [
      { internalType: "address payable", name: "seller", type: "address" },
      { internalType: "uint256", name: "nftId", type: "uint256" },
      { internalType: "uint256", name: "startingPrice", type: "uint256" },
      { internalType: "uint256", name: "highestBid", type: "uint256" },
      {
        internalType: "address payable",
        name: "highestBidder",
        type: "address",
      },
      { internalType: "uint256", name: "auctionEndTime", type: "uint256" },
      { internalType: "uint256", name: "buyoutPrice", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_nftId", type: "uint256" },
      { internalType: "address", name: "_nftOwner", type: "address" },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_nftId", type: "uint256" },
      { internalType: "uint256", name: "_startingPrice", type: "uint256" },
      { internalType: "uint256", name: "_buyoutPrice", type: "uint256" },
      { internalType: "uint256", name: "_duration", type: "uint256" },
      { internalType: "address", name: "_nftOwner", type: "address" },
    ],
    name: "createAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_nftId", type: "uint256" }],
    name: "endAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nftContract",
    outputs: [
      { internalType: "contract VintageCarNFT", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_nftId", type: "uint256" }],
    name: "placeBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
