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
import { AddRegular } from '@fluentui/react-icons';
import { Station } from '../features/stations/types';
import { StationCard } from '../features/stations/components/StationCard';
import { StationDialog } from '../features/stations/components/StationDialog';
import { DeleteConfirmationDialog } from '../features/stations/components/DeleteConfirmationDialog';

const useStyles = makeStyles({
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin(0, 0, tokens.spacingVerticalL, 0),
  },
  stationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: tokens.spacingHorizontalL,
  }
});

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
  const [selectedStation, setSelectedStation] = useState<Station | undefined>();
  const [stationToDelete, setStationToDelete] = useState<Station | undefined>();

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

  const handleDialogOpenChange = (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
    setDialogOpen(data.open);
  };

  const handleDeleteDialogOpenChange = (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
    setDeleteDialogOpen(data.open);
  };

  return (
    <div>
      <div className={classes.pageHeader}>
        <Title1>Stations</Title1>
        <Button 
          appearance="primary"
          icon={<AddRegular />}
          onClick={handleAddStation}
        >
          Add Station
        </Button>
      </div>

      <div className={classes.stationsGrid}>
        {stations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onEdit={handleEditStation}
            onDelete={handleDeleteStation}
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
    </div>
  );
}; 