export enum TestStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Failed = 'Failed',
  Skipped = 'Skipped',
}

export interface Test {
  id: string; // Using string for ID for consistency with Member ID
  name: string;
  description?: string; // Optional description
  estimatedDuration: number; // in minutes
  status: TestStatus; // Added status
  creationDate?: string; // Added creationDate (optional)
  lastExecutionDate?: string; // Added lastExecutionDate (optional)
  details?: Record<string, any>; // Added details (optional object for extensibility)
  // assignedStationId?: string; // We'll add this when station management is more developed
} 