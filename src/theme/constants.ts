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
    size: 36, 
    weight: fontFamilies.semibold 
  },
  H2: { 
    size: 32, 
    weight: fontFamilies.semibold 
  },
  H3: { 
    size: 24, 
    weight: fontFamilies.semibold 
  },

  // Body Text
  body_large: { 
    size: 20, 
    weight: fontFamilies.medium 
  },
  body_regular: { 
    size: 18, 
    weight: fontFamilies.regular 
  },
  
  // UI Elements
  buttonText: { 
    size: 16, 
    weight: fontFamilies.medium 
  },
};


// --- COLOR CONSTANTS (Based on the Semantic Guide and Color System Chart) ---
export const colors = {
  // Brand / Core Colors (Primary is NORA Red, Secondary is Pink/Light)
  primary: '#DD2D4A',            // Primary color (Mid-range red - used for action/logo)
  primary_dark: '#B2243B',       // Primary Dark (Shadows, strong contrast)
  primary_light: '#F26A82',      // Primary Light
  primary_extra_light: '#F9C1CC', // Primary Extra Light (Faint pink accent)
  
  secondary: '#FFC3D9',          // Secondary Color (Mid-range Pink)
  secondary_dark: '#E8AABB',     // Secondary Dark
  secondary_light: '#FFE0EB',     // Secondary Light
  secondary_extra_light: '#FFF3F7', // Secondary Extra Light (Very faint pink for mesh/subtle backgrounds)

  // Neutral / Backgrounds
  background_main: '#FAFAFA',    // Background Main (Off-White)
  background_soft: '#FDEEF3',    // Background Soft (For cards/surfaces, subtle off-white)
  background_subtle: '#F0F0F0',  // Background Subtle (Sections, dividers)
  background_muted: '#F7DCE4',   // Background Muted (Light pink / Muted pink background)
  background_strong: '#F4B9C7',  // Background Strong (Light pink background, for strong emphasis)

  // Text Colors
  text_primary: '#1A1A1A',       // Primary Text (Black, very readable)
  text_secondary: '#2E2E2E',     // Secondary Text / Soft Black
  text_grey_1: '#3A3A3A',        // Grey Text 1 (Labels, placeholders)
  text_grey_2: '#C4C4C4',        // Grey Text 2 (Lightest labels)
  text_white: '#FFFFFF',         // White Text
  
  // Status & Borders
  error: '#D72638',              // Error (Pure Red)
  error_dark: '#A91D2D',         // Error Dark
  error_light: '#F7CCD1',        // Error Light
  success: '#2ECC71',            // Success (Green)
  success_dark: '#239A52',       // Success Dark
  success_light: '#D3F5E3',      // Success Light
  outline: '#D5D5D5',            // Outline (Default border)
  outline_variant: '#E5E5E5',    // Outline Variant
  disabled_border: '#F0F0F0',    // Disabled Border
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