import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Label,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { Member } from '../types';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (newMember: Omit<Member, 'id'>) => void;
}

const useStyles = makeStyles({
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('15px'),
    paddingBottom: '15px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
  },
});

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, onOpenChange, onAddMember }) => {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setRole('');
      setEmail('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (name && role && email) {
      onAddMember({ name, role, email });
      setName('');
      setRole('');
      setEmail('');
      onOpenChange(false);
    }
  };

  const handleDialogSurfaceChange = (event: React.SyntheticEvent | KeyboardEvent, data: { open: boolean }) => {
    onOpenChange(data.open);
    if (!data.open) {
      setName('');
      setRole('');
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogSurfaceChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogContent className={styles.dialogBody}>
            <div className={styles.field}>
              <Label htmlFor="memberName" required>Name</Label>
              <Input
                id="memberName"
                value={name}
                onChange={(e, data) => setName(data.value)}
                placeholder="Enter member name"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="memberRole" required>Role</Label>
              <Input
                id="memberRole"
                value={role}
                onChange={(e, data) => setRole(data.value)}
                placeholder="Enter member role"
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="memberEmail" required>Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={email}
                onChange={(e, data) => setEmail(data.value)}
                placeholder="Enter member email"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={!name || !role || !email}>
              Add Member
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}; 