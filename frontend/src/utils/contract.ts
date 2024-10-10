import { http, createConfig } from '@wagmi/core'
import { scrollSepolia } from "wagmi/chains";
import { createPublicClient } from "viem";

export const SENTINEL_NFT_ADDRESS = "0xed0a67003F512E685BC8D57F01251188242c5D5e" as const;

export const client = createPublicClient({
    chain: scrollSepolia,
    transport: http(),
})

export const config = createConfig({
    chains: [scrollSepolia],
    transports: {
        [scrollSepolia.id]: http(),
    },
    ssr: true,
})