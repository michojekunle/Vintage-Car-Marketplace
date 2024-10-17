import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey:
      process.env.BASESCAN_API_KEY || "Z597QN9XS29338DPDQIAHT83A42M3933P5",
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  // mocha: {
  //   fuzz: {
  //     runs: 1000
  //   }
  // }
  sourcify: {
	enabled: true
  }  
};

export default config;
