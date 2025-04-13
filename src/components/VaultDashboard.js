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
    <div className="bg-white py-5 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
            TokenVault: Live Vault Overview
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Total ETH currently secured by the smart contract across all users.
          </p>
        </div>
      </div>

      <div className="mt-10 pb-1">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-white"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="rounded-lg bg-gray-50 shadow-lg sm:grid sm:grid-cols-1">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0">
                  {/* <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Total ETH Locked
                  </dt> */}
                  <dd className="order-1 text-3xl font-extrabold text-gray-700">
                    {totalVaultETH ? (
                      <>
                        {totalVaultETH} ETH
                        {eurRate && (
                          <span className="block text-xl text-gray-400 font-medium mt-1">
                            (~€ {ethToEur(totalVaultETH)})
                          </span>
                        )}
                      </>
                    ) : (
                      "Loading..."
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDashboard;