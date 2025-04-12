// src/components/TransactionHistory.js

import React, { useEffect, useState } from "react";
import { contract } from "../infuraProvider";
import { formatEther } from "ethers";

const TransactionHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all Deposited events
        const depositEvents = await contract.queryFilter("Deposited", 0, "latest");
        const withdrawEvents = await contract.queryFilter("Withdrawn", 0, "latest");

        const parsedDeposits = await Promise.all(
          depositEvents.map(async (event) => {
            const { user, amount, unlockTime } = event.args;
            const block = await event.getBlock(); // Get timestamp
            return {
              type: "Deposit",
              user,
              amount: formatEther(amount),
              unlockTime: unlockTime.toString(),
              txHash: event.transactionHash,
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            };
          })
        );

        const parsedWithdrawals = await Promise.all(
          withdrawEvents.map(async (event) => {
            const { user, amount } = event.args;
            const block = await event.getBlock(); // Get timestamp
            return {
              type: "Withdraw",
              user,
              amount: formatEther(amount),
              unlockTime: null,
              txHash: event.transactionHash,
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            };
          })
        );

        setDeposits(parsedDeposits);
        setWithdrawals(parsedWithdrawals);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const renderRow = (tx, index) => (
    <tr key={index}>
      <td>{tx.type}</td>
      <td>{tx.user}</td>
      <td>{tx.amount} ETH</td>
      <td>{tx.unlockTime ? new Date(tx.unlockTime * 1000).toLocaleString() : "—"}</td>
      <td>{tx.timestamp}</td>
      <td>
        <a
          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      </td>
    </tr>
  );

  const allTxs = [...deposits, ...withdrawals].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div style={{ padding: "2rem", marginTop: "2rem" }}>
      <h2>📄 Public Vault Transaction History</h2>

      {allTxs.length === 0 ? (
        <p>Loading transactions...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>User</th>
              <th>Amount</th>
              <th>Unlock Time</th>
              <th>Date/Time</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>{allTxs.map(renderRow)}</tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;