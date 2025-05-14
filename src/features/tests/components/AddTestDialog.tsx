import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Textarea, // For description
  Label,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Test, TestStatus } from '../types';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(spacing.m),
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(spacing.xs),
  },
  actions: {
    paddingTop: spacing.s,
  },
});

interface AddTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (testData: Omit<Test, 'id'>) => void; // Generic onSubmit
  initialData?: Test | null; // Optional prop for pre-filling form in edit mode
}

export const AddTestDialog: React.FC<AddTestDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setEstimatedDuration(initialData.estimatedDuration.toString());
    } else if (!open) {
      // Reset form when dialog is closed or if not in edit mode and opening
      setName('');
      setDescription('');
      setEstimatedDuration('');
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    const duration = parseInt(estimatedDuration, 10);
    if (name && !isNaN(duration) && duration > 0) {
      onSubmit({ 
        name, 
        description, 
        estimatedDuration: duration,
        // If in edit mode, retain original status unless explicitly changed by form (not implemented yet)
        // For add mode, default to Pending.
        status: initialData?.status || TestStatus.Pending 
      });
      onOpenChange(false); // Close dialog on successful submit
    }
    // TODO: Add validation feedback for the user if inputs are invalid
  };

  const handleDialogSurfaceChange = (
    event: React.SyntheticEvent | KeyboardEvent, 
    data: { open: boolean }
  ) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogSurfaceChange}>
      <DialogSurface aria-describedby="add-test-dialog-description">
        <DialogBody>
          <DialogTitle>{isEditMode ? 'Edit Test' : 'Add New Test'}</DialogTitle>
          <DialogContent id="add-test-dialog-description" className={classes.dialogBody}>
            Fill in the details for the test.
            
            <div className={classes.field}>
              <Label htmlFor="test-name" required>Test Name</Label>
              <Input 
                id="test-name" 
                value={name} 
                onChange={(e, data) => setName(data.value)} 
                placeholder="e.g., Reaction Time Test"
              />
            </div>

            <div className={classes.field}>
              <Label htmlFor="test-description">Description (Optional)</Label>
              <Textarea 
                id="test-description" 
                value={description} 
                onChange={(e, data) => setDescription(data.value)} 
                placeholder="Enter a brief description of the test. Supports Markdown."
                textarea={{ rows: 3 }}
              />
            </div>

            <div className={classes.field}>
              <Label htmlFor="test-duration" required>Estimated Duration (minutes)</Label>
              <Input 
                id="test-duration" 
                value={estimatedDuration} 
                onChange={(e, data) => setEstimatedDuration(data.value)} 
                type="number"
                placeholder="e.g., 30"
              />
            </div>
          </DialogContent>

          <DialogActions className={classes.actions}>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button appearance="primary" onClick={handleSubmit}>
              {isEditMode ? 'Save Changes' : 'Add Test'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}; 