# Stadium Fan Moments contract

`MatchdayMoments` is the on-chain ERC-721 marketplace for one-of-one stadium captures.

- Mint creates a unique NFT with IPFS metadata and lists it in native CHZ.
- Purchase transfers the NFT and sends the native-CHZ payment on-chain.
- Resales pay the original creator a 10% royalty; the seller receives the remainder.
- Direct NFT transfers automatically remove the listing, preventing a stale sale.

## Local verification

Install the Solidity dependency once, then run the tests:

```bash
forge install OpenZeppelin/openzeppelin-contracts@v5.2.0 --no-git --shallow
npm run contract:test
```

## Deploy to Chiliz Spicy testnet

1. Copy `.env.contract.example` to `.env.contract`.
2. Put a **testnet-only**, funded deployer key in `DEPLOYER_PRIVATE_KEY`. Do not commit or share this key.
3. Run:

```bash
npm run contract:deploy:spicy
```

The command prints the deployed contract address and transaction hash. Add the address to `NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS` in `.env.local`, then restart the app before enabling real client transactions.

Spicy uses chain ID `88882` and native CHZ. Its explorer is `https://testnet.chiliscan.com/`.
