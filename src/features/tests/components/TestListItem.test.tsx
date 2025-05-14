import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme'; // Adjust path as necessary
import { TestListItem, ItemTypes } from './TestListItem'; // Import ItemTypes
import { Test, TestStatus } from '../types';
import { EditRegular, DeleteRegular, DragRegular } from '@fluentui/react-icons'; // Import for assertion if needed
import { DndProvider } from 'react-dnd'; // Required for components using dnd hooks
import { HTML5Backend } from 'react-dnd-html5-backend'; // Required backend

const mockTest: Test = {
  id: 't1',
  name: 'Sample Test Item',
  description: 'This is a sample description for the test item.',
  estimatedDuration: 60,
  status: TestStatus.Pending,
};

const mockTestNoDescription: Test = {
  id: 't2',
  name: 'Test Without Description',
  estimatedDuration: 30,
  status: TestStatus.Completed,
  description: undefined, // Explicitly undefined
};

// Helper to wrap with FluentProvider, DndProvider and theme
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <FluentProvider theme={researchFlowTheme}>
        <table>
          <tbody>
            {ui}
          </tbody>
        </table>
      </FluentProvider>
    </DndProvider>
  );
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();
const mockMoveTest = jest.fn(); // Mock for moveTest prop

describe('TestListItem Component', () => {
  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockMoveTest.mockClear(); // Clear mock before each test
  });

  it('renders test details correctly', () => {
    renderWithProviders(
      <TestListItem 
        test={mockTest} 
        index={0} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        moveTest={mockMoveTest} 
      />
    );
    expect(screen.getByText(mockTest.name)).toBeInTheDocument();
    expect(screen.getByText(mockTest.description!)).toBeInTheDocument();
    expect(screen.getByText(`${mockTest.estimatedDuration} min`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Edit ${mockTest.name}` })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Delete ${mockTest.name}` })).toBeInTheDocument();
    expect(screen.getByRole('graphics-symbol', { name: /drag/i })).toBeInTheDocument(); // Check for drag handle
  });

  it('renders N/A for description if not provided', () => {
    renderWithProviders(
      <TestListItem 
        test={mockTestNoDescription} 
        index={0} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        moveTest={mockMoveTest} 
      />
    );
    expect(screen.getByText(mockTestNoDescription.name)).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('calls onEdit when the edit button is clicked', () => {
    renderWithProviders(
      <TestListItem 
        test={mockTest} 
        index={0} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        moveTest={mockMoveTest} 
      />
    );
    const editButton = screen.getByRole('button', { name: `Edit ${mockTest.name}` });
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTest);
  });

  it('calls onDelete when the delete button is clicked', () => {
    renderWithProviders(
      <TestListItem 
        test={mockTest} 
        index={0} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        moveTest={mockMoveTest} 
      />
    );
    const deleteButton = screen.getByRole('button', { name: `Delete ${mockTest.name}` });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTest.id);
  });

  // Basic drag and drop test (integration is complex, this is a light check)
  // More comprehensive tests would require @testing-library/react-dnd
  it('should allow dragging', () => {
    renderWithProviders(
      <TestListItem 
        test={mockTest} 
        index={0} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        moveTest={mockMoveTest} 
      />
    );
    const dragHandle = screen.getByRole('graphics-symbol', { name: /drag/i });
    expect(dragHandle).toBeInTheDocument();
    // Further drag simulation is complex with RTL basic dnd testing utilities
  });
}); 