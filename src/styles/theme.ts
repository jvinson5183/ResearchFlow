import { webDarkTheme, Theme } from '@fluentui/react-components';
import {
  sandDark,
  sandDarkA,
  orangeDark,
  orangeDarkA,
} from '@radix-ui/colors';

// Convert Radix colors to a format compatible with Fluent UI theme
// This is a simplified example. You might need a more comprehensive mapping.
const createRadixTheme = (): Theme => {
  // Start with Fluent UI's webDarkTheme as a base
  const baseTheme = webDarkTheme;

  return {
    ...baseTheme,
    // Override specific color tokens with Radix colors
    // See https://fluentui.microsoft.com/components/theme/theme-designer for available tokens

    // Backgrounds
    colorNeutralBackground1: sandDark.sand1, // App background
    colorNeutralBackground2: sandDark.sand2, // Cards, larger surfaces
    colorNeutralBackground3: sandDark.sand3, // Hovered surfaces
    colorNeutralBackground4: sandDark.sand4, // Pressed surfaces
    colorNeutralBackground5: sandDark.sand5,
    colorNeutralBackground6: sandDark.sand6, // Subtle borders, dividers

    colorSubtleBackground: sandDark.sand1,
    colorTransparentBackground: 'transparent',

    // Text / Foreground
    colorNeutralForeground1: sandDark.sand12, // Primary text
    colorNeutralForeground2: sandDark.sand11, // Secondary text
    colorNeutralForeground3: sandDark.sand10, // Tertiary / placeholder text
    colorNeutralForegroundDisabled: sandDark.sand8,

    // Brand colors (using Orange Dark as primary)
    colorBrandBackground: orangeDark.orange9,
    colorBrandBackgroundHover: orangeDark.orange10,
    colorBrandBackgroundPressed: orangeDark.orange8,
    colorBrandBackgroundSelected: orangeDark.orange9,
    colorBrandForeground1: orangeDark.orange11,
    colorBrandForeground2: orangeDark.orange12, // on brand background

    // Stroke colors
    colorNeutralStroke1: sandDark.sand6, // Dividers, borders
    colorNeutralStroke2: sandDark.sand7,
    colorNeutralStroke3: sandDark.sand8,
    colorNeutralStrokeAccessible: sandDark.sand9, // Focus borders

    // Alpha colors for translucent effects if needed
    // colorNeutralBackground1Alpha: sandDarkA.sandA1, // Example
    // colorBrandBackgroundAlpha: orangeDarkA.orangeA5, // Example

    // You can continue mapping other tokens as needed
    // e.g., scrollbar colors, shadow colors etc.
    // colorScrollbarBackground: sandDark.sand3,
    // colorScrollbarThumbBackground: sandDark.sand7,
    // colorScrollbarThumbBackgroundHover: sandDark.sand8,
    // colorScrollbarThumbBackgroundPressed: sandDark.sand9,

    // Shadows (example, you may need to define these properly)
    // shadow2: `0 0 2px ${sandDarkA.sandA3}, 0 4px 8px ${sandDarkA.sandA4}`,
    // shadow4: `0 0 2px ${sandDarkA.sandA3}, 0 8px 16px ${sandDarkA.sandA5}`,
    // ... and so on for shadow8, shadow16, shadow28, shadow64
  };
};

export const researchFlowTheme: Theme = createRadixTheme();

// Example of how you might want to export individual color palettes if needed elsewhere
export const brandColors = {
  ...orangeDark,
  ...orangeDarkA,
};

export const neutralColors = {
  ...sandDark,
  ...sandDarkA,
}; 