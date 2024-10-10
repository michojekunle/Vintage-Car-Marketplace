"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

const buttonVariants = {
  primary: "bg-white text-primary hover:bg-blue-100 text-center",
  secondary:
    "bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-center",
};

export const sizeVariants = {
  sm: "w-fit",
  lg: "w-full",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  className?: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "sm",
  onClick,
  type,
  loading,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`
      text-md font-semibold px-6 py-2 leading-[21px] rounded-full ${
        loading && "flex items-center justify-center"
      } 
      ${buttonVariants[variant]}, ${sizeVariants[size]}
      ${(loading || disabled) && "cursor-not-allowed bg-opacity-[40%]"},
      ${className}
    `}
      onClick={onClick}
      {...rest}
    >
      <span className={`text-center ${loading && "flex items-center gap-2"}`}>
        {label}
        {loading && (
          <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" />
        )}
      </span>
    </button>
  );
};

export default Button;
