import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  link: {
    textDecorationLine: 'none',
  }
});

const navItems = [
  { label: 'Dashboard', icon: <HomeRegular />, key: 'dashboard', path: '/dashboard' },
  { label: 'Members', icon: <PeopleRegular />, key: 'members', path: '/members' },
  { label: 'Tests', icon: <BeakerRegular />, key: 'tests', path: '/tests' },
  { label: 'Chat', icon: <ChatRegular />, key: 'chat', path: '/chat' },
  { label: 'Reports', icon: <DocumentRegular />, key: 'reports', path: '/reports' },
  { label: 'Settings', icon: <SettingsRegular />, key: 'settings', path: '/settings' },
];

export const Navigation: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <nav className={classes.root}>
      {navItems.map((item) => {
        const isSelected = location.pathname.startsWith(item.path);
        return (
          <Link to={item.path} key={item.key} className={classes.link}>
            <Tooltip content={item.label} relationship="label">
              <Button
                appearance={isSelected ? 'primary' : 'subtle'}
                icon={item.icon}
                className={classes.navButton}
              >
                {item.label}
              </Button>
            </Tooltip>
          </Link>
        );
      })}
    </nav>
  );
}; 