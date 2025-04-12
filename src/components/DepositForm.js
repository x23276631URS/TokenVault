// src/components/DepositForm.js

import React, { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contract";

const DepositForm = ({ onDepositSuccess }) => {
  const [ethAmount, setEthAmount] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [status, setStatus] = useState("");

  const handleDeposit = async () => {
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

      // Clear form
      setEthAmount("");
      setHours("");
      setMinutes("");
      setSeconds("");

      // 🔁 Trigger refresh
      if (onDepositSuccess) onDepositSuccess();
    } catch (err) {
      console.error("Deposit failed:", err);
      const reason = err?.message?.split("reason=")?.[1]?.split(",")[0] || err.message;
      setStatus(`❌ Deposit failed: ${reason}`);
    }
  };

  return (
    <div style={{ padding: "2rem", marginTop: "2rem" }}>
      <h2>💸 Deposit ETH into Vault</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Amount (ETH):</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="e.g. 0.5"
        />
      </div>

      <div>
        <label>Lock Duration:</label>
        <div style={{ display: "flex", gap: "10px", margin: "0.5rem 0" }}>
          <input
            type="number"
            min="0"
            placeholder="hh"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="mm"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="ss"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleDeposit} style={{ marginTop: "1rem" }}>
        🔒 Lock ETH
      </button>

      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
};

export default DepositForm;
