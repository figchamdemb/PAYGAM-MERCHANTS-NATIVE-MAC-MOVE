/**
 * ✅ SPACING CONFIGURATION
 *
 * Consistent spacing values used throughout the app
 * Based on 8pt grid system for better visual consistency
 *
 * Usage:
 * import { spacing } from '@/config/spacing';
 * paddingHorizontal: spacing.md
 */

export const spacing = {
  // Base spacing scale (8pt grid)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Specific use cases
  screenPadding: 16, // Default screen horizontal padding
  cardPadding: 16, // Default card padding
  sectionMargin: 24, // Margin between sections
  itemGap: 12, // Gap between list items
  iconMargin: 8, // Margin next to icons
  buttonPadding: {
    vertical: 12,
    horizontal: 24,
  },
  inputPadding: {
    vertical: 12,
    horizontal: 16,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999, // Fully rounded
  },

  // Component-specific spacing
  header: {
    height: 56,
    paddingHorizontal: 16,
  },
  tabBar: {
    height: 60,
    paddingVertical: 8,
  },
  drawer: {
    width: 280,
    itemPaddingVertical: 12,
    itemPaddingHorizontal: 20,
  },
  modal: {
    padding: 24,
    borderRadius: 16,
  },
};

export default spacing;
