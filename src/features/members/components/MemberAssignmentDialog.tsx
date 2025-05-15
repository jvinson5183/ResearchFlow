import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Label,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Member } from '../types';
import { Station } from '../../stations/types';

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
  memberInfo: {
    marginBottom: spacing.s,
    padding: spacing.s,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  actions: {
    paddingTop: spacing.s,
  },
  infoRow: {
    display: 'flex',
    gap: spacing.s,
    alignItems: 'baseline',
  },
  infoLabel: {
    fontWeight: tokens.fontWeightSemibold,
    minWidth: '60px',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    marginBottom: spacing.s,
  },
  debug: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: spacing.xs,
    marginBottom: spacing.s,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
    border: `1px solid ${tokens.colorBrandForeground1}`,
  },
});

interface MemberAssignmentDialogProps {
  open: boolean;
  member: Member;
  stations: Station[];
  onOpenChange: (open: boolean) => void;
  onAssignMember: (stationId: string | null) => void;
}

export const MemberAssignmentDialog: React.FC<MemberAssignmentDialogProps> = ({
  open,
  member,
  stations,
  onOpenChange,
  onAssignMember,
}) => {
  const styles = useStyles();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(member.assignedStationId || null);

  // Reset selection when member changes or dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStationId(member.assignedStationId || null);
    }
  }, [open, member]);

  const handleSubmit = () => {
    onAssignMember(selectedStationId);
    onOpenChange(false);
  };

  const handleDialogChange = (event: React.SyntheticEvent | KeyboardEvent, data: { open: boolean }) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Assign Member to Station</DialogTitle>
          <DialogContent className={styles.dialogBody}>
            <div className={styles.memberInfo}>
              <div className={styles.infoRow}>
                <Text className={styles.infoLabel}>Name:</Text>
                <Text>{member.name}</Text>
              </div>
              <div className={styles.infoRow}>
                <Text className={styles.infoLabel}>Role:</Text>
                <Text>{member.role}</Text>
              </div>
              <div className={styles.infoRow}>
                <Text className={styles.infoLabel}>Email:</Text>
                <Text>{member.email}</Text>
              </div>
            </div>

            <Text className={styles.description}>
              Assign this member to a station or select "Unassigned" to remove from any station.
            </Text>

            <div className={styles.field}>
              <Label htmlFor="stationSelect" required>Station</Label>
              <select
                id="stationSelect"
                value={selectedStationId || ""}
                onChange={(e) => {
                  setSelectedStationId(e.target.value || null);
                }}
                style={{
                  width: '100%',
                  padding: `${spacing.xs} ${spacing.s}`,
                  borderRadius: tokens.borderRadiusMedium,
                  border: `1px solid ${tokens.colorNeutralStroke1}`,
                  backgroundColor: tokens.colorNeutralBackground1,
                  color: tokens.colorNeutralForeground1,
                  height: '38px',
                  fontFamily: 'inherit',
                  fontSize: tokens.fontSizeBase300,
                  appearance: 'auto',
                  textOverflow: 'ellipsis',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Unassigned</option>
                {stations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
          </DialogContent>
          <DialogActions className={styles.actions}>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit}>
              Assign
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}; 