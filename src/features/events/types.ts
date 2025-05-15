import { Station } from '../stations/types';
import { Test } from '../tests/types';
import { Member } from '../members/types';
import { ChatMessage } from '../chat/types';

/**
 * Main event configuration type for the ResearchFlow application
 */
export interface EventConfiguration {
  event_name: string;
  max_time: number; // in minutes
  stations: Station[];
  members: Member[];
  tests: Test[];
  chat: ChatMessage[];
  created_at: string;
  updated_at: string;
}

/**
 * Status of an event
 */
export enum EventStatus {
  Draft = 'draft',
  Ready = 'ready',
  InProgress = 'in_progress',
  Completed = 'completed',
  Paused = 'paused',
} 