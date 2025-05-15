import React from 'react';
import { TableCell, TableRow, Button, makeStyles, tokens } from '@fluentui/react-components';
import { EditRegular, DeleteRegular, LinkRegular } from '@fluentui/react-icons';
import { Member } from '../types';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '4px',
  s: '8px',
};

const useStyles = makeStyles({
  actionsCell: {
    display: 'flex',
    gap: spacing.s,
  },
  assignedStation: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  unassigned: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
});

interface MemberListItemProps {
  member: Member;
  stationName: string;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
}

export const MemberListItem: React.FC<MemberListItemProps> = ({ 
  member,
  stationName,
  onEdit,
  onDelete,
  onAssign
}) => {
  const styles = useStyles();
  const isAssigned = !!member.assignedStationId;

  return (
    <TableRow>
      <TableCell>{member.name}</TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>
        <span className={!isAssigned ? styles.unassigned : ''}>
          {stationName}
        </span>
      </TableCell>
      <TableCell>
        <div className={styles.actionsCell}>
          <Button 
            icon={<EditRegular />} 
            appearance="subtle" 
            size="small" 
            onClick={onEdit}
            aria-label="Edit member"
          />
          <Button 
            icon={<DeleteRegular />} 
            appearance="subtle" 
            size="small" 
            onClick={onDelete}
            aria-label="Delete member"
          />
          <Button 
            icon={<LinkRegular />} 
            appearance="subtle" 
            size="small" 
            onClick={onAssign}
            aria-label="Assign to station"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}; 