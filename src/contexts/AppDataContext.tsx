import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Station, StationStatus } from '../features/stations/types';
import { Test, TestStatus } from '../features/tests/types';

// Initial sample data
const initialStations: Station[] = [
  {
    id: 's1',
    name: 'Station Alpha',
    members: [],
    tests: [],
    member_count: 0,
    test_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 's2',
    name: 'Station Beta',
    members: [],
    tests: [],
    member_count: 0,
    test_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock tests data for demonstration
const initialTests: Test[] = [
  {
    id: 't1',
    name: 'Cognitive Assessment A',
    description: 'Standardized cognitive function test, version A.',
    estimatedDuration: 30,
    status: TestStatus.Pending,
  },
  {
    id: 't2',
    name: 'Motor Skills Test B',
    description: 'Assesses fine and gross motor skills.',
    estimatedDuration: 45,
    status: TestStatus.InProgress,
  },
  {
    id: 't3',
    name: 'User Feedback Survey',
    description: 'Gathers user feedback post-testing.',
    estimatedDuration: 15,
    status: TestStatus.Completed,
  },
];

// Extended station type with UI-specific properties
export interface ExtendedStation extends Station {
  status?: StationStatus;
  unread_messages?: number;
}

// Context interface
interface AppDataContextType {
  stations: ExtendedStation[];
  setStations: React.Dispatch<React.SetStateAction<ExtendedStation[]>>;
  tests: Test[];
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
}

// Create context with default values
const AppDataContext = createContext<AppDataContextType>({
  stations: [],
  setStations: () => {},
  tests: [],
  setTests: () => {},
});

// Provider component
export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with sample data
  const [stations, setStations] = useState<ExtendedStation[]>(
    initialStations.map(station => ({
      ...station,
      status: Math.random() > 0.7 ? StationStatus.Active : 
             Math.random() > 0.5 ? StationStatus.Ready : StationStatus.Idle,
      unread_messages: Math.floor(Math.random() * 5),
    }))
  );
  
  const [tests, setTests] = useState<Test[]>(initialTests);

  return (
    <AppDataContext.Provider value={{ stations, setStations, tests, setTests }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook for easy context usage
export const useAppData = () => useContext(AppDataContext); 