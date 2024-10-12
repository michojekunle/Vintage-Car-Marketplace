import React from 'react'
import CarDetails from '../../components/CarDetails'
import { Button } from '@/components/ui/button';

const page = () => {
  const connectedWalletAddress = "0x1234...abcd"; //dummy address

  return (
    <div>
        {/* Real Navbar will replace this */}
     <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">VINTAGECARS</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{connectedWalletAddress}</span>
          <Button variant="outline" className="text-red-600">
            Disconnect
          </Button>
        </div>
      </nav>
    </header>
      <CarDetails/>
    </div>
  )
}

export default page
