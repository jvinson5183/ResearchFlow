import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme'; // Adjusted path
import { MemberList } from './MemberList';
import { Member } from '../types'; // Import Member type

// Mock functions that will be used in the mocks
const mockAddMember = jest.fn();
const mockOpenChange = jest.fn();

// Mock the MemberListItem component
jest.mock('./MemberListItem', () => ({
  MemberListItem: function MockMemberListItem(props: { member: Member }) {
    const member = props.member;
    return (
      <tr data-testid={`member-item-${member.id}`}>
        <td>{member.name}</td>
        <td>{member.role}</td>
        <td>{member.email}</td>
      </tr>
    );
  },
}));

// Mock AddMemberDialog
jest.mock('./AddMemberDialog', () => ({
  AddMemberDialog: function MockAddMemberDialog(props: { 
    open: boolean; 
    onOpenChange: (isOpen: boolean) => void; 
    onAddMember: (member: Omit<Member, 'id'>) => void 
  }) {
    if (!props.open) return null;
    
    // We can't use React.useEffect inside the mock factory, so we'll directly assign
    mockAddMember.mockImplementation(props.onAddMember);
    mockOpenChange.mockImplementation(props.onOpenChange);
    
    return (
      <div data-testid="add-member-dialog">
        <button 
          data-testid="submit-button"
          onClick={() => props.onAddMember({ name: 'Test User', role: 'Test Role', email: 'test@example.com' })}
        >
          Add Member
        </button>
        <button 
          data-testid="cancel-button"
          onClick={() => props.onOpenChange(false)}
        >
          Cancel
        </button>
      </div>
    );
  },
}));

describe('MemberList Component', () => {
  // Clear mock functions before each test
  beforeEach(() => {
    mockAddMember.mockClear();
    mockOpenChange.mockClear();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <FluentProvider theme={researchFlowTheme}>
        {ui}
      </FluentProvider>
    );
  };

  it('renders table headers and initial members', () => {
    renderWithTheme(<MemberList />);
    
    // Check for headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    
    // Check for initial members (relies on our mock implementation)
    expect(screen.getByTestId('member-item-1')).toBeInTheDocument();
    expect(screen.getByText('Dr. Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
  });

  it('opens AddMemberDialog when Add Member button is clicked', () => {
    renderWithTheme(<MemberList />);
    
    // Dialog should not be visible initially
    expect(screen.queryByTestId('add-member-dialog')).not.toBeInTheDocument();
    
    // Click the "Add Member" button
    fireEvent.click(screen.getByText('Add Member'));
    
    // Dialog should now be visible
    expect(screen.getByTestId('add-member-dialog')).toBeInTheDocument();
  });

  it('adds a new member when form is submitted', () => {
    renderWithTheme(<MemberList />);
    
    // Open the dialog
    fireEvent.click(screen.getByText('Add Member'));
    
    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Should add a new member to the list
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('closes dialog when cancel is clicked', () => {
    renderWithTheme(<MemberList />);
    
    // Open the dialog
    fireEvent.click(screen.getByText('Add Member'));
    expect(screen.getByTestId('add-member-dialog')).toBeInTheDocument();
    
    // Click cancel
    fireEvent.click(screen.getByTestId('cancel-button'));
    
    // Dialog should be closed
    expect(screen.queryByTestId('add-member-dialog')).not.toBeInTheDocument();
  });
}); 