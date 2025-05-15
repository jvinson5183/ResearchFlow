import React, { useState } from 'react';
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
import { useAppData, ExtendedStation } from '../contexts/AppDataContext';

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

export const StationsPage: React.FC = () => {
  const classes = useStyles();
  const { stations, setStations, tests, setTests } = useAppData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testAssignmentDialogOpen, setTestAssignmentDialogOpen] = useState(false);
  const [autoAdjustDialogOpen, setAutoAdjustDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ExtendedStation | undefined>();
  const [stationToDelete, setStationToDelete] = useState<ExtendedStation | undefined>();

  const handleAddStation = () => {
    setSelectedStation(undefined);
    setDialogOpen(true);
  };

  const handleEditStation = (station: ExtendedStation) => {
    setSelectedStation(station);
    setDialogOpen(true);
  };

  const handleDeleteStation = (station: ExtendedStation) => {
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
      const newStation: ExtendedStation = {
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

  const handleAssignTests = (station: ExtendedStation) => {
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