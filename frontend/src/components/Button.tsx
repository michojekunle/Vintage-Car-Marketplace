import React from "react";

type ButtonProps = {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  className,
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`outline-none px-3 md:px-6 min-w-[112px] font-inter   lg:min-w-[190px] h-[54px] flex justify-center items-center group bg-accent  hover:bg-opacity-90 transition-opacity ease-linear delay-150 ${
        disabled
          ? "!bg-opacity-70 cursor-not-allowed"
          : "bg-opacity-100 cursor-pointer"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
