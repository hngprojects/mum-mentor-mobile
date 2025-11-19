/**
 * Extended Responsive Scaling Utility for React Native
 *
 * Provides functions to scale dimensions, font sizes, padding, margins,
 * as well as responsive width and height based on a percentage of the screen's
 * dimensions. This helps build UIs that adapt to various device sizes.
 */

import {Dimensions, PixelRatio} from 'react-native';

// Get the device screen dimensions
export const {width: screenWidth, height: screenHeight} =
  Dimensions.get('window');

// Determine the short and long dimensions regardless of orientation
const [shortDimension, longDimension] =
  screenWidth < screenHeight
    ? [screenWidth, screenHeight]
    : [screenHeight, screenWidth];

/**
 * Base design dimensions (e.g., from your Figma design)
 */
export const guidelineBaseWidth = 430;
export const guidelineBaseHeight = 944;

/**
 * Scales a size horizontally based on the device's width.
 * Use this when you want the element's width (or horizontal padding/margin)
 * to scale proportionally with the device width.
 */
export function scale(size: number): number {
  return (shortDimension / guidelineBaseWidth) * size;
}

/**
 * Scales a size vertically based on the device's height.
 * Use this for vertical properties like height, top/bottom margins or padding.
 */
export function verticalScale(size: number): number {
  return (longDimension / guidelineBaseHeight) * size;
}

/**
 * Moderately scales a size horizontally with a factor to control the scaling effect.
 * It reduces the impact of extreme differences across devices.
 * Ideal for text sizes, horizontal paddings, or margins where full scaling might be too aggressive.
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return size + (scale(size) - size) * factor;
}

/**
 * Moderately scales a size vertically with a factor to control the scaling effect.
 * Use it for vertical properties that need a moderated response.
 */
export function moderateVerticalScale(
  size: number,
  factor: number = 0.5,
): number {
  return size + (verticalScale(size) - size) * factor;
}

/**
 * Responsive font size using moderate scale and rounding based on PixelRatio.
 * Use this function for text elements to ensure they remain legible across devices.
 */
export function responsiveFontSize(fontSize: number): number {
  const newSize = moderateScale(fontSize);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/**
 * Responsive width based on a percentage value of the screen width.
 * Use this when you need a component to take up a specific percentage of the device's width.
 * Example: responsiveWidth(80) will return 80% of the current screen width.
 */
export function responsiveWidth(percentage: number): number {
  return (screenWidth * percentage) / 100;
}

/**
 * Responsive height based on a percentage value of the screen height.
 * Use this for components whose height should be a percentage of the screen height.
 */
export function responsiveHeight(percentage: number): number {
  return (screenHeight * percentage) / 100;
}

/**
 * General responsive scaling that factors both horizontal and vertical scales.
 * Useful for properties like padding, margin, or any other dimension that
 * does not distinctly follow a horizontal or vertical orientation.
 */
export function generalScale(size: number): number {
  return (scale(size) + verticalScale(size)) / 2;
}

/**
 * Example: Responsive border radius using the general scale.
 * Border radius benefits from uniform scaling.
 */
export function responsiveBorderRadius(radius: number): number {
  return generalScale(radius);
}

// Shorthand aliases for convenience
export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
export const rfs = responsiveFontSize;
export const rw = responsiveWidth;
export const rh = responsiveHeight;
export const gs = generalScale;
export const rbr = responsiveBorderRadius;