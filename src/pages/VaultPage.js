// src/pages/VaultPage.js

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
      <UserVault refreshSignal={refreshKey} />
      <DepositForm onDepositSuccess={refreshVault} />
    </div>
  );
};

export default VaultPage;