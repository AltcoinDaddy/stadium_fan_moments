import { createPublicClient, defineChain, formatEther, http } from "viem";

export const chilizSpicy = defineChain({
  id: 88882,
  name: "Chiliz Spicy Testnet",
  nativeCurrency: { name: "Chiliz", symbol: "CHZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://spicy-rpc.chiliz.com/"] },
  },
  blockExplorers: {
    default: { name: "ChilizScan", url: "https://testnet.chiliscan.com" },
  },
  testnet: true,
});

export const chilizPublicClient = createPublicClient({
  chain: chilizSpicy,
  transport: http(process.env.NEXT_PUBLIC_CHILIZ_RPC_URL || chilizSpicy.rpcUrls.default.http[0]),
});

export async function getChzBalance(address: `0x${string}`) {
  const balance = await chilizPublicClient.getBalance({ address });
  return Number(formatEther(balance));
}
