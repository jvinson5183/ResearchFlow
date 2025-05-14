import React from 'react';
import { render, screen } from '@testing-library/react';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme'; // Adjusted path
import { MemberList } from './MemberList';
import { Member } from '../types'; // Import Member type

// Mock the MemberListItem to prevent issues with its internal rendering if not needed for these tests
jest.mock('./MemberListItem', () => ({
  // Define the mock as an explicit React functional component
  MemberListItem: function MockedMemberListItem({ member }: { member: Member }) { // Add props and type them
    return (
      <tr data-testid={`mock-member-${member.id}`}>
        <td>{member.name}</td>
        <td>{member.role}</td>
        <td>{member.email}</td>
      </tr>
    );
  },
}));

describe('MemberList Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <FluentProvider theme={researchFlowTheme}>
        {ui}
      </FluentProvider>
    );
  };

  it('renders table headers and mock members', () => {
    renderWithTheme(<MemberList />);

    // Check for table headers
    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Role/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Email/i })).toBeInTheDocument();

    // Check for mock member data (based on the mock in MemberList.tsx)
    expect(screen.getByText('Dr. Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
    expect(screen.getByText('Aisha Khan')).toBeInTheDocument();

    // Check for Add Member button
    expect(screen.getByRole('button', { name: /Add Member/i })).toBeInTheDocument();
  });

  // Add more tests later for interactions like adding, editing, deleting members
}); 