// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const SellerVerificationModule = buildModule("SellerVerificationModule", (m) => {

  const sellerVerification = m.contract("SellerVerification")

  return { sellerVerification };
});

export default SellerVerificationModule;
