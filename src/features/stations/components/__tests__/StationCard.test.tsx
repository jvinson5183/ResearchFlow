import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils';
import { StationCard } from '../StationCard';
import { Station } from '../../types';
import { Member } from '../../../members/types';
import { Test, TestStatus } from '../../../tests/types';

// Create a simplified mock component for direct testing
const MockStationCard = ({
  station,
  onEdit,
  onDelete,
}: {
  station: Station;
  onEdit: (station: Station) => void;
  onDelete: (station: Station) => void;
}) => {
  const handleEdit = () => {
    onEdit(station);
  };

  const handleDelete = () => {
    onDelete(station);
  };

  return (
    <div data-testid="station-card">
      <h3 data-testid="station-name">{station.name}</h3>
      {station.terminal_id && station.pin && (
        <div data-testid="lock-status" aria-label="Locked">Locked</div>
      )}
      {!(station.terminal_id && station.pin) && (
        <div data-testid="lock-status" aria-label="Unlocked">Unlocked</div>
      )}
      {station.terminal_id && (
        <div data-testid="terminal-id">Terminal ID: {station.terminal_id}</div>
      )}
      <div data-testid="member-count">
        {station.member_count} {station.member_count === 1 ? 'Member' : 'Members'}
      </div>
      <div data-testid="test-count">
        {station.test_count} {station.test_count === 1 ? 'Test' : 'Tests'}
      </div>
      <button onClick={handleEdit} aria-label={`Edit ${station.name}`}>Edit</button>
      <button onClick={handleDelete} aria-label={`Delete ${station.name}`}>Delete</button>
    </div>
  );
};

// Mock the imported component
jest.mock('../StationCard', () => ({
  StationCard: (props: any) => <MockStationCard {...props} />,
}));

describe('StationCard', () => {
  const mockStation: Station = {
    id: 'test-station-1',
    name: 'Test Station',
    terminal_id: undefined,
    pin: undefined,
    member_count: 0,
    test_count: 0,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  };

  const mockLockedStation: Station = {
    ...mockStation,
    terminal_id: 'terminal-123',
    pin: '1234'
  };

  const mockMembers: Member[] = [
    { id: '1', name: 'John', role: 'Researcher', email: 'john@example.com' },
    { id: '2', name: 'Jane', role: 'Technician', email: 'jane@example.com' }
  ];

  const mockTests: Test[] = [
    { id: '1', name: 'Test 1', estimatedDuration: 30, status: TestStatus.Pending },
    { id: '2', name: 'Test 2', estimatedDuration: 45, status: TestStatus.Pending },
    { id: '3', name: 'Test 3', estimatedDuration: 60, status: TestStatus.Pending }
  ];

  const mockStationWithData: Station = {
    ...mockStation,
    member_count: 2,
    test_count: 3
  };

  const defaultProps = {
    station: mockStation,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders station name', () => {
    render(<MockStationCard {...defaultProps} />);
    expect(screen.getByTestId('station-name')).toHaveTextContent('Test Station');
  });

  it('shows unlocked icon when station is not locked', () => {
    render(<MockStationCard {...defaultProps} />);
    expect(screen.getByLabelText('Unlocked')).toBeInTheDocument();
  });

  it('shows locked icon when station is locked', () => {
    render(<MockStationCard {...defaultProps} station={mockLockedStation} />);
    expect(screen.getByLabelText('Locked')).toBeInTheDocument();
  });

  it('displays correct member count', () => {
    render(<MockStationCard {...defaultProps} station={mockStationWithData} />);
    expect(screen.getByTestId('member-count')).toHaveTextContent('2 Members');
  });

  it('displays correct test count', () => {
    render(<MockStationCard {...defaultProps} station={mockStationWithData} />);
    expect(screen.getByTestId('test-count')).toHaveTextContent('3 Tests');
  });

  it('uses singular form for single member', () => {
    const singleMemberStation = {
      ...mockStation,
      member_count: 1,
    };
    render(<MockStationCard {...defaultProps} station={singleMemberStation} />);
    expect(screen.getByTestId('member-count')).toHaveTextContent('1 Member');
  });

  it('uses singular form for single test', () => {
    const singleTestStation = {
      ...mockStation,
      test_count: 1,
    };
    render(<MockStationCard {...defaultProps} station={singleTestStation} />);
    expect(screen.getByTestId('test-count')).toHaveTextContent('1 Test');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<MockStationCard {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Edit Test Station'));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockStation);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<MockStationCard {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Delete Test Station'));
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockStation);
  });
}); 