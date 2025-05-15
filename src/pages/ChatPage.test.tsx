import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatPage } from './ChatPage';
import { AppDataProvider } from '../contexts/AppDataContext';
import '@testing-library/jest-dom';

// Mock the context functionality
jest.mock('../contexts/AppDataContext', () => ({
  ...jest.requireActual('../contexts/AppDataContext'),
  useAppData: () => ({
    stations: [
      {
        id: 's1',
        name: 'Station Alpha',
        members: ['m1'],
        tests: [],
        member_count: 1,
        test_count: 0,
        status: 'idle',
        unread_messages: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 's2',
        name: 'Station Beta',
        members: ['m2'],
        tests: [],
        member_count: 1,
        test_count: 0,
        status: 'idle',
        unread_messages: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    currentEvent: {
      chat: [
        {
          id: 'msg_1',
          sender_station_id: 's1',
          recipient_station_id: null, // broadcast
          message: 'Hello everyone!',
          timestamp: new Date().toISOString(),
          read: true,
          thread_id: 'thread_1'
        },
        {
          id: 'msg_2',
          sender_station_id: 's2',
          recipient_station_id: 's1',
          message: 'Hello Station Alpha!',
          timestamp: new Date().toISOString(),
          read: false,
          thread_id: 'thread_2'
        }
      ]
    },
    sendMessage: jest.fn(),
    deleteMessage: jest.fn(),
    getMessagesForStation: jest.fn(() => []),
    getBroadcastMessages: jest.fn(() => []),
    markMessageAsRead: jest.fn()
  })
}));

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat page header correctly', () => {
    render(<ChatPage />);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('renders message controls', () => {
    render(<ChatPage />);
    expect(screen.getByText('Message Controls')).toBeInTheDocument();
    expect(screen.getByText('You are sending as:')).toBeInTheDocument();
    expect(screen.getByText('Send to:')).toBeInTheDocument();
  });

  it('renders station dropdown options', async () => {
    render(<ChatPage />);
    
    // Find the sender dropdown and click it to open
    const senderDropdown = screen.getByLabelText('You are sending as:');
    fireEvent.click(senderDropdown);
    
    // Check for station names in the dropdown
    await waitFor(() => {
      expect(screen.getByText('Station Alpha')).toBeInTheDocument();
      expect(screen.getByText('Station Beta')).toBeInTheDocument();
    });
  });

  it('shows unread message count badge', () => {
    render(<ChatPage />);
    
    // The Station Alpha should show a badge with count 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('disables send button when no message is entered', () => {
    render(<ChatPage />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });
}); 