// components/Typography.tsx
import React from 'react';
import { typography, text, type TextProps, type TypographyVariants } from '../utils/typography'

interface BaseTypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Text = ({
  children,
  className = '',
  as: Component = 'p',
  size,
  weight,
  color,
  leading,
  tracking,
  font,
  transform,
  ...props
}: BaseTypographyProps) => {
  return (
    <Component
      className={`${text({ size, weight, color, leading, tracking, font, transform })} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Create components for each typography variant
const createTypographyComponent = (
  variant: TypographyVariants,
  defaultElement: React.ElementType
) => {
  const Component = ({
    children,
    className = '',
    as,
    size,
    weight,
    color,
    leading,
    tracking,
    font,
    transform,
    ...props
  }: BaseTypographyProps) => {
    const Element = as || defaultElement;
    
    return (
      <Element
        className={`${typography[variant]({ 
          size, 
          weight, 
          color, 
          leading, 
          tracking, 
          font,
          transform 
        })} ${className}`}
        {...props}
      >
        {children}
      </Element>
    );
  };
  
  return Component;
};

export const H1 = createTypographyComponent('h1', 'h1');
export const H2 = createTypographyComponent('h2', 'h2');
export const H3 = createTypographyComponent('h3', 'h3');
export const Title = createTypographyComponent('title', 'p');
export const Subtitle = createTypographyComponent('subtitle', 'p');
export const Body = createTypographyComponent('body', 'p');
export const Caption = createTypographyComponent('caption', 'p');
export const Overline = createTypographyComponent('overline', 'p');