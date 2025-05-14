import { webDarkTheme, type Theme } from '@fluentui/react-components';
import {
  sandDark,
  sandDarkA,
  orangeDark,
  orangeDarkA,
} from '@radix-ui/colors';

// PRD: Radix Colors (Sand Dark as primary, Orange Dark as secondary)
// Based on PRD Section 2.2.1 Design - Radix Colors Scale Usage

const researchFlowRadixTheme: Partial<Theme> = {
  // Backgrounds (PRD Steps 1-2: SandDark for general, OrangeDark for accents if any)
  colorNeutralBackground1: sandDark.sand1,      // Main app background, nav panes, cards
  colorNeutralBackground2: sandDark.sand2,      // Subtle backgrounds (e.g., striped tables, secondary panels)
  
  // Component Backgrounds (PRD Steps 3-5)
  colorNeutralBackground3: sandDark.sand3,      // Normal state for UI components (e.g., menu items, station cards)
  colorNeutralBackground4: sandDark.sand4,      // Hover state for UI components
  colorNeutralBackground5: sandDark.sand5,      // Pressed or selected state for UI components

  // Borders (PRD Steps 6-8)
  colorNeutralStroke1: sandDark.sand6,          // Subtle borders for non-interactive components (nav pane, cards, separators)
  colorNeutralStroke2: sandDark.sand7,          // Borders for interactive components (buttons, inputs)
  colorNeutralStrokeAccessible: sandDark.sand8, // Stronger borders and focus rings (maps to step 8)

  // Text (PRD Steps 11-12)
  colorNeutralForeground1: sandDark.sand12,       // High-contrast text (primary content, headings)
  colorNeutralForeground2: sandDark.sand11,       // Low-contrast text (secondary labels, timestamps)
  colorNeutralForeground3: sandDark.sand9,        // Placeholder text, icons (mapping to a step that has enough contrast on sand1/sand2)
  colorNeutralForegroundDisabled: sandDark.sand7, // Disabled text

  // Brand colors (OrangeDark as secondary/accent - PRD Steps 9-10 for solid backgrounds/accents)
  // These map to Fluent UI's "Brand" tokens
  colorBrandBackground: orangeDark.orange9,                 // High-chroma backgrounds (headers, overlays, accent borders, indicators)
  colorBrandBackgroundHover: orangeDark.orange10,           // Hover state for solid background components
  colorBrandBackgroundPressed: orangeDark.orange8,          // Pressed state for brand components
  colorBrandBackgroundSelected: orangeDark.orange10,        // Selected state for brand components
  
  colorCompoundBrandBackground: orangeDark.orange9,
  colorCompoundBrandBackgroundHover: orangeDark.orange10,
  colorCompoundBrandBackgroundPressed: orangeDark.orange8,

  colorBrandForeground1: sandDark.sand12,                   // High-contrast text on brand background (using SandDark12 for max contrast)
  colorBrandForeground2: orangeDark.orange4,                // Softer text/icon on brand background (e.g. for icons inside a brand button)
  
  colorBrandStroke1: orangeDark.orange7,
  colorBrandStroke2: orangeDark.orange8,

  // Focus outline - Use a distinct color, OrangeDark step 9 or 10 is good for accents.
  colorStrokeFocus2: orangeDark.orange10, // Outer focus stroke
  colorStrokeFocus1: sandDark.sand1,      // Inner focus stroke (for high contrast against orange10)
};

// Create the theme by merging our overrides with a base dark theme
export const researchFlowTheme: Theme = {
  ...webDarkTheme, // Using webDarkTheme as a more neutral base than teamsDarkTheme
  ...researchFlowRadixTheme,
};

// Export Radix palettes if needed directly elsewhere (as per previous structure)
export const brandColors = {
  ...orangeDark,
  ...orangeDarkA,
};

export const neutralColors = {
  ...sandDark,
  ...sandDarkA,
}; 