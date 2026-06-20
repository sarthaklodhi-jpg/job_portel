/**
 * Modern SaaS Design System
 * Used consistently across all components
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main brand
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c3d66",
  },

  // Neutral/Gray palette for text and backgrounds
  neutral: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    500: "#10b981",
    600: "#059669",
  },
  error: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
  },
  info: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
  },
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
};

export const borderRadius = {
  none: "0",
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  full: "9999px",
};

export const shadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

export const typography = {
  // Headings
  h1: "text-4xl md:text-5xl font-bold tracking-tight leading-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight leading-snug",
  h3: "text-2xl md:text-3xl font-bold tracking-tight leading-snug",
  h4: "text-xl md:text-2xl font-semibold tracking-tight leading-snug",
  h5: "text-lg md:text-xl font-semibold tracking-tight",
  h6: "text-base md:text-lg font-semibold tracking-tight",

  // Body text
  body: "text-base font-normal leading-relaxed",
  bodyLarge: "text-lg font-normal leading-relaxed",
  bodySmall: "text-sm font-normal leading-relaxed",

  // Labels and captions
  label: "text-sm font-medium leading-none",
  caption: "text-xs font-medium leading-none uppercase tracking-wider",
};

export const gradients = {
  // Linear gradients
  brandGradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  successGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  errorGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  warningGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",

  // Glassmorphic backgrounds
  glassLight: "bg-white/80 backdrop-blur-md border border-white/20",
  glassDark: "bg-slate-900/80 backdrop-blur-md border border-slate-700/20",
};

export const transitions = {
  fast: "transition-all duration-150 ease-in-out",
  base: "transition-all duration-200 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
};

export const layers = {
  // Z-index scale
  hide: -1,
  auto: 0,
  base: 1,
  dropdown: 100,
  sticky: 500,
  fixed: 750,
  modalBackdrop: 1000,
  modal: 1001,
  tooltip: 1100,
};

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * CSS Utility Classes
 */
export const utilities = {
  // Cards
  card: "bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow",
  cardHover:
    "bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md cursor-pointer transition-all hover:border-primary-200",
  cardGlass: "bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6",

  // Buttons
  buttonBase:
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  buttonPrimary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md",
  buttonSecondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200",
  buttonGhost: "text-neutral-700 hover:bg-neutral-100",
  buttonOutline: "border border-primary-300 text-primary-600 hover:bg-primary-50",

  // Forms
  input:
    "w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all",
  label: "text-sm font-medium text-neutral-700 mb-2 block",

  // Badges
  badge:
    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
  badgePrimary: "bg-primary-100 text-primary-700",
  badgeSuccess: "bg-success-50 text-success-600",
  badgeError: "bg-error-50 text-error-600",
  badgeWarning: "bg-warning-50 text-warning-600",

  // Section containers
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 sm:py-16 lg:py-20",

  // Grids
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",

  // Flexbox
  flex: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  flexCol: "flex flex-col",

  // Accessibility
  focusRing: "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  focusRingDark: "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-neutral-950",
};

/**
 * Animation Variants for Framer Motion
 */
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
};
