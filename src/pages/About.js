import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const starsContainer = document.getElementById("stars");
    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 3}px`;
      star.style.height = star.style.width;
      star.style.setProperty("--duration", `${Math.random() * 3 + 1}s`);
      starsContainer.appendChild(star);
    }
  }, []);

  return (
    <div
      className="bg-gray-900 min-h-screen w-screen flex items-center justify-center p-4 overflow-hidden relative"
    >
      <style>{`
        .space-animation {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle var(--duration) ease-in-out infinite;
          opacity: 0;
          z-index: 0;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .ufo-beam {
          animation: beam 2s ease-in-out infinite;
          transform-origin: top;
        }
        @keyframes beam {
          0%, 100% { transform: scaleY(0.8); opacity: 0.3; }
          50% { transform: scaleY(1.1); opacity: 0.7; }
        }
      `}</style>

      <div id="stars" className="fixed inset-0 z-0" />

      <div className="relative z-10 text-center max-w-3xl">
        {/* UFO */}
        <div className="space-animation mb-8">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
            <ellipse cx="50" cy="40" rx="30" ry="10" fill="#4F46E5" />
            <circle cx="50" cy="35" r="20" fill="#818CF8" />
            <ellipse cx="50" cy="30" rx="10" ry="5" fill="#C7D2FE" />
            <path
              d="M40 40 L30 80 L70 80 L60 40"
              fill="rgba(79, 70, 229, 0.2)"
              className="ufo-beam"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">About TokenVault</h1>
        <p className="text-lg text-blue-200 mb-6">
          TokenVault is a decentralized Web3 application that provides a secure and transparent way for users to lock
          their ETH for a defined period of time. Our platform leverages Ethereum smart contracts, Infura infrastructure,
          and real-time data APIs to bring users a seamless and engaging DeFi experience.
        </p>
        <p className="text-blue-200 mb-6">
          We aim to empower individuals with financial tools that are decentralized, trustworthy, and open to everyone.
          Whether you're locking ETH for savings, staking, or project vesting — TokenVault offers a simple and intuitive
          interface to manage your assets with confidence.
        </p>
        <p className="text-blue-200 mb-8">
          Built using React, Ethers.js, Tailwind CSS, and deployed with CI/CD pipelines on AWS Elastic Beanstalk.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transform hover:scale-105 transition"
          >
            Back to Home
          </a>
          <a
            href="https://github.com/x23276631URS/TokenVault"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transform hover:scale-105 transition"
          >
            GitHub Repo
          </a>
        </div>

        <div className="mt-10 text-sm text-gray-500">Made with ❤️ by Utkarsh Raj</div>
      </div>
    </div>
  );
};

export default About;