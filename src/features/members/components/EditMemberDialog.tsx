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
} from '@fluentui/react-components';
import { Member } from '../types';

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
    gap: spacing.s,
    paddingBottom: spacing.s,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  actions: {
    paddingTop: spacing.s,
  },
});

interface EditMemberDialogProps {
  open: boolean;
  member: Member;
  onOpenChange: (open: boolean) => void;
  onUpdateMember: (updates: Partial<Omit<Member, 'id'>>) => void;
}

export const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  member,
  onOpenChange,
  onUpdateMember,
}) => {
  const styles = useStyles();
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [email, setEmail] = useState(member.email);

  // Reset form when member changes
  useEffect(() => {
    if (open) {
      setName(member.name);
      setRole(member.role);
      setEmail(member.email);
    }
  }, [open, member]);

  const handleSubmit = () => {
    onUpdateMember({
      name,
      role,
      email,
    });
    onOpenChange(false);
  };

  const handleDialogChange = (event: React.SyntheticEvent | KeyboardEvent, data: { open: boolean }) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogContent className={styles.dialogBody}>
            <div className={styles.field}>
              <Label htmlFor="nameInput" required>Name</Label>
              <Input
                id="nameInput"
                value={name}
                onChange={(e, data) => setName(data.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="roleInput" required>Role</Label>
              <Input
                id="roleInput"
                value={role}
                onChange={(e, data) => setRole(data.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="emailInput" required>Email</Label>
              <Input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e, data) => setEmail(data.value)}
                required
              />
            </div>
          </DialogContent>
          <DialogActions className={styles.actions}>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}; 