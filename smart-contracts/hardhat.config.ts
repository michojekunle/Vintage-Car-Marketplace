import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  mocha: {
    fuzz: {
      runs: 1000
    }
  }
};

export default config;
