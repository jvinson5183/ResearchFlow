import React from 'react';
import { makeStyles, shorthands } from '@griffel/react';
import { researchFlowTheme } from '../../styles/theme'; // Import our custom theme
import { Logo } from '../Logo/Logo';
import { Navigation } from '../Navigation/Navigation'; // Import the Navigation component
// import { Navigation } from '../Navigation/Navigation'; // Placeholder for Navigation component

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr', // Header, Main Content
    gridTemplateColumns: 'auto 1fr', // Nav, Content Area
    height: '100vh',
    width: '100vw',
    backgroundColor: researchFlowTheme.colorNeutralBackground1,
    color: researchFlowTheme.colorNeutralForeground1,
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr', // Stack nav and content on mobile
      gridTemplateRows: 'auto auto 1fr', // Header, Nav, Main Content
    },
  },
  header: {
    gridColumn: '1 / -1',
    gridRow: '1',
    display: 'flex',
    alignItems: 'center',
    height: '80px', // Increase height for larger logo
    ...shorthands.padding(spacing.s), // Consistent 16px padding on all sides
    backgroundColor: researchFlowTheme.colorNeutralBackground2,
    ...shorthands.borderBottom(researchFlowTheme.strokeWidthThin, 'solid', researchFlowTheme.colorNeutralStroke1),
    zIndex: '10',
    '@media (max-width: 768px)': {
      // Adjustments for mobile header if needed
    },
  },
  navigation: {
    gridColumn: '1',
    gridRow: '2',
    width: '200px', // Match the width in Navigation component
    backgroundColor: researchFlowTheme.colorNeutralBackground2,
    ...shorthands.padding(researchFlowTheme.spacingVerticalM, researchFlowTheme.spacingHorizontalM),
    ...shorthands.borderRight(researchFlowTheme.strokeWidthThin, 'solid', researchFlowTheme.colorNeutralStroke1),
    overflowY: 'auto',
    '@media (max-width: 768px)': {
      gridColumn: '1 / -1',
      gridRow: '2',
      width: '100%',
      ...shorthands.borderRight('0px'),
      ...shorthands.borderBottom(researchFlowTheme.strokeWidthThin, 'solid', researchFlowTheme.colorNeutralStroke1),
      overflowY: 'unset',
    },
  },
  mainContent: {
    gridColumn: '2',
    gridRow: '2',
    ...shorthands.padding(researchFlowTheme.spacingVerticalL, researchFlowTheme.spacingHorizontalL),
    overflowY: 'auto',
    backgroundColor: researchFlowTheme.colorNeutralBackground1,
    '@media (max-width: 768px)': {
      gridColumn: '1 / -1',
      gridRow: '3',
    },
  },
  logoContainer: {
    width: '200px', // Same width as sidebar
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '0', // Remove any additional left padding
  }
});

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.logoContainer}>
          <Logo />
        </div>
      </header>
      <nav className={classes.navigation}>
        <Navigation /> {/* Use the Navigation component */}
      </nav>
      <main className={classes.mainContent}>
        {children}
      </main>
    </div>
  );
}; 