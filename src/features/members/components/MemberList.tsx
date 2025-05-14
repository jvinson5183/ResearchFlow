import React from 'react';
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

// Mock data for now
const mockMembers: Member[] = [
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
  // TODO: Add state and functions for adding/editing/deleting members

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title1 as="h1">Members</Title1>
        <Button icon={<AddRegular />} appearance="primary">
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
          {mockMembers.map((member) => (
            <MemberListItem key={member.id} member={member} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 