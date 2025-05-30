import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { FluentProvider, TableBody, Table } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme'; // Adjusted path
import { MemberListItem } from './MemberListItem';
import { Member } from '../types';

describe('MemberListItem Component', () => {
  const mockMember: Member = {
    id: '1',
    name: 'Test User',
    role: 'Tester',
    email: 'test@example.com',
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onAssign: jest.fn(),
  };

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <FluentProvider theme={researchFlowTheme}>
        <Table>
          <TableBody>{ui}</TableBody>
        </Table>
      </FluentProvider>
    );
  };

  it('renders member details correctly', () => {
    renderWithTheme(
      <MemberListItem 
        member={mockMember} 
        stationName="Unassigned" 
        onEdit={mockHandlers.onEdit} 
        onDelete={mockHandlers.onDelete} 
        onAssign={mockHandlers.onAssign} 
      />
    );

    const row = screen.getByRole('row');
    expect(within(row).getByText('Test User')).toBeInTheDocument();
    expect(within(row).getByText('Tester')).toBeInTheDocument();
    expect(within(row).getByText('test@example.com')).toBeInTheDocument();
    expect(within(row).getByText('Unassigned')).toBeInTheDocument();
  });
}); 