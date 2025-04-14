// utils/typography.ts
import { cva } from 'class-variance-authority';

export const typography = {
  title: cva([
    'font-poppins font-semibold text-[19px] leading-7'
  ]),
  
  subtitle1: cva([
    'font-poppins font-normal text-base leading-6'
  ]),
  
  subtitle2: cva([
    'font-poppins font-medium text-sm leading-[22px]'
  ]),
  
  body1: cva([
    'font-poppins font-normal text-[15px] leading-6'
  ]),
  
  body2: cva([
    'font-poppins font-normal text-sm leading-[22px]'
  ]),
  
  caption: cva([
    'font-poppins font-medium text-xs leading-5'
  ]),
  
  overline: cva([
    'font-poppins font-medium text-[10px] leading-[18px]'
  ]),
};

// Helper to create scaled typography
export function createScaledTypography(scale: number = 1) {
  // This is a simplified version - in a real implementation
  // you might want to use CSS variables or dynamically 
  // generate classes based on the scale factor
  const scaleClass = scale === 1 ? '' : `scale-${scale*100}`;
  
  return {
    title: `${typography.title()} ${scaleClass}`,
    subtitle1: `${typography.subtitle1()} ${scaleClass}`,
    subtitle2: `${typography.subtitle2()} ${scaleClass}`,
    body1: `${typography.body1()} ${scaleClass}`,
    body2: `${typography.body2()} ${scaleClass}`,
    caption: `${typography.caption()} ${scaleClass}`,
    overline: `${typography.overline()} ${scaleClass}`,
  };
}