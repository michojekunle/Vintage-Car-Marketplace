import React from 'react'
import UserCarDetail from '../../components/UserCarDetail'
import { Button } from '@/components/ui/button';

const page = () => {
  const connectedWalletAddress = "0x1234...abcd"; 
  return (
    <div>
      <UserCarDetail/>
    </div>
  )
}

export default page