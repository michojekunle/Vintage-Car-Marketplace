"use"
// import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, createConfig } from '@wagmi/core'
import {
  baseSepolia,
  liskSepolia,
} from 'wagmi/chains';

export const config = createConfig({
  chains: [baseSepolia, liskSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})


// export const config = getDefaultConfig({
//   appName: 'Vintage Car Marketplace Dapp',
//   projectId: '6182781540ebbc64154071bf4e7b4518d',
//   chains: [
//     baseSepolia,
//     liskSepolia,
//   ],
//   ssr: true,
// });
