'use client'

import React from 'react';
import { typography } from '../../utils/typography';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  textClassName?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
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
  type = 'button',
}) => {
  // Base styles for all buttons
  const baseStyles = "rounded-2xl py-3 px-6 transition-colors duration-200";
  
  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";
  
  // Variant specific styles
  const variantStyles = variant === 'primary'
    ? "bg-custom-green-300 hover:bg-custom-green-500 text-custom-white-50 outline-5 outline-double outline-custom-green-300"
    : "bg-custom-white-50 border border-custom-green-300 hover:bg-custom-white-100 text-custom-green-300";
  
  // Disabled styles
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  // Typography
  const textStyles = typography.subtitle2();

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${widthStyles} ${disabledStyles} ${className}`}
      type={type}
    >
      <div className={`flex items-center justify-center ${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
        {icon && (
          <span className={`${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}>
            {icon}
          </span>
        )}
        <span className={`${textStyles} ${textClassName}`}>{title}</span>
      </div>
    </button>
  );
};

export default Button;