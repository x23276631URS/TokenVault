import React, { useState } from "react";
import VaultDashboard from "../components/VaultDashboard";
import UserVault from "../components/UserVault";
import DepositForm from "../components/DepositForm";

const VaultPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshVault = () => setRefreshKey((prev) => prev + 1);

  return (
    <div>
      <VaultDashboard />
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-center px-6">
        <div className="w-full lg:w-1/2 flex justify-center">
          <UserVault refreshSignal={refreshKey} />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <DepositForm onDepositSuccess={refreshVault} />
        </div>
      </div>
    </div>
  );
};

export default VaultPage;
