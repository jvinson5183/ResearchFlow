import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
  },
  warningText: {
    color: tokens.colorStatusDangerForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    paddingTop: spacing.s,
  },
});

interface DeleteConfirmationDialogProps {
  open: boolean;
  itemName: string;
  itemType: string;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  itemName,
  itemType,
  onOpenChange,
  onConfirmDelete,
}) => {
  const styles = useStyles();

  const handleDialogChange = (event: React.SyntheticEvent | KeyboardEvent, data: { open: boolean }) => {
    onOpenChange(data.open);
  };

  const handleConfirm = () => {
    onConfirmDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete {itemType}</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Text>
              Are you sure you want to delete the {itemType} "{itemName}"?
            </Text>
            <Text className={styles.warningText}>
              This action cannot be undone.
            </Text>
          </DialogContent>
          <DialogActions className={styles.actions}>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleConfirm}>
              Delete
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}; 