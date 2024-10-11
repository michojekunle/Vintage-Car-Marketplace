import React from 'react';
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface ButtonInputProps {
  value?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const ButtonInput = React.forwardRef<HTMLButtonElement, ButtonInputProps>(
  ({ className, value, onClick, icon, placeholder, ...props }, ref) => {
    return (
      <FormControl>
        <Button
          ref={ref}
          type="button"
          onClick={onClick}
          className={cn(
            " justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          {...props}
        >
          {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
          {value || placeholder || "Select..."}
        </Button>
      </FormControl>
    );
  }
);
ButtonInput.displayName = "ButtonInput";

export { ButtonInput };