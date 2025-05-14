import { Station } from '../features/stations/types';
import { Test } from '../features/tests/types';

/**
 * Represents a test assignment suggestion
 */
export interface TestAssignmentSuggestion {
  sourceStationId: string;
  destinationStationId: string;
  testId: string;
  testName: string;
  sourceBefore: number; // Source station time before (minutes)
  sourceAfter: number;  // Source station time after (minutes)
  destBefore: number;   // Destination station time before (minutes)
  destAfter: number;    // Destination station time after (minutes)
}

/**
 * Represents the result of the auto-adjust algorithm
 */
export interface AutoAdjustResult {
  originalTotalTime: number;   // Total test duration (minutes)
  originalMaxTime: number;     // Maximum station time before (minutes)
  originalMinTime: number;     // Minimum station time before (minutes)
  adjustedMaxTime: number;     // Maximum station time after (minutes)
  adjustedMinTime: number;     // Minimum station time after (minutes)
  stationTimes: Record<string, { before: number, after: number }>; // Time per station before/after
  suggestions: TestAssignmentSuggestion[]; // Suggested test movements
  suggestedAssignments: Record<string, string[]>; // Suggested station->tests assignments
}

/**
 * Calculate the current test duration for each station
 */
function calculateStationDurations(
  stations: Station[],
  tests: Test[]
): Record<string, number> {
  const stationDurations: Record<string, number> = {};
  
  stations.forEach(station => {
    const stationTestIds = station.tests || [];
    const totalDuration = stationTestIds.reduce((total, testId) => {
      const test = tests.find(t => t.id === testId);
      return total + (test?.estimatedDuration || 0);
    }, 0);
    
    stationDurations[station.id] = totalDuration;
  });
  
  return stationDurations;
}

/**
 * Get the station with the maximum and minimum test durations
 */
function getMaxMinStations(stationDurations: Record<string, number>): {
  maxStationId: string;
  maxDuration: number;
  minStationId: string;
  minDuration: number;
} {
  const stationIds = Object.keys(stationDurations);
  
  if (stationIds.length === 0) {
    return {
      maxStationId: '',
      maxDuration: 0,
      minStationId: '',
      minDuration: 0
    };
  }
  
  let maxStationId = stationIds[0];
  let maxDuration = stationDurations[maxStationId];
  let minStationId = stationIds[0];
  let minDuration = stationDurations[minStationId];
  
  stationIds.forEach(stationId => {
    const duration = stationDurations[stationId];
    
    if (duration > maxDuration) {
      maxDuration = duration;
      maxStationId = stationId;
    }
    
    if (duration < minDuration) {
      minDuration = duration;
      minStationId = stationId;
    }
  });
  
  return {
    maxStationId,
    maxDuration,
    minStationId,
    minDuration
  };
}

/**
 * Find stations that exceed the max time constraint
 */
function getStationsAboveMaxTime(
  stationDurations: Record<string, number>,
  maxTime: number
): string[] {
  return Object.entries(stationDurations)
    .filter(([_, duration]) => duration > maxTime)
    .map(([stationId, _]) => stationId);
}

/**
 * Find a suitable test to move from a station that exceeds max time
 * to any station that won't exceed max time after the move
 */
function findTestToReduceMaxTime(
  sourceStationId: string, 
  sourceDuration: number,
  maxTime: number,
  stationDurations: Record<string, number>,
  stations: Station[],
  tests: Test[]
): TestAssignmentSuggestion | null {
  const sourceStation = stations.find(s => s.id === sourceStationId);
  if (!sourceStation || !sourceStation.tests || sourceStation.tests.length === 0) {
    return null;
  }

  // Sort tests in the source station by duration (ascending)
  const sourceStationTests = sourceStation.tests
    .map(testId => tests.find(t => t.id === testId))
    .filter(test => test !== undefined) as Test[];
  
  sourceStationTests.sort((a, b) => a.estimatedDuration - b.estimatedDuration);
  
  // Find stations that could accept a test without exceeding maxTime
  const potentialDestinations = Object.entries(stationDurations)
    .filter(([stationId, duration]) => stationId !== sourceStationId)
    .sort((a, b) => a[1] - b[1]); // Sort by duration (ascending)
  
  // Try to find a test that, when moved, would make source station ≤ maxTime
  for (const test of sourceStationTests) {
    const testDuration = test.estimatedDuration;
    const newSourceDuration = sourceDuration - testDuration;
    
    // Skip if removing this test still doesn't bring source below maxTime
    if (newSourceDuration > maxTime) continue;
    
    // Find a destination that won't exceed maxTime after adding this test
    for (const [destStationId, destDuration] of potentialDestinations) {
      const newDestDuration = destDuration + testDuration;
      
      // Skip if adding this test would cause destination to exceed maxTime
      if (newDestDuration > maxTime) continue;
      
      return {
        sourceStationId,
        destinationStationId: destStationId,
        testId: test.id,
        testName: test.name,
        sourceBefore: sourceDuration,
        sourceAfter: newSourceDuration,
        destBefore: destDuration,
        destAfter: newDestDuration
      };
    }
  }
  
  return null;
}

/**
 * Find a suitable test to move from the max duration station to the min duration station
 * that would improve balance without causing the min station to become the new max station
 */
function findOptimalTestMove(
  maxStationId: string,
  maxDuration: number,
  minStationId: string,
  minDuration: number,
  stations: Station[],
  tests: Test[]
): TestAssignmentSuggestion | null {
  const maxStation = stations.find(s => s.id === maxStationId);
  if (!maxStation || !maxStation.tests || maxStation.tests.length === 0) {
    return null;
  }
  
  // Sort tests in the max station by duration (ascending)
  const maxStationTests = maxStation.tests
    .map(testId => tests.find(t => t.id === testId))
    .filter(test => test !== undefined) as Test[];
  
  maxStationTests.sort((a, b) => a.estimatedDuration - b.estimatedDuration);
  
  // Try to find a test that, when moved, would improve balance
  for (const test of maxStationTests) {
    const testDuration = test.estimatedDuration;
    const newMaxDuration = maxDuration - testDuration;
    const newMinDuration = minDuration + testDuration;
    
    // Check if moving this test improves balance
    // 1. The new max duration should be less than the current max duration
    // 2. The new min duration should not exceed the new max duration
    if (newMaxDuration >= newMinDuration) {
      return {
        sourceStationId: maxStationId,
        destinationStationId: minStationId,
        testId: test.id,
        testName: test.name,
        sourceBefore: maxDuration,
        sourceAfter: newMaxDuration,
        destBefore: minDuration,
        destAfter: newMinDuration
      };
    }
  }
  
  return null;
}

/**
 * Auto-adjust test assignments to balance duration across stations
 * @param stations Current stations with their test assignments
 * @param tests All available tests
 * @param maxTime Maximum desired time per station (optional)
 * @param maxIterations Maximum number of assignment iterations (default: 10)
 * @returns Auto-adjust result with suggested test assignments
 */
export function autoAdjustTests(
  stations: Station[],
  tests: Test[],
  maxTime?: number,
  maxIterations = 10
): AutoAdjustResult {
  // Handle edge cases
  if (stations.length <= 1 || tests.length === 0) {
    return {
      originalTotalTime: tests.reduce((total, test) => total + test.estimatedDuration, 0),
      originalMaxTime: 0,
      originalMinTime: 0,
      adjustedMaxTime: 0,
      adjustedMinTime: 0,
      stationTimes: {},
      suggestions: [],
      suggestedAssignments: stations.reduce((acc, station) => {
        acc[station.id] = station.tests || [];
        return acc;
      }, {} as Record<string, string[]>)
    };
  }
  
  // Calculate initial station durations
  const originalDurations = calculateStationDurations(stations, tests);
  const { maxDuration: originalMaxTime, minDuration: originalMinTime } = getMaxMinStations(originalDurations);
  const originalTotalTime = tests.reduce((total, test) => total + test.estimatedDuration, 0);
  
  // Create a working copy of the assignments
  const currentAssignments: Record<string, string[]> = {};
  stations.forEach(station => {
    currentAssignments[station.id] = [...(station.tests || [])];
  });
  
  // Track the suggestions
  const suggestions: TestAssignmentSuggestion[] = [];
  
  // Iteratively find and apply test moves to improve balance
  let currentDurations = { ...originalDurations };
  let iteration = 0;
  
  // PHASE 1: If maxTime is specified, first try to ensure all stations are below maxTime
  if (maxTime !== undefined) {
    while (iteration < maxIterations) {
      // Check if any station exceeds the max time
      const stationsAboveMaxTime = getStationsAboveMaxTime(currentDurations, maxTime);
      
      // If no stations exceed maxTime, stop this phase
      if (stationsAboveMaxTime.length === 0) {
        break;
      }
      
      let moveMade = false;
      
      // For each station above maxTime, try to find a test to move
      for (const stationId of stationsAboveMaxTime) {
        const suggestion = findTestToReduceMaxTime(
          stationId,
          currentDurations[stationId],
          maxTime,
          currentDurations,
          stations.map(station => ({
            ...station,
            tests: currentAssignments[station.id]
          })),
          tests
        );
        
        // If a suitable move is found, apply it
        if (suggestion) {
          suggestions.push(suggestion);
          
          // Update assignments
          const testId = suggestion.testId;
          const sourceTests = currentAssignments[suggestion.sourceStationId];
          const destTests = currentAssignments[suggestion.destinationStationId];
          
          // Remove from source
          currentAssignments[suggestion.sourceStationId] = sourceTests.filter(id => id !== testId);
          
          // Add to destination
          currentAssignments[suggestion.destinationStationId] = [...destTests, testId];
          
          // Update durations
          currentDurations[suggestion.sourceStationId] = suggestion.sourceAfter;
          currentDurations[suggestion.destinationStationId] = suggestion.destAfter;
          
          moveMade = true;
          iteration++;
          break;
        }
      }
      
      // If no moves were possible to reduce max time, stop
      if (!moveMade) {
        break;
      }
    }
  }
  
  // PHASE 2: Balance durations across stations
  while (iteration < maxIterations) {
    // Find max and min stations
    const { 
      maxStationId, 
      maxDuration, 
      minStationId, 
      minDuration 
    } = getMaxMinStations(currentDurations);
    
    // If all stations have the same duration or difference is minimal, stop
    if (maxDuration - minDuration <= 5 || minStationId === maxStationId) {
      break;
    }
    
    // Find the optimal test to move
    const suggestion = findOptimalTestMove(
      maxStationId,
      maxDuration,
      minStationId,
      minDuration,
      stations.map(station => ({
        ...station,
        tests: currentAssignments[station.id]
      })),
      tests
    );
    
    // If no suitable move is found, stop
    if (!suggestion) {
      break;
    }
    
    // If we have a max time, ensure this move doesn't violate it
    if (maxTime && suggestion.destAfter > maxTime) {
      break;
    }
    
    // Apply the suggestion
    suggestions.push(suggestion);
    
    // Update assignments
    const testId = suggestion.testId;
    const sourceTests = currentAssignments[suggestion.sourceStationId];
    const destTests = currentAssignments[suggestion.destinationStationId];
    
    // Remove from source
    currentAssignments[suggestion.sourceStationId] = sourceTests.filter(id => id !== testId);
    
    // Add to destination
    currentAssignments[suggestion.destinationStationId] = [...destTests, testId];
    
    // Update durations
    currentDurations[suggestion.sourceStationId] = suggestion.sourceAfter;
    currentDurations[suggestion.destinationStationId] = suggestion.destAfter;
    
    iteration++;
  }
  
  // Calculate final durations
  const finalDurations = calculateStationDurations(
    stations.map(station => ({
      ...station,
      tests: currentAssignments[station.id]
    })),
    tests
  );
  
  const { maxDuration: adjustedMaxTime, minDuration: adjustedMinTime } = getMaxMinStations(finalDurations);
  
  // Create result object
  const stationTimes: Record<string, { before: number, after: number }> = {};
  Object.keys(originalDurations).forEach(stationId => {
    stationTimes[stationId] = {
      before: originalDurations[stationId],
      after: finalDurations[stationId]
    };
  });
  
  return {
    originalTotalTime,
    originalMaxTime,
    originalMinTime,
    adjustedMaxTime,
    adjustedMinTime,
    stationTimes,
    suggestions,
    suggestedAssignments: currentAssignments
  };
} 