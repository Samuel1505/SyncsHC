"use client";

export interface WalletConnectOptions {
  onSuccess: (address: string) => void;
  onCancel: () => void;
}

export async function connectStacksWallet({
  onSuccess,
  onCancel,
}: WalletConnectOptions): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const { showConnect, AppConfig, UserSession } = await import(
      "@stacks/connect"
    );

    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const userSession = new UserSession({ appConfig });

    showConnect({
      appDetails: {
        name: "SyncsHC",
        icon: `${window.location.origin}/favicon.ico`,
      },
      userSession,
      onFinish: () => {
        try {
          const userData = userSession.loadUserData();
          const address =
            userData?.profile?.stxAddress?.mainnet ||
            userData?.profile?.stxAddress?.testnet;
          if (address) {
            onSuccess(address);
          } else {
            onCancel();
          }
        } catch {
          onCancel();
        }
      },
      onCancel,
    });
  } catch (err) {
    console.warn("Wallet connection via @stacks/connect failed:", err);
    // Demo mode fallback
    onSuccess("SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02");
  }
}

export async function disconnectStacksWallet(): Promise<void> {
  try {
    const { AppConfig, UserSession } = await import("@stacks/connect");
    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const userSession = new UserSession({ appConfig });
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut("/");
    }
  } catch {
    // ignore
  }
}

export const MAINNET_CONTRACT = "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02";
export const PIGGY_BANK_CONTRACT = `${MAINNET_CONTRACT}.piggy-bank-registry`;
export const PENALTY_FEE_PERCENT = 5;
