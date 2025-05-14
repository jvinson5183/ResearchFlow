import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
  makeStyles,
  tokens,
  Card,
  Badge,
  Divider,
  Input,
  Field,
  ProgressBar,
} from '@fluentui/react-components';
import {
  ArrowRightRegular,
  TimerRegular,
  ArrowMoveRegular,
  AlertRegular,
} from '@fluentui/react-icons';
import { Station } from '../types';
import { Test } from '../../tests/types';
import { 
  autoAdjustTests, 
  AutoAdjustResult, 
  TestAssignmentSuggestion 
} from '../../../utils/autoAdjustAlgorithm';

// Create consistent spacing using multiples of 8px
const spacing = {
  xs: '8px',
  s: '16px',
  m: '24px',
  l: '32px',
  xl: '40px',
};

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '800px',
    width: '90vw',
    maxHeight: '90vh', // Ensure the dialog doesn't exceed viewport height
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
    overflowY: 'auto',
    maxHeight: 'calc(80vh - 120px)', // Allow content to scroll within the dialog
  },
  summaryCard: {
    padding: spacing.m,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  timeValue: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  improvementBadge: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
    padding: `${spacing.xs} ${spacing.s}`,
    borderRadius: '4px',
    fontSize: tokens.fontSizeBase200,
  },
  warningBadge: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    padding: `${spacing.xs} ${spacing.s}`,
    borderRadius: '4px',
    fontSize: tokens.fontSizeBase200,
  },
  suggestionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.s,
    padding: spacing.m,
    marginBottom: spacing.s,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  suggestionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.s,
  },
  stationInfo: {
    flex: 1,
  },
  stationCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    padding: spacing.s,
    backgroundColor: tokens.colorNeutralBackground2,
    marginBottom: spacing.s,
  },
  stationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationDuration: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    color: tokens.colorNeutralForeground2,
  },
  testList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    maxHeight: '160px',
    overflowY: 'auto',
  },
  testItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  testName: {
    color: tokens.colorNeutralForeground1,
  },
  testDuration: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  beforeAfter: {
    display: 'flex',
    alignItems: 'flex-start', // Align to top instead of center
    gap: spacing.l,
  },
  beforeAfterColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    flex: 1,
  },
  arrows: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.l, // Add padding to align with content
  },
  badge: {
    backgroundColor: tokens.colorNeutralBackground5,
    padding: `${spacing.xs} ${spacing.s}`,
    borderRadius: '4px',
    fontSize: tokens.fontSizeBase200,
  },
  movedTest: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
  maxTimeField: {
    marginBottom: spacing.m,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  exceededMaxTime: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  withinMaxTime: {
    color: tokens.colorPaletteGreenForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  maxTimeLine: {
    position: 'absolute',
    right: '0',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: tokens.colorPaletteRedForeground1,
    pointerEvents: 'none',
  },
  progressBarWrapper: {
    position: 'relative',
  },
  maxTimeMarker: {
    position: 'absolute',
    height: '100%',
    width: '2px',
    backgroundColor: tokens.colorPaletteRedForeground1,
    pointerEvents: 'none',
  },
  maxTimeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    color: tokens.colorPaletteRedForeground1,
  },
  actions: {
    paddingTop: spacing.s,
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.m,
  },
  sectionHeader: {
    marginBottom: spacing.xs,
  },
});

interface AutoAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stations: Station[];
  tests: Test[];
  onApplySuggestions: (assignments: Record<string, string[]>) => void;
}

export const AutoAdjustDialog: React.FC<AutoAdjustDialogProps> = ({
  open,
  onOpenChange,
  stations,
  tests,
  onApplySuggestions,
}) => {
  const styles = useStyles();
  const [maxTime, setMaxTime] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<AutoAdjustResult | null>(null);
  const [maxTimeInput, setMaxTimeInput] = useState('');

  useEffect(() => {
    if (open) {
      // Calculate default max time suggestion (120% of average)
      const totalDuration = tests.reduce((total, test) => total + test.estimatedDuration, 0);
      const avgDuration = stations.length > 0 ? totalDuration / stations.length : 0;
      const suggestedMaxTime = Math.ceil(avgDuration * 1.2);
      
      setMaxTimeInput(suggestedMaxTime.toString());
      setMaxTime(suggestedMaxTime);
      
      // Run auto adjust algorithm
      const adjustResult = autoAdjustTests(stations, tests, suggestedMaxTime);
      setResult(adjustResult);
    }
  }, [open, stations, tests]);

  const handleMaxTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxTimeInput(value);
    
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setMaxTime(parsedValue);
      
      // Recalculate with new max time
      const adjustResult = autoAdjustTests(stations, tests, parsedValue);
      setResult(adjustResult);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplySuggestions(result.suggestedAssignments);
      onOpenChange(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    return `${minutes} min`;
  };

  // Find station name by ID
  const getStationName = (stationId: string): string => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.name : 'Unknown Station';
  };

  // Find test by ID
  const getTest = (testId: string): Test | undefined => {
    return tests.find(t => t.id === testId);
  };

  const renderTestBadge = (testId: string, moved: boolean = false) => {
    const test = getTest(testId);
    if (!test) return null;
    
    return (
      <div 
        key={test.id} 
        className={`${styles.testItem} ${moved ? styles.movedTest : ''}`}
      >
        <Text className={styles.testName}>{test.name}</Text>
        <Text className={styles.testDuration}>{test.estimatedDuration} min</Text>
      </div>
    );
  };

  // Create a map of moved tests for highlighting
  const getMovedTestsMap = (suggestions: TestAssignmentSuggestion[]): Record<string, string> => {
    const movedTests: Record<string, string> = {};
    suggestions.forEach(suggestion => {
      movedTests[suggestion.testId] = suggestion.destinationStationId;
    });
    return movedTests;
  };

  // Check if any stations exceed the max time after optimization
  const hasExceededMaxTime = (result: AutoAdjustResult): boolean => {
    if (!maxTime) return false;
    
    return Object.values(result.stationTimes).some(
      times => times.after > maxTime
    );
  };

  const renderStationCards = () => {
    if (!result) return null;
    
    const movedTestsMap = getMovedTestsMap(result.suggestions);
    
    return stations.map(station => {
      const stationTimes = result.stationTimes[station.id] || { before: 0, after: 0 };
      const originalTests = station.tests || [];
      const suggestedTests = result.suggestedAssignments[station.id] || [];
      
      // Calculate max time for progress bar
      const maxProgressTime = Math.max(
        result.originalMaxTime,
        stationTimes.before,
        stationTimes.after,
        maxTime ? maxTime + 10 : 0 // Add padding to ensure max time line is visible
      );

      // Check if this station exceeds max time
      const exceedsMaxBefore = maxTime && stationTimes.before > maxTime;
      const exceedsMaxAfter = maxTime && stationTimes.after > maxTime;
      
      return (
        <Card key={station.id} className={styles.stationCard}>
          <div className={styles.stationHeader}>
            <Text weight="semibold">{station.name}</Text>
          </div>
          
          <div className={styles.beforeAfter}>
            <div className={styles.beforeAfterColumn}>
              <Text weight="medium">Before</Text>
              <div className={styles.stationDuration}>
                <TimerRegular />
                <Text className={exceedsMaxBefore ? styles.exceededMaxTime : ''}>
                  {formatDuration(stationTimes.before)}
                </Text>
                {exceedsMaxBefore && (
                  <Badge className={styles.warningBadge} appearance="filled">
                    Exceeds Max
                  </Badge>
                )}
              </div>
              
              <div className={styles.progressContainer}>
                <div className={styles.progressBarWrapper}>
                  <ProgressBar
                    value={stationTimes.before / maxProgressTime}
                    color={exceedsMaxBefore ? "error" : "brand"}
                    thickness="medium"
                  />
                  {maxTime && (
                    <div 
                      className={styles.maxTimeMarker} 
                      style={{ left: `${(maxTime / maxProgressTime) * 100}%` }}
                    />
                  )}
                </div>
                <div className={styles.progressLabels}>
                  <Text className={styles.progressLabel}>0</Text>
                  {maxTime && (
                    <Text 
                      className={styles.progressLabel} 
                      style={{ position: 'absolute', left: `${(maxTime / maxProgressTime) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                      Max
                    </Text>
                  )}
                  <Text className={styles.progressLabel}>{formatDuration(maxProgressTime)}</Text>
                </div>
              </div>
              
              <div className={styles.testList}>
                {originalTests.length > 0 ? (
                  originalTests.map(testId => renderTestBadge(testId, false))
                ) : (
                  <Text size={200} color="subtle">No tests assigned</Text>
                )}
              </div>
            </div>
            
            <div className={styles.arrows}>
              <ArrowRightRegular fontSize={24} />
            </div>
            
            <div className={styles.beforeAfterColumn}>
              <Text weight="medium">After</Text>
              <div className={styles.stationDuration}>
                <TimerRegular />
                <Text className={exceedsMaxAfter ? styles.exceededMaxTime : styles.withinMaxTime}>
                  {formatDuration(stationTimes.after)}
                </Text>
                {exceedsMaxAfter ? (
                  <Badge className={styles.warningBadge} appearance="filled">
                    Exceeds Max
                  </Badge>
                ) : (
                  stationTimes.after < stationTimes.before && (
                    <Badge className={styles.improvementBadge} appearance="filled">
                      Improved
                    </Badge>
                  )
                )}
              </div>
              
              <div className={styles.progressContainer}>
                <div className={styles.progressBarWrapper}>
                  <ProgressBar
                    value={stationTimes.after / maxProgressTime}
                    color={exceedsMaxAfter ? "error" : "brand"}
                    thickness="medium"
                  />
                  {maxTime && (
                    <div 
                      className={styles.maxTimeMarker} 
                      style={{ left: `${(maxTime / maxProgressTime) * 100}%` }}
                    />
                  )}
                </div>
                <div className={styles.progressLabels}>
                  <Text className={styles.progressLabel}>0</Text>
                  {maxTime && (
                    <Text 
                      className={styles.progressLabel} 
                      style={{ position: 'absolute', left: `${(maxTime / maxProgressTime) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                      Max
                    </Text>
                  )}
                  <Text className={styles.progressLabel}>{formatDuration(maxProgressTime)}</Text>
                </div>
              </div>
              
              <div className={styles.testList}>
                {suggestedTests.length > 0 ? (
                  suggestedTests.map(testId => {
                    // Check if this test was moved to this station
                    const isMoved = movedTestsMap[testId] === station.id;
                    return renderTestBadge(testId, isMoved);
                  })
                ) : (
                  <Text size={200} color="subtle">No tests assigned</Text>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    });
  };

  const renderSuggestions = () => {
    if (!result || result.suggestions.length === 0) {
      return (
        <Card className={styles.summaryCard}>
          <Text weight="semibold">No changes suggested</Text>
          <Text>The current test distribution is already balanced, or no improvements could be found.</Text>
          {maxTime && result && hasExceededMaxTime(result) && (
            <div className={styles.maxTimeInfo}>
              <AlertRegular />
              <Text>Some stations still exceed the maximum time. Consider increasing the maximum time or reducing the number of tests.</Text>
            </div>
          )}
        </Card>
      );
    }
    
    return (
      <>
        <Text weight="semibold" size={400} className={styles.sectionHeader}>
          Suggested Moves ({result.suggestions.length})
        </Text>
        
        {maxTime && result && hasExceededMaxTime(result) && (
          <div className={styles.maxTimeInfo}>
            <AlertRegular />
            <Text>Some stations still exceed the maximum time. The algorithm tried to distribute tests optimally but couldn't meet the max time constraint for all stations.</Text>
          </div>
        )}
        
        {result.suggestions.map((suggestion, index) => (
          <Card key={index} className={styles.suggestionCard}>
            <div className={styles.suggestionContent}>
              <div className={styles.stationInfo}>
                <Text weight="semibold">{getStationName(suggestion.sourceStationId)}</Text>
                <Text>{formatDuration(suggestion.sourceBefore)} → {formatDuration(suggestion.sourceAfter)}</Text>
              </div>
              
              <ArrowRightRegular fontSize={24} />
              
              <div className={styles.stationInfo}>
                <Text weight="semibold">{getStationName(suggestion.destinationStationId)}</Text>
                <Text>{formatDuration(suggestion.destBefore)} → {formatDuration(suggestion.destAfter)}</Text>
              </div>
              
              <ArrowMoveRegular fontSize={20} />
              
              <div className={styles.stationInfo}>
                <Text weight="semibold">{suggestion.testName}</Text>
                <Text>{formatDuration(getTest(suggestion.testId)?.estimatedDuration || 0)}</Text>
              </div>
            </div>
          </Card>
        ))}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(e, data) => onOpenChange(data.open)}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogTitle>Auto-Adjust Test Distribution</DialogTitle>
        <DialogContent className={styles.content}>
          {result ? (
            <div className={styles.sectionsContainer}>
              <Field
                label="Maximum Time per Station (minutes)"
                className={styles.maxTimeField}
                hint="Enter the maximum desired time for any station"
              >
                <Input
                  type="number"
                  value={maxTimeInput}
                  onChange={handleMaxTimeChange}
                  min={1}
                  placeholder="Enter max time in minutes"
                />
              </Field>
              
              <Card className={styles.summaryCard}>
                <Text weight="semibold" size={400}>Summary</Text>
                
                <div className={styles.summaryRow}>
                  <Text>Total Test Duration:</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text>{formatDuration(result.originalTotalTime)}</Text>
                  </div>
                </div>
                
                <div className={styles.summaryRow}>
                  <Text>Before: Max Station Time</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text 
                      className={maxTime && result.originalMaxTime > maxTime ? styles.exceededMaxTime : ''}
                    >
                      {formatDuration(result.originalMaxTime)}
                    </Text>
                    {maxTime && result.originalMaxTime > maxTime && (
                      <Badge className={styles.warningBadge} appearance="filled">
                        +{formatDuration(result.originalMaxTime - maxTime)} over max
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className={styles.summaryRow}>
                  <Text>After: Max Station Time</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text 
                      className={maxTime && result.adjustedMaxTime > maxTime 
                        ? styles.exceededMaxTime 
                        : styles.withinMaxTime
                      }
                    >
                      {formatDuration(result.adjustedMaxTime)}
                    </Text>
                    {result.adjustedMaxTime < result.originalMaxTime && (
                      <Badge className={styles.improvementBadge} appearance="filled">
                        -{formatDuration(result.originalMaxTime - result.adjustedMaxTime)}
                      </Badge>
                    )}
                    {maxTime && result.adjustedMaxTime > maxTime && (
                      <Badge className={styles.warningBadge} appearance="filled">
                        +{formatDuration(result.adjustedMaxTime - maxTime)} over max
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className={styles.summaryRow}>
                  <Text>Max Time Setting:</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text className={styles.withinMaxTime}>
                      {formatDuration(maxTime || 0)}
                    </Text>
                  </div>
                </div>
                
                <div className={styles.summaryRow}>
                  <Text>Before: Min Station Time</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text>{formatDuration(result.originalMinTime)}</Text>
                  </div>
                </div>
                
                <div className={styles.summaryRow}>
                  <Text>After: Min Station Time</Text>
                  <div className={styles.timeValue}>
                    <TimerRegular />
                    <Text>{formatDuration(result.adjustedMinTime)}</Text>
                    {result.adjustedMinTime > result.originalMinTime && (
                      <Badge className={styles.improvementBadge} appearance="filled">
                        +{formatDuration(result.adjustedMinTime - result.originalMinTime)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
              
              <Divider />
              
              {renderSuggestions()}
              
              <Divider />
              
              <Text weight="semibold" size={400} className={styles.sectionHeader}>
                Station Details
              </Text>
              {renderStationCards()}
            </div>
          ) : (
            <Text>Calculating optimized test distribution...</Text>
          )}
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button appearance="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            appearance="primary" 
            onClick={handleApply} 
            disabled={result ? result.suggestions.length === 0 : true}
          >
            Apply Suggestions
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}; 