// src/components/VaultDashboard.js

import React, { useEffect, useState } from "react";
import { contract } from "../infuraProvider";
import { formatEther } from "ethers";
import useEthToEur from "../hooks/useEthToEur";

const VaultDashboard = () => {
  const [totalVaultETH, setTotalVaultETH] = useState(null);
  const eurRate = useEthToEur();

  useEffect(() => {
    const fetchVaultBalance = async () => {
      try {
        const balance = await contract.getContractBalance();
        const formatted = formatEther(balance);
        setTotalVaultETH(formatted);
      } catch (err) {
        console.error("Error fetching vault balance:", err);
      }
    };

    fetchVaultBalance();
  }, []);

  const ethToEur = (eth) =>
    eurRate ? (parseFloat(eth) * eurRate).toFixed(2) : null;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💼 TokenVault Overview</h2>
      {totalVaultETH ? (
        <p>
          🔐 Total ETH Locked: {totalVaultETH} ETH{" "}
          {eurRate && (
            <span style={{ fontSize: "0.9em", color: "gray" }}>
              (~€{ethToEur(totalVaultETH)})
            </span>
          )}
        </p>
      ) : (
        <p>Loading vault balance...</p>
      )}
    </div>
  );
};

export default VaultDashboard;