import React, { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";

const DepositForm = ({ onDepositSuccess }) => {
  const [ethAmount, setEthAmount] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [status, setStatus] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      if (!ethAmount || isNaN(ethAmount) || Number(ethAmount) <= 0) {
        return alert("Please enter a valid ETH amount.");
      }

      const h = parseInt(hours || "0", 10);
      const m = parseInt(minutes || "0", 10);
      const s = parseInt(seconds || "0", 10);

      const totalSeconds = h * 3600 + m * 60 + s;
      if (totalSeconds <= 0) {
        return alert("Lock time must be greater than 0 seconds.");
      }

      const valueInWei = parseEther(ethAmount);
      setStatus("📤 Sending transaction...");

      const tx = await contract.deposit(totalSeconds, {
        value: valueInWei,
      });

      await tx.wait();
      setStatus("✅ Deposit successful!");

      setEthAmount("");
      setHours("");
      setMinutes("");
      setSeconds("");

      if (onDepositSuccess) onDepositSuccess();
    } catch (err) {
      console.error("Deposit failed:", err);
      const reason = err?.message?.split("reason=")?.[1]?.split(",")[0] || err.message;
      setStatus(`❌ Deposit failed: ${reason}`);
    }
  };

  const h = parseInt(hours || "0", 10);
  const m = parseInt(minutes || "0", 10);
  const s = parseInt(seconds || "0", 10);
  const totalSeconds = h * 3600 + m * 60 + s;
  const unlockDate = totalSeconds > 0 ? new Date(Date.now() + totalSeconds * 1000).toLocaleString() : null;

  return (
    <div className="w-full max-w-lg mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium mb-6">💸 Deposit ETH into Vault</h2>
        <form onSubmit={handleDeposit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="eth-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                id="eth-amount"
                placeholder="e.g. 0.5"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lock Duration</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  id="hh"
                  placeholder="hh"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  id="mm"
                  placeholder="mm"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  id="ss"
                  placeholder="ss"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {totalSeconds > 0 && (
            <div className="mt-6 text-sm text-gray-800 bg-gray-100 p-4 rounded-lg">
              <p>⏱️ <strong>{totalSeconds}</strong> seconds lock duration</p>
              <p>🧠 Unlocks at: <strong>{unlockDate}</strong></p>
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg focus:outline-none"
            >
              🔒 Lock ETH
            </button>
          </div>
        </form>
        {status && <p className="text-sm text-center text-gray-700 mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default DepositForm;