// import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from '@wagmi/core'
import {
  baseSepolia,
} from 'wagmi/chains';

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})
