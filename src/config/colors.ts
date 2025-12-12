/**
 * ✅ E-GOV-GUARDS-PORTAL COLOR CONFIGURATION
 * Multi-Agency Patrol System Colors
 * Police | Fire | Ambulance | Immigration
 */

export const colors = {
  // Primary Brand Colors - E-GOV Guards Portal
  primary: '#1E40AF',       // E-GOV Patrol Blue (main)
  secondary: '#1E3A8A',     // Darker blue accent
  accent: '#60A5FA',        // Light blue for highlights

  // Agency-Specific Colors
  agency: {
    police: {
      primary: '#1A3C5A',   // Dark navy blue
      secondary: '#F97316', // Orange accent
      badge: '#111827',     // Dark badge background
    },
    fire: {
      primary: '#DC2626',   // Red
      secondary: '#991B1B', // Dark red
      badge: '#EF4444',     // Bright red badge
    },
    ambulance: {
      primary: '#1E40AF',   // Blue
      secondary: '#374151', // Dark gray
      badge: '#3B82F6',     // Bright blue badge
    },
    immigration: {
      primary: '#1E40AF',   // Blue
      secondary: '#DC2626', // Red accent
      badge: '#1E3A8A',     // Dark blue badge
    },
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',     // White
    secondary: '#F9FAFB',   // Light gray
    tertiary: '#F3F4F6',    // Gray
    dark: '#111827',        // Almost black
    overlay: 'rgba(17, 24, 39, 0.85)', // Dark overlay for login
  },

  // Text Colors
  text: {
    primary: '#111827',     // Almost black
    secondary: '#6B7280',   // Gray
    tertiary: '#9CA3AF',    // Light gray
    inverse: '#FFFFFF',     // White
    link: '#1E40AF',        // Blue link
  },

  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#4B5563',
  },

  // Status Colors
  status: {
    success: '#10B981',     // Green
    warning: '#F59E0B',     // Orange
    error: '#EF4444',       // Red
    info: '#1E40AF',        // Blue
    online: '#10B981',      // Green - officer online
    busy: '#F59E0B',        // Orange - officer busy
    offline: '#6B7280',     // Gray - officer offline
    emergency: '#DC2626',   // Red - emergency/SOS
  },

  // Tab Navigation Colors
  tab: {
    active: '#1E40AF',      // Patrol blue (active tab)
    inactive: '#6B7280',    // Gray (inactive tab)
    background: '#FFFFFF',  // White background
    border: '#E5E7EB',      // Light gray border
  },

  // Drawer Colors
  drawer: {
    background: '#FFFFFF',
    text: '#111827',
    activeBackground: '#EFF6FF',  // Light blue tint
    activeText: '#1E40AF',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    blue: 'rgba(30, 64, 175, 0.4)', // Blue shadow for buttons
  },
};

// Export individual color palettes for convenience
export const {
  primary,
  secondary,
  accent,
  background,
  text,
  border,
  status,
  tab,
  drawer,
  shadow,
} = colors;

export default colors;
