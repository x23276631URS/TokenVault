// src/hooks/useEthToEur.js

import { useState, useEffect } from "react";
import axios from "axios";

const useEthToEur = () => {
  const [eurPrice, setEurPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur"
        );
        setEurPrice(res.data.ethereum.eur);
      } catch (err) {
        console.error("Failed to fetch ETH/EUR:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return eurPrice;
};

export default useEthToEur;