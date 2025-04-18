// components/Button.tsx
'use client'

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define button variants using class-variance-authority
const buttonStyles = cva(
  // Base styles
  "rounded-2xl transition-colors duration-200 flex items-center justify-center", 
  {
    variants: {
      variant: {
        primary: "bg-custom-green-300 hover:bg-custom-green-500 text-custom-white-50 outline-5 outline-double outline-custom-green-300",
        outline: "bg-custom-white-50 border border-custom-green-300 hover:bg-custom-white-100 text-custom-green-300",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      isDisabled: {  // renamed from disabled to avoid conflict
        true: "opacity-50 cursor-not-allowed",
        false: "cursor-pointer",
      },
      size: {
        sm: "py-2 px-4 text-sm",
        md: "py-3 px-6",
        lg: "py-4 px-8 text-lg",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
      isDisabled: false,
      size: "md",
      iconPosition: "left",
    },
  }
);

// Define button props with class-variance-authority types
interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "outline";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  onPress,
  disabled = false,
  className = '',
  textClassName = '',
  fullWidth = false,
  size = 'md',
  type = 'button',
  ...props
}) => {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`${buttonStyles({ 
        variant, 
        fullWidth, 
        isDisabled: disabled, // map disabled to isDisabled
        size, 
        iconPosition 
      })} ${className}`}
      type={type}
      {...props}
    >
      {icon && (
        <span className={`${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}>
          {icon}
        </span>
      )}
      <span className={`font-poppins font-medium text-sm leading-snug ${textClassName}`}>
        {title}
      </span>
    </button>
  );
};

export default Button;