import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Car, Wallet, Search, Bell, Menu, Clock, Star, Shield, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [connectedWallet, setConnectedWallet] = useState(false)

  const connectWallet = () => {
    // Simulating wallet connection
    setConnectedWallet(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 text-gray-800">
      <header className="border-b border-amber-200 sticky top-0 z-50 bg-amber-50 bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Car className="h-8 w-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-amber-800">VintageChain</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#marketplace" className="text-amber-800 hover:text-amber-600 transition-colors">Marketplace</a>
            <a href="#auctions" className="text-amber-800 hover:text-amber-600 transition-colors">Auctions</a>
            <a href="#services" className="text-amber-800 hover:text-amber-600 transition-colors">Mechanic Services</a>
            <a href="#verification" className="text-amber-800 hover:text-amber-600 transition-colors">Verification</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {connectedWallet ? (
              <Button variant="outline" className="bg-gradient-to-r from-amber-500 to-orange-400 text-white">
                <Wallet className="h-4 w-4 mr-2" />
                0x1234...5678
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white" onClick={connectWallet}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section id="hero" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-900">Discover, Collect, and Trade<br />Vintage Cars as NFTs</h2>
          <p className="text-xl text-amber-700 mb-8">Experience the fusion of classic automobiles and blockchain technology</p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">Explore Marketplace</Button>
            <Button variant="outline" className="text-amber-800 border-amber-600 hover:bg-amber-100">Learn More</Button>
          </div>
        </section>

        <section id="marketplace" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-amber-900">NFT Marketplace</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "1965 Ford Mustang", price: "45 ETH", image: "/placeholder.svg?height=300&width=400&text=1965+Ford+Mustang", status: "For Sale" },
              { name: "1957 Chevrolet Bel Air", price: "62 ETH", image: "/placeholder.svg?height=300&width=400&text=1957+Chevrolet+Bel+Air", status: "Auction" },
              { name: "1970 Dodge Challenger", price: "58 ETH", image: "/placeholder.svg?height=300&width=400&text=1970+Dodge+Challenger", status: "For Sale" }
            ].map((car, index) => (
              <Card key={index} className="bg-white border-amber-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{car.name}</span>
                    <Badge variant={car.status === "For Sale" ? "secondary" : "destructive"}>{car.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={car.image} alt={car.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <p className="text-amber-700 mb-2">A beautifully restored classic, tokenized as an NFT.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-amber-800">{car.price}</span>
                    <Button variant="outline" size="sm" className="text-amber-700 border-amber-400">
                      <Shield className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    {car.status === "For Sale" ? "Buy Now" : "Place Bid"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="auctions" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-amber-900">Live Auctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "1969 Chevrolet Camaro", currentBid: "75 ETH", timeLeft: "2h 45m", image: "/placeholder.svg?height=300&width=400&text=1969+Chevrolet+Camaro" },
              { name: "1963 Aston Martin DB5", currentBid: "120 ETH", timeLeft: "4h 30m", image: "/placeholder.svg?height=300&width=400&text=1963+Aston+Martin+DB5" },
            ].map((auction, index) => (
              <Card key={index} className="bg-white border-amber-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{auction.name}</span>
                    <Badge variant="destructive">
                      <Clock className="h-4 w-4 mr-2" />
                      {auction.timeLeft}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={auction.image} alt={auction.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-700">Current Bid</span>
                    <span className="text-lg font-semibold text-amber-800">{auction.currentBid}</span>
                  </div>
                  <Input type="number" placeholder="Enter bid amount" className="mb-2" />
                  <div className="flex justify-between">
                    <Button variant="outline" className="text-amber-700 border-amber-400">Place Bid</Button>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Buyout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="services" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-amber-900">Mechanic Services</h3>
          <Card className="bg-white border-amber-200">
            <CardHeader>
              <CardTitle>Book a Service</CardTitle>
              <CardDescription>Schedule maintenance or repairs for your vintage car</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="book" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="book">Book Service</TabsTrigger>
                  <TabsTrigger value="history">Service History</TabsTrigger>
                </TabsList>
                <TabsContent value="book">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="car" className="block text-sm font-medium text-amber-700">Select Car</label>
                      <select id="car" className="mt-1 block w-full rounded-md bg-amber-50 border-amber-300 focus:border-amber-500 focus:ring-amber-500">
                        <option>1965 Ford Mustang</option>
                        <option>1957 Chevrolet Bel Air</option>
                        <option>1970 Dodge Challenger</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-amber-700">Service Type</label>
                      <select id="service" className="mt-1 block w-full rounded-md bg-amber-50 border-amber-300 focus:border-amber-500 focus:ring-amber-500">
                        <option>General Maintenance</option>
                        <option>Engine Repair</option>
                        <option>Body Work</option>
                        <option>Electrical System</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-amber-700">Preferred Date</label>
                      <Input type="date" id="date" className="mt-1" />
                    </div>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Schedule Service</Button>
                  </form>
                </TabsContent>
                <TabsContent value="history">
                  <div className="space-y-4">
                    {[
                      { date: "2024-02-15", service: "Oil Change", mechanic: "John Doe", rating: 4.8 },
                      { date: "2023-11-20", service: "Brake Replacement", mechanic: "Jane Smith", rating: 4.9 },
                    ].map((record, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-amber-100 rounded-md">
                        <div>
                          <p className="font-medium text-amber-800">{record.service}</p>
                          <p className="text-sm text-amber-600">{record.date} by {record.mechanic}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 mr-1" />
                          <span>{record.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section id="verification" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-amber-900">Verification Center</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-amber-200">
              <CardHeader>
                <CardTitle>Car Verification</CardTitle>
                <CardDescription>Verify your vintage car before minting as an NFT</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="vin" className="block text-sm font-medium text-amber-700">Vehicle Identification Number (VIN)</label>
                    <Input type="text" id="vin" placeholder="Enter VIN" />
                  </div>
                  <div>
                    <label htmlFor="documents" className="block text-sm font-medium text-amber-700">Upload Documents</label>
                    <Input type="file" id="documents" className="mt-1" />
                  </div>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Submit for Verification</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-white border-amber-200">
              <CardHeader>
                <CardTitle>Mechanic Verification</CardTitle>
                <CardDescription>Get verified to offer services on VintageChain</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-amber-700">Professional License Number</label>
                    <Input type="text" id="license" placeholder="Enter license number" />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-amber-700">Years of Experience</label>
                    <Slider defaultValue={[5]} max={50} step={1} className="mt-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-700">Available for Emergency Services</span>
                    <Switch />
                  </div>
                  <Button className="w-full  bg-amber-500 hover:bg-amber-600 text-white">Apply for Verification</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-amber-900">Join Our Community</h3>
          <p className="text-amber-700 mb-6">Stay updated on new listings, auctions, and exclusive events</p>
          <div className="flex justify-center">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-200 mt-16 bg-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-amber-900">About VintageChain</h4>
              <p className="text-amber-700">Revolutionizing vintage car ownership and maintenance through blockchain technology.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-900">Quick Links</h4>
              <ul className="space-y-2 text-amber-700">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Auctions</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Mechanic Services</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Verification</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-900">Legal</h4>
              <ul className="space-y-2 text-amber-700">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">KYC/AML Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-900">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-amber-600 hover:text-amber-500 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-amber-600 hover:text-amber-500 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-amber-600 hover:text-amber-500 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-200 text-center text-amber-700">
            <p>&copy; 2024 VintageChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}