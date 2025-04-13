import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NavItem({ text, route, currentPath }) {
  const navigate = useNavigate();
  const isActive = currentPath === route;

  return (
    <div
      className={`py-2 cursor-pointer ${
        isActive ? "text-indigo-600 font-semibold" : "text-neutral-900"
      }`}
      onClick={() => navigate(route)}
    >
      {text}
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    } else {
      alert("Please install MetaMask to use this DApp.");
    }
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  // const formatAddress = (addr) =>
  //   addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const navItems = [
    { text: "Home", route: "/" },
    { text: "Vault", route: "/vault" },
    { text: "History", route: "/history" },
    { text: "About Us", route: "/about" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex gap-5 justify-between items-center py-1.5 px-6 rounded-none backdrop-blur-[17.5px] bg-opacity-80 flex-wrap sm:flex-nowrap sm:py-4 sm:px-10 bg-white shadow-md">
      {/* Left: Logo */}
      <div className="flex gap-2 items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/96ed444f12f2297ccd4006841bd1831940e6f23d36396492d16831d2cdf15c29?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&"
          className="aspect-[1.14] w-[41px]"
          alt="Logo"
        />
        <div className="uppercase font-extrabold text-lg text-zinc-950">
          TokenVault
        </div>
      </div>

      {/* Center: Navigation */}
      <nav className="flex sm:flex-row flex-col gap-5 justify-center items-center text-base text-center font-light">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            text={item.text}
            route={item.route}
            currentPath={currentPath}
          />
        ))}
      </nav>

      {/* Right: Wallet Connect / Disconnect */}
      {walletAddress ? (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="px-4 py-2 text-sm leading-6 text-white bg-blue-500 rounded-xl font-light text-center">
            👛 {walletAddress}
          </span>
          <button
            onClick={() => {
              setWalletAddress("");
              localStorage.removeItem("walletAddress");
            }}
            className="px-4 py-2 text-sm leading-6 text-white bg-red-500 hover:bg-red-600 rounded-xl font-light"
          >
            🔌 Disconnect
          </button>
        </div>
      ) : (
        <button
          className="px-6 py-3 text-sm leading-6 text-white rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition font-light w-full sm:w-auto"
          onClick={connectWallet}
        >
          🔌 Connect MetaMask
        </button>
      )}
    </div>
  );
}

export default Navbar;