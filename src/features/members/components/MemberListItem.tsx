import React from 'react';
import { TableCell, TableRow } from '@fluentui/react-components';
import { Member } from '../types';

interface MemberListItemProps {
  member: Member;
}

export const MemberListItem: React.FC<MemberListItemProps> = ({ member }) => {
  return (
    <TableRow>
      <TableCell>{member.name}</TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>{member.email}</TableCell>
      {/* Add cells for actions like edit/delete later */}
    </TableRow>
  );
}; 