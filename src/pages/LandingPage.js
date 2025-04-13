import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Blur */}
      <div
        className="absolute inset-0 blur-xl pointer-events-none"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      ></div>

      {/* Foreground Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 gap-12 text-gray-600 md:px-8 md:flex">
          {/* Left Text Content */}
          <div className="flex-none space-y-5 max-w-xl">
            <div className="inline-flex gap-x-6 items-center rounded-full p-1 pr-6 border text-sm font-medium duration-150 hover:bg-white">
              <span className="inline-block rounded-full px-3 py-1 bg-indigo-600 text-white">New</span>
              <p className="flex items-center">
                TokenVault is now live on Sepolia!
              </p>
            </div>

            <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
              Secure your ETH with time-locked vaults
            </h1>
            <p>
              Deposit, lock, and withdraw your funds safely using our decentralized application powered by Ethereum smart contracts.
            </p>

            <div className="flex items-center gap-x-3 sm:text-sm">
              <button
                onClick={() => navigate("/vault")}
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-full"
              >
                Explore Vault
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 hidden md:block">
            <img
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/c86a7ae02ac188442548f510b5393c04140515d7/undraw_progressive_app_m-9-ms_oftfv5.svg"
              alt="Vault Illustration"
              className="max-w-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}