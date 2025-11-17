// src/theme/constants.ts

// --- TYPOGRAPHY CONSTANTS ---

// Font Family: HankenGrotesk (We use the full,
// exact name derived from the TTF file) to avoid issues.
export const fontFamilies = {
  // CORRECTED: Use the exact font file name stem (HankenGrotesk-Weight)
  regular: 'HankenGrotesk-Regular', 
  medium: 'HankenGrotesk-Medium',
  semibold: 'HankenGrotesk-SemiBold',
  bold: 'HankenGrotesk-Bold', 
  extrabold: 'HankenGrotesk-ExtraBold',
};
//------TYPOGRAPHY CONSTANTS ------//
export const typography = {
  // Headings (Size / Weight)
  H1: { 
    fontSize: 36, 
    fontFamily: fontFamilies.semibold 
  },
  H2: { 
    fontSize: 32, 
    fontFamily: fontFamilies.semibold 
  },
  H3: { 
    fontSize: 24, 
    fontFamily: fontFamilies.semibold 
  },

  // Body Text
  bodyLarge: { 
    fontSize: 20, 
    fontFamily: fontFamilies.medium 
  },
  bodyRegular: { 
    fontSize: 18, 
    fontFamily: fontFamilies.regular 
  },
  
  // UI Elements
  buttonText: { 
    fontSize: 16, 
    fontFamily: fontFamilies.medium 
  },
};


// --- COLOR CONSTANTS (Based on the Semantic Guide and Color System Chart) ---
export const colors = {
  // Brand / Core Colors (Primary is NORA Red, Secondary is Pink/Light)
  primary: '#DD2D4A',            // Primary color (Mid-range red - used for action/logo)
  primaryDark: '#B2243B',       // Primary Dark (Shadows, strong contrast)
  primaryLight: '#F26A82',      // Primary Light
  primaryExtraLight: '#F9C1CC', // Primary Extra Light (Faint pink accent)
  
  secondary: '#FFC3D9',          // Secondary Color (Mid-range Pink)
  secondaryDark: '#E8AABB',     // Secondary Dark
  secondaryLight: '#FFE0EB',     // Secondary Light
  secondaryExtraLight: '#FFF3F7', // Secondary Extra Light (Very faint pink for mesh/subtle backgrounds)

  // Neutral / Backgrounds
  backgroundMain: '#FAFAFA',    // Background Main (Off-White)
  backgroundSoft: '#FDEEF3',    // Background Soft (For cards/surfaces, subtle off-white)
  backgroundSubtle: '#F0F0F0',  // Background Subtle (Sections, dividers)
  backgroundMuted: '#F7DCE4',   // Background Muted (Light pink / Muted pink background)
  backgroundStrong: '#F4B9C7',  // Background Strong (Light pink background, for strong emphasis)

  // Text Colors
  textPrimary: '#1A1A1A',       // Primary Text (Black, very readable)
  typographyextSecondary: '#2E2E2E',     // Secondary Text / Soft Black
  textGrey1: '#3A3A3A',        // Grey Text 1 (Labels, placeholders)
  textGrey2: '#C4C4C4',        // Grey Text 2 (Lightest labels)
  textWhite: '#FFFFFF',         // White Text
  
  // Status & Borders
  error: '#D72638',              // Error (Pure Red)
  errorDark: '#A91D2D',         // Error Dark
  errorLight: '#F7CCD1',        // Error Light
  success: '#2ECC71',            // Success (Green)
  successDark: '#239A52',       // Success Dark
  successLight: '#D3F5E3',      // Success Light
  outline: '#D5D5D5',            // Outline (Default border)
  outlineVariant: '#E5E5E5',    // Outline Variant
  disabledBorder: '#F0F0F0',    // Disabled Border
};

// --- SPACING CONSTANTS (A common 8-point scale) ---
export const spacing = {
  none: 0,
  xs: 4,  
  sm: 8,  
  md: 16, // Default padding/margin
  lg: 24, 
  xl: 32, 
  xxl: 48,
};

// --- Define the single, comprehensive Theme Object Type ---
export interface AppTheme {
  colors: typeof colors;
  typography: typeof typography; 
  spacing: typeof spacing;
}
// Export the combined default theme object
export const defaultTheme: AppTheme = {
  colors,
  typography,
  spacing,
};