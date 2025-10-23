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
    secondary: 0xfff59e0b,
    error: 0xffef4444,
    bg: 0xfff9fafb,
    surface: 0xffffffff,
    surfaceAlt: 0xfff3f4f6,
    text: 0xff111827,
    textMuted: 0xff4b5563,
    border: 0xffe5e7eb,
    shadow: 0x33000000
  },
  radii: { sm: 8, md: 16, lg: 24 },
  spacing: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 },
  typography: {
    title: { size: 48, lineHeight: 56 },
    h2: { size: 32, lineHeight: 40 },
    body: { size: 24, lineHeight: 32 },
    small: { size: 20, lineHeight: 26 }
  },
  elevation(alpha = 0x33) { return (alpha << 24) | 0x000000 }
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
    console.warn(`[Theme] ${name} attempted theme ${context} before registration.`)
    // Also output a trace to capture call stack and file origins.
    console.trace('[Theme Trace] Theme missing at:', name)
  } catch {
    // noop
  }
}

/**
 * PUBLIC_INTERFACE
 * Canonical accessor that ALWAYS returns a fully-populated theme object.
 * Adds a trace when theme is missing and marks app to optionally show a banner.
 * @param {any} ctx - component instance (this) or app
 * @returns {object} OceanTheme or fully-populated FallbackTheme
 */
function getTheme(ctx) {
  const t = ctx?.app?.$theme || ctx?.$theme
  if (t && t.colors) return t
  // Mark app for optional banner and trace for debugging
  try {
    const app = ctx?.app || ctx
    if (app) app.__theme_missing_once = true
  } catch { /* noop */ }
  logThemeMissing(ctx, 'getTheme')
  return FallbackTheme
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
 * Deprecated alias maintained for backward compatibility.
 * Safely get theme from a component/app with a fallback and optional logging.
 * Prefer using getTheme(ctx).
 * @param {any} comp - Component instance (this) or app
 * @param {boolean} logWhenMissing - Whether to log if theme is missing
 * @returns {object} theme-like object with colors
 */
function getSafeTheme(comp, logWhenMissing = false) {
  const t = comp?.app?.$theme || comp?.$theme
  if (t && t.colors) return t
  if (logWhenMissing) logThemeMissing(comp)
  // Mark app to show banner if needed
  try {
    const app = comp?.app || comp
    if (app) app.__theme_missing_once = true
  } catch { /* noop */ }
  return FallbackTheme
}

export default OceanTheme
const DEFAULT_THEME = OceanTheme
export { registerTheme, getTheme, getSafeTheme, logThemeMissing, FallbackTheme, DEFAULT_THEME }
