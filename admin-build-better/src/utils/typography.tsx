// utils/typography.ts
import { cva, type VariantProps } from 'class-variance-authority';

// Define size variants for better responsiveness
export const typographyVariants = {
  size: {
    xs: 'text-xs sm:text-sm', // Extra small
    sm: 'text-sm sm:text-base', // Small
    base: 'text-base sm:text-lg', // Base
    lg: 'text-lg sm:text-xl', // Large
    xl: 'text-xl sm:text-2xl', // Extra large
    '2xl': 'text-2xl sm:text-3xl', // 2XL
    '3xl': 'text-3xl sm:text-4xl', // 3XL
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  color: {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-gray-500',
    light: 'text-gray-300',
    dark: 'text-gray-900',
    white: 'text-white',
    black: 'text-black',
  },
  leading: {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  },
  tracking: {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
  },
  font: {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    poppins: 'font-poppins',
  },
  transform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normal: 'normal-case',
  }
};

// Create base typography component variants
export const text = cva('', {
  variants: typographyVariants,
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    leading: 'normal',
    font: 'poppins',
  },
});

// Typography presets
export const typography = {
  // Headers
  h1: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: '3xl',
      weight: 'bold',
      leading: 'tight',
      font: 'poppins',
    },
  }),
  
  h2: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: '2xl',
      weight: 'semibold',
      leading: 'tight',
      font: 'poppins',
    },
  }),
  
  h3: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'xl',
      weight: 'semibold',
      leading: 'tight',
      font: 'poppins',
    },
  }),

  // Content
  title: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'lg',
      weight: 'semibold',
      leading: 'normal',
      font: 'poppins',
    },
  }),
  
  subtitle: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'base',
      weight: 'medium',
      leading: 'normal',
      font: 'poppins',
    },
  }),
  
  body: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      leading: 'relaxed',
      font: 'poppins',
    },
  }),
  
  caption: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'xs',
      weight: 'medium',
      leading: 'normal',
      font: 'poppins',
    },
  }),
  
  overline: cva('', {
    variants: typographyVariants,
    defaultVariants: {
      size: 'xs',
      weight: 'medium',
      leading: 'normal',
      transform: 'uppercase',
      tracking: 'wider',
      font: 'poppins',
    },
  }),
};

// Types
export type TextProps = VariantProps<typeof text>;
export type TypographyVariants = keyof typeof typography;
export type TypographyProps = {
  [K in TypographyVariants]: VariantProps<typeof typography[K]>;
};