"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

export const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  ({ className, value, defaultValue, ...props }, ref) => {
    const values =
      (value as number[] | undefined) ??
      (defaultValue as number[] | undefined) ??
      [0]
    const thumbs = Array.isArray(values) ? values.length : 1
    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value as number[] | undefined}
        defaultValue={defaultValue as number[] | undefined}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbs }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    )
  }
)
RangeSlider.displayName = "RangeSlider"

