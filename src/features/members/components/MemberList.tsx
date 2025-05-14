import React, { useState } from 'react';
import {
  TableBody,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Table,
  Title1,
  Button,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons'; // Using a v9 icon
import { Member } from '../types';
import { MemberListItem } from './MemberListItem';
import { AddMemberDialog } from './AddMemberDialog'; // Import the dialog

// Initial mock data
const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Dr. Eleanor Vance',
    role: 'Lead Researcher',
    email: 'eleanor.vance@example.com',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Technician',
    email: 'marcus.chen@example.com',
  },
  {
    id: '3',
    name: 'Aisha Khan',
    role: 'Research Assistant',
    email: 'aisha.khan@example.com',
  },
];

export const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const handleAddMemberSubmit = (newMemberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...newMemberData,
      id: Date.now().toString(), // Generate a simple unique ID
    };
    setMembers(prevMembers => [...prevMembers, newMember]);
    setIsAddMemberDialogOpen(false); // Close dialog on submit
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title1 as="h1">Members</Title1>
        <Button icon={<AddRegular />} appearance="primary" onClick={() => setIsAddMemberDialogOpen(true)}>
          Add Member
        </Button>
      </div>
      <Table aria-label="Members table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            {/* <TableHeaderCell>Actions</TableHeaderCell> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <MemberListItem key={member.id} member={member} />
          ))}
        </TableBody>
      </Table>
      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={handleAddMemberSubmit}
      />
    </div>
  );
}; 