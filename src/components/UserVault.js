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
  const ethToEur = (eth) => eurRate ? (parseFloat(eth) * eurRate).toFixed(2) : null;

  const loadVault = async (signer) => {
    try {
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const [amount, unlockTime] = await contract.getMyVault();
      const now = Math.floor(Date.now() / 1000);

      setVaultInfo({
        amount: formatEther(amount),
        unlockTime: unlockTime.toString(),
      });

      setCanWithdraw(Number(amount) > 0 && now >= Number(unlockTime));
    } catch (err) {
      console.error("Vault fetch failed:", err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleString();
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
  }, [refreshSignal, walletAddress]);

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
    <div className="bg-white flex items-center justify-center overflow-hidden">
      <div className="w-96 bg-gradient-to-br from-purple-700 to-pink-500 rounded-2xl shadow-2xl relative">
        <div className="p-6 flex flex-col h-full justify-between relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Vault</h2>
            {walletAddress ? (
              <div className="text-sm text-gray-200 break-all mb-3">👛 {walletAddress}</div>
            ) : (
              <button onClick={connectWallet} className="w-full py-2 bg-white text-purple-700 rounded-lg font-semibold">
                🔌 Connect Wallet
              </button>
            )}
            {walletAddress && (
              <>
                {vaultInfo.amount !== "0.0" ? (
                  <div className="space-y-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xs text-gray-300 uppercase">Locked ETH</div>
                      <div className="text-2xl font-bold text-white">
                        {vaultInfo.amount} ETH
                        {eurRate && (
                          <span className="block text-sm text-gray-300 font-normal">
                            (~€{ethToEur(vaultInfo.amount)})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="text-xs text-gray-300 uppercase">Unlock Time</div>
                      <div className="text-lg font-medium text-white">{formatDate(vaultInfo.unlockTime)}</div>
                      {!canWithdraw && countdown && (
                        <p className="text-xs text-gray-300 mt-1">⏳ Unlocks In: {countdown}</p>
                      )}
                    </div>

                    {canWithdraw ? (
                      <button
                        onClick={handleWithdraw}
                        className="w-full py-2 bg-white text-purple-700 rounded-lg font-semibold"
                      >
                        💸 Withdraw
                      </button>
                    ) : (
                      <p className="text-center text-sm text-white">🔒 Vault is still locked</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white mt-4">🚫 No active vault found.</p>
                )}

                {status && (
                  <p className="text-xs text-white text-center mt-4">{status}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVault;