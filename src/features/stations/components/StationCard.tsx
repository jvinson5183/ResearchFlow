import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  CardHeader,
  Button,
  Text,
  CardPreview,
  Badge,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';
import {
  EditRegular,
  DeleteRegular,
  PersonRegular,
  BeakerRegular,
  LockClosedRegular,
  LockOpenRegular,
  LinkRegular,
  ChevronDownRegular,
  ChevronRightRegular,
  ChatRegular,
} from '@fluentui/react-icons';
import { Station } from '../types';
import { Test } from '../../tests/types';
import { ExtendedStation } from '../../../contexts/AppDataContext';
import { useNavigate } from 'react-router-dom';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  card: {
    width: '100%',
    maxWidth: '400px',
    ...shorthands.margin('auto'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(spacing.xs),
  },
  actions: {
    display: 'flex',
    gap: spacing.xs,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...shorthands.padding(spacing.m, spacing.s),
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground2,
  },
  lockIcon: {
    fontSize: tokens.fontSizeBase500,
  },
  lockedIcon: {
    color: tokens.colorPaletteRedForeground2,
  },
  unlockedIcon: {
    color: tokens.colorPaletteGreenForeground2,
  },
  terminalId: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.padding(spacing.xs, spacing.s),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
  testItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(spacing.xs, 0),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    '&:last-child': {
      ...shorthands.borderBottom('none'),
    },
  },
  testName: {
    fontSize: tokens.fontSizeBase200,
  },
  testDuration: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  noTests: {
    ...shorthands.padding(spacing.xs),
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    textAlign: 'center',
  },
  accordionRow: {
    marginTop: spacing.xs,
  },
});

interface StationCardProps {
  station: ExtendedStation;
  onEdit: (station: ExtendedStation) => void;
  onDelete: (station: ExtendedStation) => void;
  onAssignTests: (station: ExtendedStation) => void;
  tests?: Test[]; // All tests for lookup
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  onEdit,
  onDelete,
  onAssignTests,
  tests = [], // Default to empty array
}) => {
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Get assigned tests by looking up their IDs
  const assignedTests = station.tests && tests.length > 0 
    ? station.tests
        .map(testId => tests.find(test => test.id === testId))
        .filter(test => test !== undefined) as Test[]
    : [];

  // Handle click on message indicator to navigate to chat page
  const handleMessageClick = () => {
    navigate('/chat');
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <Text weight="semibold" size={500}>
            {station.name}
          </Text>
        }
        action={
          <div className={styles.actions}>
            <Button
              appearance="subtle"
              icon={<EditRegular />}
              aria-label="Edit station"
              onClick={() => onEdit(station)}
              data-testid="edit-button"
            />
            <Button
              appearance="subtle"
              icon={<DeleteRegular />}
              aria-label="Delete station"
              onClick={() => onDelete(station)}
              data-testid="delete-button"
            />
          </div>
        }
      />
      <div className={styles.content}>
        {station.terminal_id && (
          <Text className={styles.terminalId} size={200}>
            Terminal ID: {station.terminal_id}
          </Text>
        )}
        <div className={styles.statsRow}>
          <PersonRegular className={styles.icon} />
          <Text>
            {station.member_count} member{station.member_count !== 1 ? 's' : ''}
          </Text>
        </div>
        <div className={styles.statsRow}>
          <BeakerRegular className={styles.icon} />
          <Text>
            {station.test_count} test{station.test_count !== 1 ? 's' : ''}
          </Text>
        </div>
        <div className={styles.statsRow}>
          {station.pin ? (
            <>
              <LockClosedRegular className={`${styles.lockIcon} ${styles.lockedIcon}`} />
              <Text>Locked</Text>
            </>
          ) : (
            <>
              <LockOpenRegular className={`${styles.lockIcon} ${styles.unlockedIcon}`} />
              <Text>Unlocked</Text>
            </>
          )}
        </div>
        
        {/* Unread messages indicator */}
        {station.unread_messages && station.unread_messages > 0 && (
          <div className={styles.statsRow}>
            <Button
              appearance="subtle"
              icon={<ChatRegular className={styles.icon} />}
              onClick={handleMessageClick}
              size="small"
              aria-label="View unread messages"
            >
              <Text>Messages</Text>
              <Badge appearance="filled" color="danger" shape="rounded" size="small">
                {station.unread_messages}
              </Badge>
            </Button>
          </div>
        )}

        {/* Accordion to display assigned tests */}
        {station.test_count > 0 && (
          <div className={styles.accordionRow}>
            <Accordion collapsible>
              <AccordionItem value="tests">
                <AccordionHeader>Assigned Tests</AccordionHeader>
                <AccordionPanel>
                  {assignedTests.length > 0 ? (
                    assignedTests.map(test => (
                      <div key={test.id} className={styles.testItem}>
                        <Text className={styles.testName}>{test.name}</Text>
                        <Text className={styles.testDuration}>{test.estimatedDuration} min</Text>
                      </div>
                    ))
                  ) : (
                    <Text className={styles.noTests}>No tests assigned yet</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <Button 
          icon={<LinkRegular />}
          appearance="subtle" 
          onClick={() => onAssignTests(station)}
          aria-label="Assign tests"
        >
          Assign Tests
        </Button>
      </div>
    </Card>
  );
}; 