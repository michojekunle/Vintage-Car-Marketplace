import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
    }
  },
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY
  },
  mocha: {
    fuzz: {
      runs: 1000
    }
  }
};

export default config;
