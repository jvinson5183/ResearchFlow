import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsPage } from './SettingsPage';
import { AppDataProvider } from '../contexts/AppDataContext';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the createObjectURL and revokeObjectURL
URL.createObjectURL = jest.fn(() => 'blob:mock-url');
URL.revokeObjectURL = jest.fn();

describe('SettingsPage', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('renders event configuration form', () => {
    render(
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    );

    // Check main elements are rendered
    expect(screen.getByText('Event Configuration')).toBeInTheDocument();
    expect(screen.getByText('Current Event')).toBeInTheDocument();
    expect(screen.getByText('Import/Export')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText('Event Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Time (minutes)')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  test('updates event name and max time', async () => {
    render(
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    );

    // Change event name
    const eventNameInput = screen.getByLabelText('Event Name');
    fireEvent.change(eventNameInput, { target: { value: 'Test Event 123' } });
    
    // Change max time (SpinButton component might need special handling)
    const maxTimeInput = screen.getByLabelText('Maximum Time (minutes)');
    fireEvent.change(maxTimeInput, { target: { value: '180' } });
    
    // Click save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Check if localStorage was called
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  test('validates inputs before saving', async () => {
    render(
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    );

    // Clear event name
    const eventNameInput = screen.getByLabelText('Event Name');
    fireEvent.change(eventNameInput, { target: { value: '' } });
    
    // Click save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Check if error toast appears
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Event name is required')).toBeInTheDocument();
    });
    
    // localStorage should not have been called
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  test('creates a new event', async () => {
    render(
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    );

    // Set event name and max time
    const eventNameInput = screen.getByLabelText('Event Name');
    fireEvent.change(eventNameInput, { target: { value: 'New Test Event' } });
    
    const maxTimeInput = screen.getByLabelText('Maximum Time (minutes)');
    fireEvent.change(maxTimeInput, { target: { value: '90' } });
    
    // Click new button
    const newButton = screen.getByText('New');
    fireEvent.click(newButton);
    
    // Check if success toast appears
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('New event created successfully')).toBeInTheDocument();
    });
  });

  test('exports event configuration', () => {
    render(
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    );

    // Mock DOM manipulation for file export
    const mockLink = { 
      href: '', 
      download: '', 
      click: jest.fn() 
    };
    
    // Mock document methods
    document.createElement = jest.fn().mockReturnValue(mockLink as unknown as HTMLElement);
    document.body.appendChild = jest.fn().mockReturnValue(mockLink as unknown as Node);
    document.body.removeChild = jest.fn().mockReturnValue(mockLink as unknown as Node);

    // Click export button
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    // Check if blob URL was created and link was clicked
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
}); 