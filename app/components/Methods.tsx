'use client';
import './Methods.css';

import { useState, useEffect } from 'react';
import { useDynamicContext, useIsLoggedIn, useUserWallets } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from '@dynamic-labs/ethereum'
import {
  isZeroDevConnector,
  ZeroDevSmartWalletConnectors,
} from "@dynamic-labs/ethereum-aa";
import { createEcdsaKernelMigrationAccount } from "@zerodev/ecdsa-validator";
import { KERNEL_V3_1, KERNEL_V3_2, getEntryPoint } from "@zerodev/sdk/constants"
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { Signer } from '@zerodev/sdk/types';
import { getIntentExecutorPluginData, INTENT_V0_3, createIntentClient } from "@zerodev/intent";
import { createZeroDevPaymasterClient } from "@zerodev/sdk";

interface DynamicMethodsProps {
  isDarkMode: boolean;
}

const chain = sepolia;

export default function DynamicMethods({ isDarkMode }: DynamicMethodsProps) {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet, user } = useDynamicContext();
  const userWallets = useUserWallets();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState('');


  const safeStringify = (obj: unknown): string => {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      },
      2
    );
  };


  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  function clearResult() {
    setResult('');
  }

  function showUser() {
    setResult(safeStringify(user));
  }

  function showUserWallets() {
    setResult(safeStringify(userWallets));
  }


  async function fetchPublicClient() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const publicClient = await primaryWallet.getPublicClient();
    setResult(safeStringify(publicClient));
  }

  async function fetchWalletClient() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const walletClient = await primaryWallet.getWalletClient();
    setResult(safeStringify(walletClient));
  }

  async function fetchIntentClient() {
    if (!primaryWallet) return;

    // Get the dynamicWalletClient, we will use in the next section
    const { connector } = primaryWallet;
    
    if (!isZeroDevConnector(connector)) {
      return;
    }

    const signerConnector = connector.getEOAConnector();
    const signer = await signerConnector?.getSigner();

    const publicClient = createPublicClient({
      // Use your own RPC provider (e.g. Infura/Alchemy).
      transport: http(),
      chain,
    })
    const intentAccount = await createEcdsaKernelMigrationAccount(publicClient, {
      entryPoint: getEntryPoint("0.7"),
      signer: signer as Signer,
      migrationVersion: {
        from: KERNEL_V3_1,
        to: KERNEL_V3_2,
      },
      pluginMigrations: [getIntentExecutorPluginData(INTENT_V0_3)],
    });
    const paymasterClient = createZeroDevPaymasterClient({
      chain,
      transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC_URL),
    });
    const intentClient = createIntentClient({
      account: intentAccount,
      chain,
      bundlerTransport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC_URL),
      paymaster: {
        getPaymasterData: async (userOperation) => {
          return await paymasterClient.sponsorUserOperation({
            userOperation,
          });
        },
      },
      version: INTENT_V0_3,
    });
    
    setResult(safeStringify(intentClient));
  }

  async function signEthereumMessage() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const signature = await primaryWallet.signMessage("Hello World");

    if (typeof signature !== "string") {
      setResult("No signature returned");
      return;
    }
    setResult(signature);
  }


   return (
    <>
      {!isLoading && (
        <div className="dynamic-methods" data-theme={isDarkMode ? 'dark' : 'light'}>
          <div className="methods-container">
            <button className="btn btn-primary" onClick={showUser}>Fetch User</button>
            <button className="btn btn-primary" onClick={showUserWallets}>Fetch User Wallets</button>

            
      {primaryWallet && isEthereumWallet(primaryWallet) && (
          <>
            <button className="btn btn-primary" onClick={fetchPublicClient}>
              Fetch Public Client
            </button>
            <button className="btn btn-primary" onClick={fetchWalletClient}>
              Fetch Wallet Client
            </button>
            <button className="btn btn-primary" onClick={fetchIntentClient}>
              Fetch Intent Client
            </button>
            <button className="btn btn-primary" onClick={signEthereumMessage}>
              Sign &quot;Hello World&quot; on Ethereum
            </button>
          </>
        )}

        </div>
          {result && (
            <div className="results-container">
              <pre className="results-text">{result}</pre>
            </div>
          )}
          {result && (
            <div className="clear-container">
              <button className="btn btn-primary" onClick={clearResult}>Clear</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}