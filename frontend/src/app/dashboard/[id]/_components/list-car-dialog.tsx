/* eslint-disable @typescript-eslint/no-explicit-any */
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Separator } from "@/components/ui/separator";

const ListCarDialog = ({
  isDialogOpen,
  onSubmit,
  loading,
  setIsDialogOpen,
  form,
}: IListCarDialog) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 text-white px-10">
          <Car className="mr-2 h-4 w-4" /> List Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[98%]  overflow-hidden px-0 border-amber-900">
        <DialogHeader className="px-6">
          <DialogTitle>List Your Vehicle</DialogTitle>
          <DialogDescription>
            Choose how you want to list your vehicle. You can set it for a
            normal sale or put it up for auction.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto px-6 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }: any) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Listing Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="normalSale" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Normal Sale
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="auction" />
                          </FormControl>
                          <FormLabel className="font-normal">Auction</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("listingType") === "normalSale" && (
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <Input placeholder="5 ETH" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set the fixed price for your vehicle.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("listingType") === "auction" && (
                <>
                  <FormField
                    control={form.control}
                    name="enableBuyout"
                    render={({ field }: any) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Buyout
                          </FormLabel>
                          <FormDescription>
                            Allow buyers to purchase immediately at a set price.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("enableBuyout") && (
                    <FormField
                      control={form.control}
                      name="buyoutPrice"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Buyout Price</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10 ETH"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Set the price at which a buyer can immediately
                            purchase the vehicle.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="startingPrice"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Starting Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.02 ETH"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Set the initial bidding price for the auction.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationUnit"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Duration Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the unit for the auction duration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Auction Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter auction duration"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Set how long the auction will last.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? "Listing..." :"List Vehicle"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListCarDialog;
