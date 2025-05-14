import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../styles/theme'; // Adjust path
import { TestsPage } from './TestsPage';
import { Test, TestStatus } from '../features/tests/types';

// Mock child components
const mockTestList = jest.fn();
jest.mock('../features/tests/components/TestList', () => ({
  TestList: (props: any) => {
    mockTestList(props);
    return <div data-testid="test-list-mock">{props.tests.length} tests</div>;
  },
}));

const mockAddTestDialog = jest.fn();
jest.mock('../features/tests/components/AddTestDialog', () => ({
  AddTestDialog: (props: any) => {
    mockAddTestDialog(props);
    if (props.open) {
      // To make the test for edit mode pass, we need to simulate the dialog calling onSubmit
      // when its initialData is present and a save is triggered (not fully implemented here, but test will guide)
      return (
        <div data-testid="add-test-dialog-mock">
          Dialog Open - {props.initialData ? 'Edit Mode' : 'Add Mode'}
          {/* Simulate a submit button if needed for tests to trigger props.onSubmit */}
        </div>
      );
    }
    return null;
  },
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<FluentProvider theme={researchFlowTheme}>{ui}</FluentProvider>);
};

// initialMockTests is not directly used to override TestsPage's internal state in these tests,
// but can be useful for defining data for new tests.

describe('TestsPage Component', () => {
  beforeEach(() => {
    mockTestList.mockClear();
    mockAddTestDialog.mockClear();
  });

  it('renders title, add button, and initial test list', () => {
    renderWithTheme(<TestsPage />);
    expect(screen.getByRole('heading', { name: /Tests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Test/i })).toBeInTheDocument();
    expect(mockTestList).toHaveBeenCalled();
    // TestsPage has 3 initial tests by default in its own state
    expect(screen.getByText('3 tests')).toBeInTheDocument(); 
  });

  it('shows AddTestDialog in add mode when Add Test button is clicked', () => {
    renderWithTheme(<TestsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Add Test/i }));
    
    expect(mockAddTestDialog).toHaveBeenCalledWith(expect.objectContaining({ open: true, initialData: undefined }));
    expect(screen.getByTestId('add-test-dialog-mock')).toHaveTextContent('Dialog Open - Add Mode');
  });

  it('hides AddTestDialog when onOpenChange is called with false', async () => {
    renderWithTheme(<TestsPage />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Test/i })); // Open dialog
    });
    
    const lastCallProps = mockAddTestDialog.mock.calls[mockAddTestDialog.mock.calls.length - 1][0];
    expect(lastCallProps.open).toBe(true);
    
    await act(async () => {
      lastCallProps.onOpenChange(false); // Simulate closing
    });

    expect(mockAddTestDialog).toHaveBeenLastCalledWith(expect.objectContaining({ open: false }));
    expect(screen.queryByTestId('add-test-dialog-mock')).not.toBeInTheDocument();
  });

  it('adds a new test to TestList when onSubmit is called from dialog (add mode)', async () => {
    renderWithTheme(<TestsPage />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Test/i })); // Open dialog
    });

    const newTestPayload = {
      name: 'Test Gamma',
      description: 'A new test from dialog',
      estimatedDuration: 50,
      status: TestStatus.Pending, // AddTestDialog will add this if not provided
    };

    const lastDialogProps = mockAddTestDialog.mock.calls[mockAddTestDialog.mock.calls.length - 1][0];
    await act(async () => {
      lastDialogProps.onSubmit(newTestPayload); 
    });

    const testListLastCallProps = mockTestList.mock.calls[mockTestList.mock.calls.length - 1][0];
    expect(testListLastCallProps.tests.length).toBe(4); // 3 initial + 1 new
    expect(testListLastCallProps.tests).toEqual(expect.arrayContaining([
      expect.objectContaining({name: 'Test Gamma'})
    ]));
    expect(screen.getByText('4 tests')).toBeInTheDocument();
  });

  it('opens dialog in edit mode and updates a test when onSubmit is called', async () => {
    renderWithTheme(<TestsPage />); // Page starts with 3 initial tests
    
    // Get initial tests to know what to edit
    const initialTestsInPageState = mockTestList.mock.calls[0][0].tests; // Get tests from first call to TestList
    const testToEdit = initialTestsInPageState[0];

    // Manually trigger the state change that would happen if onEditTest was called
    act(() => {
      const testListProps = mockTestList.mock.calls[0][0]; // Get props of the first render of TestList
      testListProps.onEditTest(testToEdit); // This should trigger TestsPage to set editingTest and open dialog
    });

    // Check if dialog is opened in edit mode
    let lastDialogProps = mockAddTestDialog.mock.calls[mockAddTestDialog.mock.calls.length - 1][0];
    expect(lastDialogProps.open).toBe(true);
    expect(lastDialogProps.initialData).toEqual(testToEdit);
    expect(screen.getByTestId('add-test-dialog-mock')).toHaveTextContent('Dialog Open - Edit Mode');

    const updatedTestData = {
      name: 'Updated Cognitive Assessment A',
      description: 'Updated description.',
      estimatedDuration: 35,
      status: testToEdit.status, // status usually doesn't change via this form
    };

    await act(async () => {
      lastDialogProps.onSubmit(updatedTestData);
    });

    // Dialog should close
    expect(mockAddTestDialog).toHaveBeenLastCalledWith(expect.objectContaining({ open: false }));

    // TestList should be updated with the modified test
    const testListLastCallProps = mockTestList.mock.calls[mockTestList.mock.calls.length - 1][0];
    expect(testListLastCallProps.tests.length).toBe(3); // Still 3 tests
    const editedTestInList = testListLastCallProps.tests.find((t: Test) => t.id === testToEdit.id);
    expect(editedTestInList).toEqual(expect.objectContaining({
      name: 'Updated Cognitive Assessment A',
      description: 'Updated description.',
      estimatedDuration: 35,
    }));
    expect(screen.getByText('3 tests')).toBeInTheDocument(); // Count remains same
  });

  it('deletes a test when onDeleteTest is called and confirmation is approved', async () => {
    renderWithTheme(<TestsPage />); // Page starts with 3 initial tests
    
    // Get initial tests to know what to delete
    const initialTestsInPageState = mockTestList.mock.calls[0][0].tests;
    const testToDelete = initialTestsInPageState[0];
    
    // Manually trigger the delete function by calling onDeleteTest prop
    act(() => {
      const testListProps = mockTestList.mock.calls[0][0];
      testListProps.onDeleteTest(testToDelete.id);
    });
    
    // Confirm deletion - find the delete dialog button and click it
    const deleteButton = screen.getByRole('button', { name: /Delete/i, exact: false });
    await act(async () => {
      fireEvent.click(deleteButton);
    });
    
    // Check if the test was removed
    const testListLastCallProps = mockTestList.mock.calls[mockTestList.mock.calls.length - 1][0];
    expect(testListLastCallProps.tests.length).toBe(2); // One fewer test
    expect(testListLastCallProps.tests.find((t: Test) => t.id === testToDelete.id)).toBeUndefined();
    expect(screen.getByText('2 tests')).toBeInTheDocument();
  });
  
  it('does not delete a test when delete dialog is canceled', async () => {
    renderWithTheme(<TestsPage />); // Page starts with 3 initial tests
    
    // Get initial test count
    const initialTestCount = mockTestList.mock.calls[0][0].tests.length;
    const testToDelete = mockTestList.mock.calls[0][0].tests[0];
    
    // Trigger delete dialog
    act(() => {
      const testListProps = mockTestList.mock.calls[0][0];
      testListProps.onDeleteTest(testToDelete.id);
    });
    
    // Find and click the cancel button
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    // Test count should remain the same
    const testListLastCallProps = mockTestList.mock.calls[mockTestList.mock.calls.length - 1][0];
    expect(testListLastCallProps.tests.length).toBe(initialTestCount); // Count unchanged
    expect(screen.getByText(`${initialTestCount} tests`)).toBeInTheDocument();
  });
}); 