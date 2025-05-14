// Must place jest.mock before imports
jest.mock('./TestListItem', () => ({
  TestListItem: jest.fn().mockImplementation(({ test, onEdit, onDelete, index, moveTest }) => (
    <tr data-testid={`test-list-item-${test.id}`}>
      <td>{test.name}</td>
    </tr>
  ))
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestList } from './TestList';
import { Test, TestStatus } from '../types';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme';
// DndProvider and HTML5Backend are already in TestList.tsx, no need to mock or wrap here unless testing TestList's direct dnd setup

// Get reference to the mocked component
const MockTestListItem = require('./TestListItem').TestListItem;

const mockTests: Test[] = [
  { id: '1', name: 'Test A', description: 'Description A', estimatedDuration: 30, status: TestStatus.Pending },
  { id: '2', name: 'Test B', description: 'Description B', estimatedDuration: 45, status: TestStatus.InProgress },
];

const mockOnEditTest = jest.fn();
const mockOnDeleteTest = jest.fn();
const mockMoveTest = jest.fn(); // Mock for moveTest prop

// Wrap component with FluentProvider to handle Fluent UI components
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <FluentProvider theme={researchFlowTheme}>
      {ui}
    </FluentProvider>
  );
};

describe('TestList', () => {
  beforeEach(() => {
    MockTestListItem.mockClear();
    mockOnEditTest.mockClear();
    mockOnDeleteTest.mockClear();
    mockMoveTest.mockClear(); // Clear mock before each test
  });

  it('renders a list of tests, passing all required props to TestListItem', () => {
    renderWithTheme(
      <TestList 
        tests={mockTests} 
        onEditTest={mockOnEditTest} 
        onDeleteTest={mockOnDeleteTest} 
        moveTest={mockMoveTest} // Pass mockMoveTest
      />
    );
    expect(MockTestListItem).toHaveBeenCalledTimes(2);
    mockTests.forEach((test, index) => {
      expect(MockTestListItem).toHaveBeenCalledWith(
        expect.objectContaining({ 
          test: test, 
          index: index, // Check if index is passed
          onEdit: mockOnEditTest, 
          onDelete: mockOnDeleteTest, 
          moveTest: mockMoveTest // Check if moveTest is passed
        }), 
        expect.anything()
      );
    });
  });

  it('renders a message when no tests are available', () => {
    renderWithTheme(
      <TestList 
        tests={[]} 
        onEditTest={mockOnEditTest} 
        onDeleteTest={mockOnDeleteTest} 
        moveTest={mockMoveTest} // Pass mockMoveTest
      />
    );
    expect(screen.getByText('No tests available')).toBeInTheDocument();
    expect(MockTestListItem).not.toHaveBeenCalled();
  });
}); 