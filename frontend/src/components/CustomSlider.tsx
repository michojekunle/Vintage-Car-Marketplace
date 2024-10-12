"use client";

import { forwardRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export const CustomSlider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-amber-100">
      <SliderPrimitive.Range className="absolute h-full bg-amber-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-secondary-action bg-background ring-offset-background transition-colors focus-visible:outline-none  focus-visible:outline-secondary-action focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-secondary-action bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:outline-secondary-action focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));

CustomSlider.displayName = SliderPrimitive.Root.displayName;
