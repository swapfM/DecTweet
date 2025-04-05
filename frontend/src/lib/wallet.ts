import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "viem/chains";

export const config = getDefaultConfig({
  appName: "DecTweet",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "", // From env
  chains: [sepolia],
  ssr: true,
});
