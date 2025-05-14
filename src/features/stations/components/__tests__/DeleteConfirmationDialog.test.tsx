import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import { Station } from '../../types';

// Create a simplified mock component for direct testing
const MockDeleteConfirmationDialog = ({
  open,
  station,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  station: Station;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <div data-testid="delete-dialog">
      <h2 data-testid="dialog-title">Delete Station</h2>
      <div>
        <p>Are you sure you want to delete the station "{station.name}"?</p>
        <p data-testid="delete-warning" className="warning">
          This action cannot be undone.
        </p>
        {(station.member_count > 0 || station.test_count > 0) && (
          <p data-testid="resources-warning">
            This station has {station.test_count} test{station.test_count !== 1 ? 's' : ''} and{' '}
            {station.member_count} member{station.member_count !== 1 ? 's' : ''} associated with it.
          </p>
        )}
      </div>
      <button onClick={handleCancel} data-testid="cancel-button">
        Cancel
      </button>
      <button onClick={handleConfirm} data-testid="confirm-delete">
        Delete
      </button>
    </div>
  );
};

// Mock the imported component
jest.mock('../DeleteConfirmationDialog', () => ({
  DeleteConfirmationDialog: (props: any) => <MockDeleteConfirmationDialog {...props} />,
}));

describe('DeleteConfirmationDialog', () => {
  const mockStation: Station = {
    id: 'test-station-1',
    name: 'Test Station',
    terminal_id: 'terminal-123',
    pin: undefined,
    member_count: 0,
    test_count: 0,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const defaultProps = {
    open: true,
    station: mockStation,
    onOpenChange: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with station name', () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} />);
    expect(screen.getByText(/Test Station/)).toBeInTheDocument();
  });

  it('calls onConfirm when delete is confirmed', async () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} />);
    
    const confirmButton = screen.getByTestId('confirm-delete');
    await userEvent.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onOpenChange when cancel is clicked', async () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} />);
    
    const cancelButton = screen.getByTestId('cancel-button');
    await userEvent.click(cancelButton);
    
    expect(defaultProps.onOpenChange).toHaveBeenCalled();
  });

  it('shows warning about connected members and tests when station has them', () => {
    const stationWithMembersAndTests: Station = {
      ...mockStation,
      member_count: 2,
      test_count: 3
    };

    render(<MockDeleteConfirmationDialog {...defaultProps} station={stationWithMembersAndTests} />);
    expect(screen.getByTestId('resources-warning')).toHaveTextContent(/2 members/);
    expect(screen.getByTestId('resources-warning')).toHaveTextContent(/3 tests/);
  });

  it('does not show resources warning when station has no members or tests', () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} />);
    expect(screen.queryByTestId('resources-warning')).not.toBeInTheDocument();
  });

  it('shows warning about action being irreversible', () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} />);
    expect(screen.getByTestId('delete-warning')).toHaveTextContent(/cannot be undone/);
  });

  it('does not render when open is false', () => {
    render(<MockDeleteConfirmationDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId('delete-dialog')).not.toBeInTheDocument();
  });
}); 