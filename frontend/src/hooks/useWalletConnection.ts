import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

function useWalletConnection() {
  const { isConnected, address } = useAccount();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isConnected,
    address,
    isReady,
  };
}

export default useWalletConnection;