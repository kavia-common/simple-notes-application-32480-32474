

/**
 * Ocean Professional theme tokens for Lightning/Blits.
 * Centralized colors, radii, shadows, and spacing to keep UI consistent.
 */
const OceanTheme = {
  name: 'Ocean Professional',
  colors: {
    primary: 0xff2563eb,   // Blue-600
    primaryLight: 0x1a93c5ff, // helper ARGB not used directly; Blits uses ARGB hex
    secondary: 0xfff59e0b, // Amber-500
    error: 0xffef4444,     // Red-500
    bg: 0xfff9fafb,        // Gray-50
    surface: 0xffffffff,   // White
    text: 0xff111827,      // Gray-900
    textMuted: 0xff4b5563, // Gray-600
    border: 0xffe5e7eb,    // Gray-200
    shadow: 0x33000000,    // 20% black for drop shadow
    surfaceAlt: 0xfff3f4f6 // Gray-100
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    title: { size: 48, lineHeight: 56 },
    h2: { size: 32, lineHeight: 40 },
    body: { size: 24, lineHeight: 32 },
    small: { size: 20, lineHeight: 26 }
  },
  // Simple elevation simulation using translucent layers
  elevation(alpha = 0x33) {
    return (alpha << 24) | 0x000000
  }
}

// PUBLIC_INTERFACE
function registerTheme(app) {
  /** Register theme on the Blits app instance for global access. */
  app.$theme = OceanTheme
  return OceanTheme
}

export default OceanTheme
export { registerTheme }
