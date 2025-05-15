import React, { useState } from 'react';
import {
  Title1,
  makeStyles,
  shorthands,
  tokens,
  Text,
  Badge,
  ProgressBar,
  useIsomorphicLayoutEffect,
  Spinner,
  Card,
  CardHeader,
} from '@fluentui/react-components';
import { 
  PersonRegular, 
  BeakerRegular, 
  ChatRegular,
  PresenceAvailableRegular,
} from '@fluentui/react-icons';
import { StationStatus } from '../features/stations/types';
import { TestStatus, Test } from '../features/tests/types';
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
  pageContainer: {
    ...shorthands.margin(0, spacing.m),
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin(0, 0, spacing.l, 0),
  },
  headerStats: {
    display: 'flex',
    gap: spacing.m,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: spacing.s,
    },
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.s,
    ...shorthands.padding(spacing.s),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow4,
    width: '180px',
    '@media (max-width: 768px)': {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  },
  statIcon: {
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground2,
  },
  statValue: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase500,
    marginBottom: spacing.xs,
    textAlign: 'center',
    width: '100%',
  },
  statLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    textAlign: 'center',
    width: '100%',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    textAlign: 'center',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: spacing.l,
  },
  // For mobile view
  stackVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
  },
  stationCardContainer: {
    minHeight: '200px',
  },
  stationCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow4,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  stationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(spacing.xs, spacing.s),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  stationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...shorthands.padding(spacing.m, spacing.s),
    flexGrow: 1,
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    ...shorthands.margin(0, 0, spacing.xs, 0),
  },
  icon: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
  },
  notificationBadge: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...shorthands.margin(spacing.s, 0),
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: tokens.fontSizeBase200,
  },
  progressLabel: {
    color: tokens.colorNeutralForeground2,
  },
  availableIndicator: {
    color: tokens.colorPaletteGreenForeground2,
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  noStations: {
    textAlign: 'center',
    ...shorthands.padding(spacing.xl),
    color: tokens.colorNeutralForeground3,
  },
});

export const DashboardPage: React.FC = () => {
  const styles = useStyles();
  const { stations, tests } = useAppData();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile based on screen width
  useIsomorphicLayoutEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Simulate loading delay (in a real app, we'd be fetching data here)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const calculateOverallStats = () => {
    return {
      totalStations: stations.length,
      totalMembers: stations.reduce((sum, station) => sum + station.member_count, 0),
      activeStations: stations.filter(station => 
        station.status === StationStatus.Active || station.status === StationStatus.Ready
      ).length,
      totalUnreadMessages: stations.reduce((sum, station) => sum + (station.unread_messages || 0), 0),
    };
  };

  const calculateTestProgress = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (!station || !station.tests || station.tests.length === 0) {
      return 0;
    }

    // Count completed tests
    const stationTests = station.tests
      .map(testId => tests.find(t => t.id === testId))
      .filter(test => test !== undefined) as Test[];
    
    const completedTests = stationTests.filter(test => test.status === TestStatus.Completed).length;
    
    return stationTests.length > 0 ? (completedTests / stationTests.length) : 0;
  };

  const renderStationCard = (station: ExtendedStation) => {
    const testProgress = calculateTestProgress(station.id) * 100;
    
    return (
      <div key={station.id} className={styles.stationCardContainer}>
        <Card className={styles.stationCard}>
          <CardHeader 
            className={styles.stationHeader}
            header={
              <Text weight="semibold" size={500}>
                {station.name}
              </Text>
            }
            action={
              station.status === StationStatus.Active ? (
                <Badge appearance="filled" color="success">Active</Badge>
              ) : station.status === StationStatus.Ready ? (
                <Badge appearance="filled" color="informative">Ready</Badge>
              ) : (
                <Badge appearance="filled" color="subtle">Idle</Badge>
              )
            }
          />
          
          <div className={styles.stationContent}>
            <div className={styles.statsRow}>
              <PersonRegular className={styles.icon} />
              <Text>{station.member_count} member{station.member_count !== 1 ? 's' : ''}</Text>
            </div>
            
            <div className={styles.statsRow}>
              <BeakerRegular className={styles.icon} />
              <Text>{station.test_count} test{station.test_count !== 1 ? 's' : ''}</Text>
            </div>
            
            <div className={styles.progressContainer}>
              <Text size={200}>Test Progress</Text>
              <ProgressBar 
                value={testProgress / 100} 
                thickness="medium"
                color={testProgress > 0 ? "brand" : undefined}
              />
              <div className={styles.progressLabels}>
                <Text className={styles.progressLabel}>0%</Text>
                <Text className={styles.progressLabel}>{testProgress.toFixed(0)}%</Text>
                <Text className={styles.progressLabel}>100%</Text>
              </div>
            </div>
            
            {(station.unread_messages ?? 0) > 0 && (
              <div className={styles.statsRow} style={{ marginTop: spacing.s }}>
                <ChatRegular className={styles.icon} />
                <Text>Messages</Text>
                <Badge appearance="filled" className={styles.notificationBadge}>
                  {station.unread_messages}
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className={styles.spinner}>
        <Spinner label="Loading stations..." />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Title1>Dashboard</Title1>
        <div className={styles.headerStats}>
          <Card className={styles.statCard}>
            <PresenceAvailableRegular className={`${styles.statIcon} ${styles.availableIndicator}`} fontSize={24} />
            <div className={styles.statContent}>
              <Text className={styles.statValue}>{stats.activeStations}</Text>
              <Text className={styles.statLabel}>Active Stations</Text>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <PersonRegular className={styles.statIcon} fontSize={24} />
            <div className={styles.statContent}>
              <Text className={styles.statValue}>{stats.totalMembers}</Text>
              <Text className={styles.statLabel}>Members</Text>
            </div>
          </Card>
          <Card className={styles.statCard}>
            <ChatRegular className={styles.statIcon} fontSize={24} />
            <div className={styles.statContent}>
              <Text className={styles.statValue}>{stats.totalUnreadMessages}</Text>
              <Text className={styles.statLabel}>Unread Messages</Text>
            </div>
          </Card>
        </div>
      </div>

      {stations.length > 0 ? (
        <div className={isMobile ? styles.stackVertical : styles.grid}>
          {stations.map(station => renderStationCard(station))}
        </div>
      ) : (
        <div className={styles.noStations}>
          <Text size={500}>No stations available</Text>
          <Text>Create stations to get started with your research workflow.</Text>
        </div>
      )}
    </div>
  );
}; 