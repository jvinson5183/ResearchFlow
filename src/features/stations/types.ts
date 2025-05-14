import { Member } from '../members/types';
import { Test } from '../tests/types';

export interface Station {
  id: string;
  name: string;
  terminal_id?: string; // Optional until terminal-station locking is implemented
  pin?: string; // PIN for terminal locking, only stored when terminal is locked
  member_count: number;
  test_count: number;
  created_at: string;
  updated_at: string;
  members?: any[]; // Array of members for compatibility with existing code
  tests?: any[]; // Array of tests for compatibility with existing code
}

// For managing station status in the UI
export enum StationStatus {
  Idle = 'idle',
  Ready = 'ready',
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed'
} 