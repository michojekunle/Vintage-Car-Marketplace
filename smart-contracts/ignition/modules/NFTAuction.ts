import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const vintageCarNFT = "0x9E2f97f35fB9ab4CFe00B45bEa3c47164Fff1C16";
const NFTAuctionModule = buildModule("NFTAuction", (m) => {
  const nftAuction = m.contract("NFTAuction", [vintageCarNFT]);

  return { nftAuction };
});

export default NFTAuctionModule;
