import type { StateCreator } from "zustand";
import type { AppStore, Moment } from "../types";
import { playSound } from "../utils";

export interface BuySlice {
  isBuying: boolean;
  buyStatus: string;
  buySuccess: boolean;
  setBuySuccess: (success: boolean) => void;
  handleBuyNFT: (moment: Moment) => void;
}

export const createBuySlice: StateCreator<AppStore, [], [], BuySlice> = (
  set,
  get
) => ({
  isBuying: false,
  buyStatus: "",
  buySuccess: false,
  setBuySuccess: (buySuccess) => set({ buySuccess }),

  handleBuyNFT: (moment: Moment) => {
    set({
      isBuying: true,
      buyStatus: "Initiating secure Fan Token exchange...",
    });

    setTimeout(() => {
      set({
        buyStatus: `Verifying allowance for ${moment.price} ${moment.tokenSymbol}...`,
      });
      setTimeout(() => {
        set({
          buyStatus:
            "Securing signature via gasless smart account relayer...",
        });
        setTimeout(() => {
          set({
            buyStatus:
              "Broadcasting order settlement to Chiliz mainnet...",
          });
          setTimeout(() => {
            set({
              buyStatus:
                "Transferring NFT and routing 10% royalty to creator...",
            });
            setTimeout(() => {
              const state = get();
              const symbol = moment.tokenSymbol;
              set((s) => {
                const balances = { ...s.userWallet.ftBalances };
                const b = balances as Record<string, number>;
                if (b[symbol] !== undefined) {
                  b[symbol] = Math.max(0, b[symbol] - moment.price);
                }
                return {
                  userWallet: { ...s.userWallet, ftBalances: balances },
                  moments: s.moments.map((m) =>
                    m.id === moment.id
                      ? {
                          ...m,
                          owner: {
                            username: state.userWallet.username,
                            avatar: state.userWallet.avatar,
                            address: state.userWallet.address,
                          },
                          isListed: false,
                        }
                      : m
                  ),
                  selectedMoment:
                    state.selectedMoment?.id === moment.id
                      ? {
                          ...state.selectedMoment,
                          owner: {
                            username: state.userWallet.username,
                            avatar: state.userWallet.avatar,
                            address: state.userWallet.address,
                          },
                          isListed: false,
                        }
                      : state.selectedMoment,
                  isBuying: false,
                  buySuccess: true,
                };
              });
              playSound("success");
            }, 1000);
          }, 1200);
        }, 1000);
      }, 800);
    }, 800);
  },
});
