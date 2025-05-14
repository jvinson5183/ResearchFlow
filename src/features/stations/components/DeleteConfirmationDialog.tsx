import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
  makeStyles,
  tokens,
  DialogOpenChangeEvent,
  DialogOpenChangeData,
} from '@fluentui/react-components';
import { Station } from '../types';

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
  warning: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    paddingTop: spacing.s,
  },
});

interface DeleteConfirmationDialogProps {
  open: boolean;
  station: Station;
  onOpenChange: (event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  station,
  onOpenChange,
  onConfirm,
}) => {
  const styles = useStyles();

  const handleCancel = () => {
    onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange({} as DialogOpenChangeEvent, { open: false } as DialogOpenChangeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <div className={styles.content}>
            <Text>
              Are you sure you want to delete the station "{station.name}"?
            </Text>
            <Text className={styles.warning} data-testid="delete-warning">
              This action cannot be undone.
            </Text>
            {(station.test_count > 0 || station.member_count > 0) && (
              <Text>
                This station has {station.test_count} test{station.test_count !== 1 ? 's' : ''} and{' '}
                {station.member_count} member{station.member_count !== 1 ? 's' : ''} associated with it.
              </Text>
            )}
          </div>
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={handleConfirm} data-testid="confirm-delete">
            Delete
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}; 