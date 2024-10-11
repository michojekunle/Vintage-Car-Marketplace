"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const steps = ["Car Details", "Verification", "Mint NFT"]

export default function AddNewCar() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    mileage: "",
    condition: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // For demo purposes, we'll just move to the next step
    handleNext()
  }

  return (
    <Card className="max-w-2xl mx-auto py-8 px-6">
      <CardHeader className="text-center text-2xl text-primary-action mb-6">
        <CardTitle>Add New Car - {steps[currentStep]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  index <= currentStep ? "text-amber-600 dark:text-amber-400" : "text-gray-400"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
            <div
              className="absolute left-0 top-1/2 h-0.5 bg-amber-600 dark:bg-amber-400 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
            <div className="relative flex justify-between">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${
                    index <= currentStep
                      ? "bg-amber-600 dark:bg-amber-400"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {currentStep === 0 && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    className="py-6"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    className="py-6"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    className="py-6"
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vin">VIN</Label>
                  <Input
                    className="py-6"
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  className="py-6"
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="mb-4">Condition</Label>
                <RadioGroup
                  name="condition"
                  value={formData.condition}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, condition: value }))}
                >
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">Excellent</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair">Fair</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </form>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <p>We are verifying your car details. This may take a few moments.</p>
            {/* Add a loading spinner or progress indicator here */}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p>Your car has been verified. We are now minting an NFT for your car.</p>
            {/* Add NFT minting progress or confirmation here */}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-6">
        <Button onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}