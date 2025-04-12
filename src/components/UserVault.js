// src/components/UserVault.js

import React, { useEffect, useState } from "react";
import { Contract, BrowserProvider, formatEther } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";
import useEthToEur from "../hooks/useEthToEur";

const UserVault = ({ refreshSignal }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultInfo, setVaultInfo] = useState({ amount: "0.0", unlockTime: "0" });
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState("");

  const eurRate = useEthToEur();
  const ethToEur = (eth) =>
    eurRate ? (parseFloat(eth) * eurRate).toFixed(2) : null;

  const loadVault = async (signer) => {
    try {
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const [amount, unlockTime] = await contract.getMyVault();
      const now = Math.floor(Date.now() / 1000);

      setVaultInfo({
        amount: formatEther(amount),
        unlockTime: unlockTime.toString(),
      });

      if (Number(amount) > 0 && now >= Number(unlockTime)) {
        setCanWithdraw(true);
      } else {
        setCanWithdraw(false);
      }
    } catch (err) {
      console.error("Vault fetch failed:", err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    const d = new Date(Number(timestamp) * 1000);
    return d.toLocaleString();
  };

  const formatCountdown = (secondsLeft) => {
    if (secondsLeft <= 0) return null;
    const h = Math.floor(secondsLeft / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    const pad = (v) => String(v).padStart(2, "0");
    return `${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
  };

  useEffect(() => {
    if (!vaultInfo.unlockTime || vaultInfo.unlockTime === "0") return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const unlock = Number(vaultInfo.unlockTime);
      const secondsLeft = unlock - now;

      if (secondsLeft <= 0) {
        setCanWithdraw(true);
        setCountdown("00h : 00m : 00s");
        clearInterval(interval);
      } else {
        setCountdown(formatCountdown(secondsLeft));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [vaultInfo.unlockTime]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      setWalletAddress(accounts[0]);
      await loadVault(signer);
    } catch (err) {
      console.error("MetaMask error:", err);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      const refresh = async () => {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await loadVault(signer);
      };
      refresh();
    }
  }, [refreshSignal,walletAddress]);

  const handleWithdraw = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.withdraw();
      setStatus("⏳ Withdrawing...");
      await tx.wait();

      setStatus("✅ Withdraw successful!");
      setCountdown("");
      await loadVault(signer);
    } catch (err) {
      console.error("Withdraw failed:", err);
      setStatus(`❌ Withdraw failed: ${err?.message || "Unknown error"}`);
    }
  };

  return (
    <div style={{ padding: "2rem", marginTop: "2rem" }}>
      <h2>👤 My Vault</h2>

      {!walletAddress ? (
        <button onClick={connectWallet}>🔌 Connect Wallet</button>
      ) : (
        <>
          <p>👛 Wallet: {walletAddress}</p>

          {vaultInfo.amount !== "0.0" ? (
            <>
              <p>
                💰 Locked ETH: {vaultInfo.amount} ETH{" "}
                {eurRate && (
                  <span style={{ fontSize: "0.9em", color: "gray" }}>
                    (~€{ethToEur(vaultInfo.amount)})
                  </span>
                )}
              </p>
              <p>📆 Unlock Time: {formatDate(vaultInfo.unlockTime)}</p>

              {canWithdraw ? (
                <button onClick={handleWithdraw}>💸 Withdraw</button>
              ) : (
                <>
                  <p>⏳ Unlocks In: {countdown}</p>
                  <p>🔒 Vault is still locked</p>
                </>
              )}
            </>
          ) : (
            <p>🚫 You have no active vault. Use the deposit form to lock ETH.</p>
          )}

          {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
        </>
      )}
    </div>
  );
};

export default UserVault;