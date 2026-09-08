FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts --no-audit --no-fund

FROM deps AS builder
ARG NEXT_PUBLIC_PRIVY_APP_ID
ARG NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_CHILIZ_CHAIN_ID
ARG NEXT_PUBLIC_CHILIZ_RPC_URL
ENV NEXT_PUBLIC_PRIVY_APP_ID=$NEXT_PUBLIC_PRIVY_APP_ID
ENV NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS=$NEXT_PUBLIC_MATCHDAY_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_CHILIZ_CHAIN_ID=$NEXT_PUBLIC_CHILIZ_CHAIN_ID
ENV NEXT_PUBLIC_CHILIZ_RPC_URL=$NEXT_PUBLIC_CHILIZ_RPC_URL
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
