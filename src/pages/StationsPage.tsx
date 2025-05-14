import React, { useState, useEffect } from 'react';
import {
  Title1,
  Button,
  makeStyles,
  shorthands,
  tokens,
  DialogOpenChangeEvent,
  DialogOpenChangeData,
} from '@fluentui/react-components';
import { AddRegular, ArrowSyncRegular } from '@fluentui/react-icons';
import { Station } from '../features/stations/types';
import { StationCard } from '../features/stations/components/StationCard';
import { StationDialog } from '../features/stations/components/StationDialog';
import { DeleteConfirmationDialog } from '../features/stations/components/DeleteConfirmationDialog';
import { TestAssignmentDialog } from '../features/stations/components/TestAssignmentDialog';
import { AutoAdjustDialog } from '../features/stations/components/AutoAdjustDialog';
import { Test, TestStatus } from '../features/tests/types';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin(0, 0, spacing.l, 0),
  },
  headerButtons: {
    display: 'flex',
    gap: spacing.s,
  },
  stationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing.l,
  }
});

// Mock tests data for demonstration
const mockTests: Test[] = [
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

export const StationsPage: React.FC = () => {
  const classes = useStyles();
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testAssignmentDialogOpen, setTestAssignmentDialogOpen] = useState(false);
  const [autoAdjustDialogOpen, setAutoAdjustDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | undefined>();
  const [stationToDelete, setStationToDelete] = useState<Station | undefined>();
  const [tests, setTests] = useState<Test[]>(mockTests);

  const handleAddStation = () => {
    setSelectedStation(undefined);
    setDialogOpen(true);
  };

  const handleEditStation = (station: Station) => {
    setSelectedStation(station);
    setDialogOpen(true);
  };

  const handleDeleteStation = (station: Station) => {
    setStationToDelete(station);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (stationToDelete) {
      setStations(stations.filter(s => s.id !== stationToDelete.id));
      setStationToDelete(undefined);
    }
  };

  const handleDialogSubmit = (stationData: { name: string; terminal_id?: string; pin?: string }) => {
    const timestamp = new Date().toISOString();
    
    if (selectedStation) {
      // Edit existing station
      setStations(stations.map(s => 
        s.id === selectedStation.id
          ? { ...s, ...stationData, updated_at: timestamp }
          : s
      ));
    } else {
      // Add new station
      const newStation: Station = {
        id: `s${Date.now()}`,
        name: stationData.name,
        terminal_id: stationData.terminal_id,
        pin: stationData.pin,
        members: [],
        tests: [],
        member_count: 0,
        test_count: 0,
        created_at: timestamp,
        updated_at: timestamp
      };
      setStations([...stations, newStation]);
    }
    setDialogOpen(false);
  };

  const handleAssignTests = (station: Station) => {
    setSelectedStation(station);
    setTestAssignmentDialogOpen(true);
  };

  const handleTestAssignment = (stationId: string, testIds: string[]) => {
    // Update station with assigned tests
    setStations(prevStations => 
      prevStations.map(station => {
        if (station.id === stationId) {
          return {
            ...station,
            tests: testIds,
            test_count: testIds.length,
            updated_at: new Date().toISOString()
          };
        }
        return station;
      })
    );
  };

  const handleDialogOpenChange = (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
    setDialogOpen(data.open);
  };

  const handleDeleteDialogOpenChange = (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
    setDeleteDialogOpen(data.open);
  };

  const handleTestAssignmentDialogOpenChange = (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
    setTestAssignmentDialogOpen(data.open);
  };

  const handleOpenAutoAdjustDialog = () => {
    setAutoAdjustDialogOpen(true);
  };

  const handleApplySuggestions = (assignments: Record<string, string[]>) => {
    // Update stations with the suggested test assignments
    setStations(prevStations => 
      prevStations.map(station => {
        const assignedTests = assignments[station.id] || [];
        return {
          ...station,
          tests: assignedTests,
          test_count: assignedTests.length,
          updated_at: new Date().toISOString()
        };
      })
    );
  };

  return (
    <div>
      <div className={classes.pageHeader}>
        <Title1>Stations</Title1>
        <div className={classes.headerButtons}>
          <Button
            appearance="subtle"
            icon={<ArrowSyncRegular />}
            onClick={handleOpenAutoAdjustDialog}
          >
            Auto-Adjust Tests
          </Button>
          <Button 
            appearance="primary"
            icon={<AddRegular />}
            onClick={handleAddStation}
          >
            Add Station
          </Button>
        </div>
      </div>

      <div className={classes.stationsGrid}>
        {stations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onEdit={handleEditStation}
            onDelete={handleDeleteStation}
            onAssignTests={handleAssignTests}
            tests={tests}
          />
        ))}
      </div>

      <StationDialog
        open={dialogOpen}
        station={selectedStation}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleDialogSubmit}
      />

      {stationToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          station={stationToDelete}
          onOpenChange={handleDeleteDialogOpenChange}
          onConfirm={handleConfirmDelete}
        />
      )}

      {selectedStation && (
        <TestAssignmentDialog
          open={testAssignmentDialogOpen}
          station={selectedStation}
          allTests={tests}
          onOpenChange={handleTestAssignmentDialogOpenChange}
          onAssignTests={handleTestAssignment}
        />
      )}

      <AutoAdjustDialog
        open={autoAdjustDialogOpen}
        onOpenChange={setAutoAdjustDialogOpen}
        stations={stations}
        tests={tests}
        onApplySuggestions={handleApplySuggestions}
      />
    </div>
  );
}; 