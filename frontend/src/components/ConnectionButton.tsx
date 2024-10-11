import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";

const ConnectionButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="outline"
                    className="w-max text-white !px-4 bg-[#f59e0b] gap-x-2 !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)] hover:bg-inherit hover:text-white"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant="outline"
                    className="w-max text-white !px-4 bg-red-500 gap-x-2 !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)]"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  className="w-max text-white !px-4 bg-[#f59e0b] gap-x-2 !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)] hover:bg-inherit hover:text-white"
                >
                  <span className="text-nowrap text-sm leading-[21px]  mr-1">
                    {account.displayBalance ? account.displayBalance : ""}
                  </span>

                  <span className="hidden md:block mr-[10px]">
                    {account.displayName}
                  </span>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export { ConnectionButton as default };
