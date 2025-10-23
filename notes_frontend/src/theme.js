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

// Minimal safe fallback used when theme is not yet registered
const FallbackTheme = {
  colors: {
    primary: 0xff2563eb,
    error: 0xffef4444,
    bg: 0xfff9fafb,
    surface: 0xffffffff,
    surfaceAlt: 0xfff3f4f6,
    text: 0xff111827,
    textMuted: 0xff4b5563
  }
}

/**
 * Logs a warning when a component tries to access theme before it's available.
 * Includes the component name to aid debugging.
 * @param {any} comp - Component instance (this)
 * @param {string} context - Optional context message
 */
function logThemeMissing(comp, context = 'access') {
  try {
    const name = comp?.name || comp?.constructor?.name || 'UnknownComponent'
    // eslint-disable-next-line no-console
    console.warn(`[Theme] ${name} attempted theme ${context} before registration.`)
  } catch {
    // noop
  }
}

/**
 * PUBLIC_INTERFACE
 * Registers the Ocean theme on the provided Blits application instance.
 * Ensures the theme object is available as app.$theme for all components.
 * Uses idempotent registration to avoid duplicates.
 * @param {any} app - Blits application instance
 * @returns {object} The registered theme object
 */
function registerTheme(app) {
  if (!app) {
    // Defensive: do not throw hard to avoid breaking boot; log instead.
    // eslint-disable-next-line no-console
    console.warn('registerTheme called without app instance')
    return OceanTheme
  }
  if (app.$theme && app.$theme.colors) {
    return app.$theme
  }
  app.$theme = OceanTheme
  return OceanTheme
}

/**
 * PUBLIC_INTERFACE
 * Safely get theme from a component/app with a fallback and optional logging.
 * @param {any} comp - Component instance (this) or app
 * @param {boolean} logWhenMissing - Whether to log if theme is missing
 * @returns {object} theme-like object with colors
 */
function getSafeTheme(comp, logWhenMissing = false) {
  const t = comp?.app?.$theme || comp?.$theme
  if (t && t.colors) return t
  if (logWhenMissing) logThemeMissing(comp)
  return FallbackTheme
}

export default OceanTheme
export { registerTheme, getSafeTheme, logThemeMissing, FallbackTheme }
