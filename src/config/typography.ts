/**
 * ✅ TYPOGRAPHY CONFIGURATION
 *
 * Consistent font styles used throughout the app
 * Defines font sizes, weights, and line heights
 *
 * Usage:
 * import { typography } from '@/config/typography';
 * fontSize: typography.sizes.h1
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Uses system default
    medium: 'System',
    bold: 'System',
    // If using custom fonts, add them here:
    // regular: 'Roboto-Regular',
    // medium: 'Roboto-Medium',
    // bold: 'Roboto-Bold',
  },

  // Font sizes
  sizes: {
    // Headings
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,

    // Body text
    body: 16,
    bodySmall: 14,
    bodyLarge: 18,

    // UI elements
    button: 16,
    buttonSmall: 14,
    buttonLarge: 18,
    input: 16,
    label: 14,
    caption: 12,
    overline: 10,
  },

  // Font weights
  weights: {
    thin: '100',
    extraLight: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },

  // Line heights (relative to font size)
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // Pre-defined text styles
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    overline: {
      fontSize: 10,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },
};

export default typography;
