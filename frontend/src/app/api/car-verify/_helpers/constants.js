export const abi = [
  {
    inputs: [{ internalType: "address", name: "router", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "string", name: "vin", type: "string" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "CarNotOwnedByUser",
    type: "error",
  },
  { inputs: [], name: "EmptyArgs", type: "error" },
  { inputs: [], name: "EmptySource", type: "error" },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  {
    inputs: [{ internalType: "string", name: "vin", type: "string" }],
    name: "InvalidVIN",
    type: "error",
  },
  { inputs: [], name: "NoInlineSecrets", type: "error" },
  { inputs: [], name: "OnlyRouterCanFulfill", type: "error" },
  {
    inputs: [{ internalType: "bytes32", name: "requestId", type: "bytes32" }],
    name: "VerificationNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "vin", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "RequestFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
    ],
    name: "RequestSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      { indexed: true, internalType: "string", name: "vin", type: "string" },
      {
        indexed: false,
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
    ],
    name: "VerificationFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      { indexed: true, internalType: "string", name: "vin", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "VerificationRequested",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "requestId", type: "bytes32" }],
    name: "doesRequestExist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "donId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "requestId", type: "bytes32" }],
    name: "getCarDetailsByRequestId",
    outputs: [
      {
        components: [
          { internalType: "string", name: "vin", type: "string" },
          { internalType: "string", name: "make", type: "string" },
          { internalType: "string", name: "model", type: "string" },
          { internalType: "uint256", name: "year", type: "uint256" },
          { internalType: "bool", name: "isVerified", type: "bool" },
          {
            internalType: "uint256",
            name: "verificationTimestamp",
            type: "uint256",
          },
          { internalType: "address", name: "currentOwner", type: "address" },
        ],
        internalType: "struct CarVerificationOracle.CarDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "vin", type: "string" }],
    name: "getCarDetailsByVIN",
    outputs: [
      {
        components: [
          { internalType: "string", name: "vin", type: "string" },
          { internalType: "string", name: "make", type: "string" },
          { internalType: "string", name: "model", type: "string" },
          { internalType: "uint256", name: "year", type: "uint256" },
          { internalType: "bool", name: "isVerified", type: "bool" },
          {
            internalType: "uint256",
            name: "verificationTimestamp",
            type: "uint256",
          },
          { internalType: "address", name: "currentOwner", type: "address" },
        ],
        internalType: "struct CarVerificationOracle.CarDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getOwnerCars",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "requestId", type: "bytes32" }],
    name: "getRawResponseBytes",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "requestId", type: "bytes32" },
      { internalType: "bytes", name: "response", type: "bytes" },
      { internalType: "bytes", name: "err", type: "bytes" },
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "requestId", type: "bytes32" }],
    name: "isResponseReceived",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRequestId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "ownerToCars",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "vin", type: "string" },
      { internalType: "string", name: "make", type: "string" },
      { internalType: "string", name: "model", type: "string" },
      { internalType: "uint256", name: "year", type: "uint256" },
      { internalType: "string", name: "source", type: "string" },
    ],
    name: "requestCarValidation",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subscriptionId",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "vin", type: "string" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "newDonId", type: "bytes32" }],
    name: "updateDonId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "newSubscriptionId", type: "uint64" },
    ],
    name: "updateSubscriptionId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "verifications",
    outputs: [
      { internalType: "string", name: "vin", type: "string" },
      { internalType: "string", name: "make", type: "string" },
      { internalType: "string", name: "model", type: "string" },
      { internalType: "uint256", name: "year", type: "uint256" },
      { internalType: "bool", name: "isVerified", type: "bool" },
      {
        internalType: "uint256",
        name: "verificationTimestamp",
        type: "uint256",
      },
      { internalType: "address", name: "currentOwner", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "vinToRequestId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

export const getSource = (vin, make, model, year) => {
  return `
    const verifyCarDetails = async (${vin}, ${make}, ${model}, ${year}) => {
    const apiUrl = ${`https://car-verification-api.vercel.app/verify?vin=${`${vin}`}&make=${make}&model=${model}&year=${year}`};
    
    const response = await Functions.makeHttpRequest({
      url: apiUrl,
      method: 'GET'
    });
  
    if (response.error) {
      throw Error('API request failed');
    }
  
    const { isVerified } = response.data;
    
    return Functions.encodeString(isVerified.toString());
};
  
return verifyCarDetails(args[0], args[1], args[2], args[3]);`;
};
