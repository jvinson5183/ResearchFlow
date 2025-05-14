import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  makeStyles,
  tokens,
  Text,
  DialogOpenChangeEvent,
  DialogOpenChangeData,
} from '@fluentui/react-components';
import { Station } from '../types';
import { Test } from '../../tests/types';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
  },
  testItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.s,
    padding: spacing.xs,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  testInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  testHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  testName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  testDuration: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  testDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  noTests: {
    textAlign: 'center',
    padding: spacing.l,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    paddingTop: spacing.s,
  },
});

interface TestAssignmentDialogProps {
  open: boolean;
  station: Station;
  allTests: Test[];
  onOpenChange: (event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void;
  onAssignTests: (stationId: string, testIds: string[]) => void;
}

export const TestAssignmentDialog: React.FC<TestAssignmentDialogProps> = ({
  open,
  station,
  allTests,
  onOpenChange,
  onAssignTests,
}) => {
  const styles = useStyles();
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);

  // Initialize selected tests based on station's assigned tests
  useEffect(() => {
    if (open && station) {
      // Get test IDs from the station's tests array
      const stationTestIds = (station.tests || []).map(test => 
        typeof test === 'string' ? test : test.id
      );
      setSelectedTestIds(stationTestIds);
    }
  }, [open, station]);

  const handleTestToggle = (testId: string) => {
    setSelectedTestIds(prev => {
      if (prev.includes(testId)) {
        return prev.filter(id => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  const handleSave = () => {
    onAssignTests(station.id, selectedTestIds);
    onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
  };

  const handleCancel = () => {
    onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogTitle>Assign Tests to {station.name}</DialogTitle>
        <DialogContent>
          <div className={styles.content}>
            {allTests.length > 0 ? (
              allTests.map(test => (
                <div key={test.id} className={styles.testItem}>
                  <Checkbox 
                    checked={selectedTestIds.includes(test.id)}
                    onChange={() => handleTestToggle(test.id)}
                  />
                  <div className={styles.testInfo}>
                    <div className={styles.testHeader}>
                      <Text className={styles.testName}>{test.name}</Text>
                      <Text className={styles.testDuration}>{test.estimatedDuration} min</Text>
                    </div>
                    {test.description && (
                      <Text className={styles.testDescription}>{test.description}</Text>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Text className={styles.noTests}>No tests available. Please create tests first.</Text>
            )}
          </div>
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}; 