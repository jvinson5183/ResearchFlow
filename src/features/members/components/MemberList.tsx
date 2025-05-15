import React, { useState, useEffect } from 'react';
import {
  TableBody,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Table,
  Title1,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons'; // Using a v9 icon
import { Member } from '../types';
import { MemberListItem } from './MemberListItem';
import { AddMemberDialog } from './AddMemberDialog'; // Import the dialog
import { useAppData } from '../../../contexts/AppDataContext';
import { EditMemberDialog } from './EditMemberDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { MemberAssignmentDialog } from './MemberAssignmentDialog';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: spacing.m,
  },
  table: {
    marginBottom: spacing.m,
  },
  emptyState: {
    textAlign: 'center',
    padding: spacing.l,
    color: tokens.colorNeutralForeground2,
  },
});

export const MemberList: React.FC = () => {
  const styles = useStyles();
  const {
    members,
    stations,
    currentEvent,
    addMember,
    updateMember,
    deleteMember,
    assignMemberToStation,
    unassignMemberFromStation,
  } = useAppData();

  // Debug on component mount
  useEffect(() => {
    console.log('MemberList component mounted');
    console.log('Context stations:', stations);
    console.log('Context stations count:', stations.length);
    
    console.log('Event stations:', currentEvent.stations);
    console.log('Event stations count:', currentEvent.stations.length);
  }, [stations, currentEvent]);

  // Dialog states
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [assigningMember, setAssigningMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Handler functions
  const handleAddMemberSubmit = (newMemberData: Omit<Member, 'id'>) => {
    addMember(newMemberData);
    setIsAddMemberDialogOpen(false);
  };

  const handleEditMemberSubmit = (updates: Partial<Omit<Member, 'id'>>) => {
    if (editingMember) {
      updateMember(editingMember.id, updates);
      setEditingMember(null);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  const handleAssignMember = (member: Member) => {
    setAssigningMember(member);
  };

  const handleAssignMemberSubmit = (stationId: string | null) => {
    if (assigningMember) {
      if (stationId) {
        assignMemberToStation(assigningMember.id, stationId);
      } else {
        unassignMemberFromStation(assigningMember.id);
      }
      setAssigningMember(null);
    }
  };

  const getStationName = (stationId?: string) => {
    if (!stationId) return 'Unassigned';
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : 'Unknown';
  };

  return (
    <div>
      <div className={styles.header}>
        <Title1 as="h1">Members</Title1>
        <Button icon={<AddRegular />} appearance="primary" onClick={() => setIsAddMemberDialogOpen(true)}>
          Add Member
        </Button>
      </div>
      
      {members.length > 0 ? (
        <Table aria-label="Members table" className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Assigned Station</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <MemberListItem 
                key={member.id} 
                member={member}
                stationName={getStationName(member.assignedStationId)}
                onEdit={() => handleEditMember(member)}
                onDelete={() => handleDeleteMember(member)}
                onAssign={() => handleAssignMember(member)}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className={styles.emptyState}>
          No members found. Click "Add Member" to create one.
        </div>
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={handleAddMemberSubmit}
      />

      {/* Edit Member Dialog */}
      {editingMember && (
        <EditMemberDialog
          open={!!editingMember}
          member={editingMember}
          onOpenChange={() => setEditingMember(null)}
          onUpdateMember={handleEditMemberSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {memberToDelete && (
        <DeleteConfirmationDialog
          open={!!memberToDelete}
          itemName={memberToDelete.name}
          itemType="member"
          onOpenChange={() => setMemberToDelete(null)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* Member Assignment Dialog */}
      {assigningMember && (
        <MemberAssignmentDialog
          open={!!assigningMember}
          member={assigningMember}
          stations={currentEvent.stations}
          onOpenChange={() => setAssigningMember(null)}
          onAssignMember={handleAssignMemberSubmit}
        />
      )}
    </div>
  );
}; 