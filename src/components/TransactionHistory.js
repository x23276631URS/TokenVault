import React, { useEffect, useState } from "react";
import { contract } from "../infuraProvider";
import { formatEther } from "ethers";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const depositEvents = await contract.queryFilter("Deposited", 0, "latest");
        const withdrawEvents = await contract.queryFilter("Withdrawn", 0, "latest");

        const parsedDeposits = await Promise.all(
          depositEvents.map(async (event) => {
            const { user, amount, unlockTime } = event.args;
            const block = await event.getBlock();
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
            const block = await event.getBlock();
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

        const allTxs = [...parsedDeposits, ...parsedWithdrawals].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setTransactions(allTxs);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="pt-28 px-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📄 Public Vault Transaction History</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unlock Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr key={index}>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.type}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        tx.type === "Deposit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      {/* <img
                        className="h-8 w-8 rounded-full"
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${tx.user}`}
                        alt="avatar"
                      /> */}
                      <span>{tx.user}</span>
                      {/* <span className="truncate max-w-[180px]">{tx.user}</span> */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.amount} ETH</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tx.unlockTime ? new Date(tx.unlockTime * 1000).toLocaleString() : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;