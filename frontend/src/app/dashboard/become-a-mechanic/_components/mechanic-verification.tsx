import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Lock, CheckCircle } from "lucide-react"
import { ethers } from 'ethers';

export default function MechanicVerification() {



  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-left mb-8 text-amber-700 border-amber-700 pb-4">Mechanic Verification</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="w-full bg-[#E6D5B8] border-2 border-amber-700 shadow-lg">
          <CardHeader className="border-b border-amber-700">
            <CardTitle className="text-2xl text-amber-700">Standard Mechanic Test</CardTitle>
            <CardDescription className="text-[#5C4033]">Prove your basic mechanic skills</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#D2B48C] text-amber-700 border border-amber-700">10 Questions</Badge>
                <Badge variant="secondary" className="bg-[#D2B48C] text-amber-700 border border-amber-700">
                  <Clock className="w-4 h-4 mr-1" />
                  12 Minutes
                </Badge>
              </div>
              <p className="text-sm text-[#5C4033]">
                Complete this test to verify your standard mechanic skills and unlock the advanced test.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-amber-700 hover:bg-[#A0522D] text-[#F8F3E6]">Start Test</Button>
          </CardFooter>
        </Card>

        <Card className="w-full bg-[#E6D5B8] border-2 border-amber-700 shadow-lg opacity-80">
          <CardHeader className="border-b border-amber-700">
            <CardTitle className="text-2xl text-amber-700 flex items-center space-x-2">
              <span>Advanced Mechanic Test</span>
              <Lock className="w-5 h-5 text-amber-700" />
            </CardTitle>
            <CardDescription className="text-[#5C4033]">Prove your advanced mechanic skills</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-[#D2B48C] text-amber-700 border border-amber-700">Coming Soon</Badge>
              <p className="text-sm text-[#5C4033]">
                This test will be available after passing the Standard Mechanic Test.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#A9A9A9] text-[#F8F3E6] cursor-not-allowed" disabled>Locked</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-amber-700">Your Verification Status</h2>
        <div className="inline-flex items-center space-x-2 bg-[#D2B48C] p-3 rounded-md border border-amber-700">
          <CheckCircle className="w-5 h-5 text-[#006400]" />
          <span className="text-[#5C4033]">Basic Profile Completed</span>
        </div>
      </div>
    </div>
  )
}