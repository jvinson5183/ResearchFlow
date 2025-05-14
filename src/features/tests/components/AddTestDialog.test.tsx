import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FluentProvider } from '@fluentui/react-components';
import { researchFlowTheme } from '../../../styles/theme';
import { AddTestDialog } from './AddTestDialog';
import { Test, TestStatus } from '../types';

// Helper to wrap with FluentProvider and theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<FluentProvider theme={researchFlowTheme}>{ui}</FluentProvider>);
};

describe('AddTestDialog Component', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnSubmit.mockClear();
  });

  it('renders correctly when open', () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByText('Add New Test')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('e.g., Reaction Time Test')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a brief description of the test. Supports Markdown.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 30')).toBeInTheDocument();
  });

  it('does not render when not open', () => {
    renderWithTheme(
      <AddTestDialog open={false} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    expect(screen.queryByText('Add New Test')).not.toBeInTheDocument();
  });

  it('calls onOpenChange with false when Cancel button is clicked', () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('updates input fields correctly', async () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Reaction Time Test') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Enter a brief description of the test. Supports Markdown.') as HTMLTextAreaElement;
    const durationInput = screen.getByPlaceholderText('e.g., 30') as HTMLInputElement;

    await userEvent.type(nameInput, 'New Test Name');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '45');

    expect(nameInput.value).toBe('New Test Name');
    expect(descriptionInput.value).toBe('Test Description');
    expect(durationInput.value).toBe('45');
  });

  it('calls onSubmit with correct data and closes on submit with valid inputs for ADD mode', async () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );

    await userEvent.type(screen.getByPlaceholderText('e.g., Reaction Time Test'), 'Valid Test');
    await userEvent.type(screen.getByPlaceholderText('Enter a brief description of the test. Supports Markdown.'), 'Valid Desc');
    const durationInput = screen.getByPlaceholderText('e.g., 30');
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '60');

    fireEvent.click(screen.getByText('Add Test'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Valid Test',
      description: 'Valid Desc',
      estimatedDuration: 60,
      status: TestStatus.Pending,
    });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onSubmit with correct data and closes on submit with valid inputs for EDIT mode', async () => {
    const mockExistingTest: Test = {
      id: 'test-123',
      name: 'Old Name',
      description: 'Old Description',
      estimatedDuration: 30,
      status: TestStatus.InProgress,
    };
    renderWithTheme(
      <AddTestDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSubmit={mockOnSubmit} 
        initialData={mockExistingTest} 
      />
    );

    const nameInput = screen.getByPlaceholderText('e.g., Reaction Time Test') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Enter a brief description of the test. Supports Markdown.') as HTMLTextAreaElement;
    const durationInput = screen.getByPlaceholderText('e.g., 30') as HTMLInputElement;

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Test Name');
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Updated Description');
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '90');

    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Updated Test Name',
      description: 'Updated Description',
      estimatedDuration: 90,
      status: TestStatus.InProgress,
    });
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not call onSubmit and stays open on submit with invalid duration', async () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    await userEvent.type(screen.getByPlaceholderText('e.g., Reaction Time Test'), 'Invalid Duration Test');
    const durationInput = screen.getByPlaceholderText('e.g., 30');
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, 'abc');
    fireEvent.click(screen.getByText('Add Test'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false); 
  });

   it('does not call onSubmit and stays open on submit with zero duration', async () => {
    renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    await userEvent.type(screen.getByPlaceholderText('e.g., Reaction Time Test'), 'Zero Duration Test');
    const durationInput = screen.getByPlaceholderText('e.g., 30');
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '0'); 
    fireEvent.click(screen.getByText('Add Test'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('clears fields when closed and reopened (not in edit mode)', async () => {
    const { rerender } = renderWithTheme(
      <AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />
    );
    const nameInput = screen.getByPlaceholderText('e.g., Reaction Time Test') as HTMLInputElement;
    await userEvent.type(nameInput, 'Temporary Name');
    expect(nameInput.value).toBe('Temporary Name');

    rerender(<AddTestDialog open={false} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />);
    rerender(<AddTestDialog open={true} onOpenChange={mockOnOpenChange} onSubmit={mockOnSubmit} />);
    
    const newNameInput = screen.getByPlaceholderText('e.g., Reaction Time Test') as HTMLInputElement;
    expect(newNameInput.value).toBe('');
  });

  it('prefills fields and uses correct title/button for edit mode', () => {
    const mockExistingTest: Test = {
      id: 'edit-id-1',
      name: 'Existing Test Name',
      description: 'Existing Description',
      estimatedDuration: 77,
      status: TestStatus.Completed,
    };
    renderWithTheme(
      <AddTestDialog 
        open={true} 
        onOpenChange={mockOnOpenChange} 
        onSubmit={mockOnSubmit} 
        initialData={mockExistingTest} 
      />
    );
    expect(screen.getByText('Edit Test')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect((screen.getByPlaceholderText('e.g., Reaction Time Test') as HTMLInputElement).value).toBe(mockExistingTest.name);
    expect((screen.getByPlaceholderText('Enter a brief description of the test. Supports Markdown.') as HTMLTextAreaElement).value).toBe(mockExistingTest.description);
    expect((screen.getByPlaceholderText('e.g., 30') as HTMLInputElement).value).toBe(mockExistingTest.estimatedDuration.toString());
  });
}); 