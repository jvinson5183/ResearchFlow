import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Tooltip
} from '@fluentui/react-components';
import {
  HomeRegular,
  PeopleRegular,
  BeakerRegular,
  ChatRegular,
  DocumentRegular, // For Reports
  SettingsRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    // Ensure it doesn't shrink if content is small
    minWidth: '200px', // Adjust as needed for icon + text or just icons
  },
  navButton: {
    width: '100%',
    justifyContent: 'flex-start', // Align icon and text to the start
  },
});

const navItems = [
  { label: 'Dashboard', icon: <HomeRegular />, key: 'dashboard' },
  { label: 'Members', icon: <PeopleRegular />, key: 'members' },
  { label: 'Tests', icon: <BeakerRegular />, key: 'tests' },
  { label: 'Chat', icon: <ChatRegular />, key: 'chat' },
  { label: 'Reports', icon: <DocumentRegular />, key: 'reports' },
  { label: 'Settings', icon: <SettingsRegular />, key: 'settings' },
];

export const Navigation: React.FC = () => {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('dashboard');

  // In a real app, this would likely trigger routing changes
  const onNavItemClick = (itemKey: string) => {
    setSelectedValue(itemKey);
    console.log(`Navigating to ${itemKey}`);
    // TODO: Implement actual navigation logic (e.g., react-router)
  };

  return (
    <nav className={classes.root}>
      {navItems.map((item) => (
        <Tooltip content={item.label} relationship="label" key={item.key}>
          <Button
            appearance={selectedValue === item.key ? 'primary' : 'subtle'}
            icon={item.icon}
            className={classes.navButton}
            onClick={() => onNavItemClick(item.key)}
          >
            {item.label} {/* Show label, PDR implies collapsible to icons only later */}
          </Button>
        </Tooltip>
      ))}
    </nav>
  );
}; 