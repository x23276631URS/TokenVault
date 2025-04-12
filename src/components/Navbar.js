// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: "1rem", background: "#f2f2f2" }}>
    <h2>🛡️ TokenVault</h2>
    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
      <Link to="/">Home</Link>
      <Link to="/vault">Vault</Link>
      <Link to="/history">History</Link>
    </div>
  </nav>
);

export default Navbar;