import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';import { Station, StationStatus } from '../features/stations/types';import { Test, TestStatus } from '../features/tests/types';import { EventConfiguration } from '../features/events/types';import { Member } from '../features/members/types';import { ChatMessage } from '../features/chat/types';

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

const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'John Doe',
    role: 'Researcher',
    email: 'john.doe@example.com',
  },
  {
    id: 'm2',
    name: 'Jane Smith',
    role: 'Technician',
    email: 'jane.smith@example.com',
  }
];

// Initial event configuration
const initialEventConfig: EventConfiguration = {
  event_name: 'Research Session 1',
  max_time: 120, // 2 hours in minutes
  stations: initialStations,
  members: initialMembers,
  tests: initialTests,
  chat: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Local storage keys
const EVENT_STORAGE_KEY = 'researchflow-event';

// Extended station type with UI-specific properties
export interface ExtendedStation extends Station {
  status?: StationStatus;
  unread_messages?: number;
}

// Context interface
interface AppDataContextType {
  // Existing data
  stations: ExtendedStation[];
  setStations: React.Dispatch<React.SetStateAction<ExtendedStation[]>>;
  tests: Test[];
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  
  // Event configuration
  currentEvent: EventConfiguration;
  setCurrentEvent: React.Dispatch<React.SetStateAction<EventConfiguration>>;
  
  // Event operations
  saveEventToLocalStorage: () => void;
  loadEventFromLocalStorage: () => boolean;
  exportEventAsJSON: () => void;
  importEventFromJSON: (jsonData: string) => boolean;
  createNewEvent: (name: string, maxTime: number) => void;

  // Member management operations
  addMember: (member: Omit<Member, 'id'>) => Member;
  updateMember: (id: string, updates: Partial<Omit<Member, 'id'>>) => boolean;
  deleteMember: (id: string) => boolean;
  assignMemberToStation: (memberId: string, stationId: string) => boolean;
  unassignMemberFromStation: (memberId: string) => boolean;
  getMembersForStation: (stationId: string) => Member[];
  
  // Chat operations
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => ChatMessage;
  deleteMessage: (messageId: string) => boolean;
  getMessagesForStation: (stationId: string) => ChatMessage[];
  markMessageAsRead: (messageId: string) => boolean;
  getBroadcastMessages: () => ChatMessage[];
}

// Create context with default values
const AppDataContext = createContext<AppDataContextType>({
  stations: [],
  setStations: () => {},
  tests: [],
  setTests: () => {},
  members: [],
  setMembers: () => {},
  currentEvent: initialEventConfig,
  setCurrentEvent: () => {},
  saveEventToLocalStorage: () => {},
  loadEventFromLocalStorage: () => false,
  exportEventAsJSON: () => {},
  importEventFromJSON: () => false,
  createNewEvent: () => {},
  addMember: () => ({ id: '', name: '', role: '', email: '' }),
  updateMember: () => false,
  deleteMember: () => false,
  assignMemberToStation: () => false,
  unassignMemberFromStation: () => false,
  getMembersForStation: () => [],
  sendMessage: () => ({ id: '', sender_station_id: '', recipient_station_id: null, message: '', timestamp: '', read: false, thread_id: '' }),
  deleteMessage: () => false,
  getMessagesForStation: () => [],
  markMessageAsRead: () => false,
  getBroadcastMessages: () => [],
});

// Provider component
export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // MAIN STATE VARIABLES
  const [currentEvent, setCurrentEvent] = useState<EventConfiguration>(() => {
    try {
      console.log('Loading initial data from localStorage...');
      const savedEvent = localStorage.getItem(EVENT_STORAGE_KEY);
      
      if (savedEvent) {
        const parsedEvent = JSON.parse(savedEvent) as EventConfiguration;
        
        // Quick validation of the loaded data
        if (parsedEvent && parsedEvent.event_name) {
          console.log('Successfully loaded event from localStorage:', parsedEvent.event_name);
          
          // Ensure stations have the required UI-specific properties
          const validatedStations = (parsedEvent.stations || []).map(s => ({
            ...s,
            id: s.id || `s${Date.now()}`,
            name: s.name || 'Unnamed Station',
            members: s.members || [],
            tests: s.tests || [],
            status: (s as ExtendedStation).status || StationStatus.Idle,
            unread_messages: (s as ExtendedStation).unread_messages || 0,
          }));
          
          return {
            ...parsedEvent,
            stations: validatedStations,
            members: parsedEvent.members || [],
            tests: parsedEvent.tests || [],
            chat: parsedEvent.chat || [],
          };
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    console.log('Using initial default data');
    return initialEventConfig; // Fallback to initial data if loading fails
  });

  // Derived states - These are convenience states for components, kept in sync with currentEvent
  const [stations, setStations] = useState<ExtendedStation[]>(
    (currentEvent.stations || initialStations).map(s => ({
      ...s,
      status: (s as ExtendedStation).status || StationStatus.Idle, // Ensure status is present
      unread_messages: (s as ExtendedStation).unread_messages || 0, // Ensure unread_messages is present
    }))
  );
  const [members, setMembers] = useState<Member[]>(currentEvent.members || initialMembers);
  const [tests, setTests] = useState<Test[]>(currentEvent.tests || initialTests);

  // --- HELPER FUNCTIONS (must be defined before CRUD operations that use them) ---
  const getMembersForStation = useCallback((stationId: string): Member[] => {
    const station = (currentEvent.stations || []).find(s => s.id === stationId);
    if (!station || !station.members) return [];
    return (station.members || []).map(memberIdOrObject => {
      const memberId = typeof memberIdOrObject === 'string' ? memberIdOrObject : memberIdOrObject.id;
      const fullMember = (currentEvent.members || []).find(m => m.id === memberId);
      return fullMember || { id: 'unknown', name: 'Unknown Member', role: '', email: '' };
    });
  }, [currentEvent.stations, currentEvent.members]); // Depends only on currentEvent substructure

  const unassignMemberFromStation = useCallback((memberId: string, passedEvent?: EventConfiguration ): boolean => {
    // This function will be called by deleteMember and assignMemberToStation.
    // It needs to update the event that is passed to it or the currentEvent state.
    const eventToUpdate = passedEvent || currentEvent; 
    const memberToUnassign = (eventToUpdate.members || []).find(m => m.id === memberId);

    if (!memberToUnassign || !memberToUnassign.assignedStationId) return false;
    const oldStationId = memberToUnassign.assignedStationId;

    const updatedMembers = (eventToUpdate.members || []).map(m =>
      m.id === memberId ? { ...m, assignedStationId: undefined } : m
    );
    const updatedStations = (eventToUpdate.stations || []).map(s =>
      s.id === oldStationId
        ? { ...s, members: (s.members || []).filter(m => (typeof m === 'string' ? m !== memberId : m.id !== memberId)), member_count: Math.max(0, (s.member_count || 0) - 1) }
        : s
    );
    
    setCurrentEvent(prev => ({ ...prev, members: updatedMembers, stations: updatedStations }));
    return true;
  }, [currentEvent, setCurrentEvent]); // setCurrentEvent is stable, currentEvent is the dependency

  // EFFECT TO SYNC DERIVED STATES FROM CURRENTEVENT
  useEffect(() => {
    console.log('currentEvent changed, syncing derived states:', currentEvent);
    
    // Ensure stations have the required UI properties
    const enhancedStations = (currentEvent.stations || []).map(s => ({
      ...s,
      status: (s as ExtendedStation).status || StationStatus.Idle,
      unread_messages: (s as ExtendedStation).unread_messages || 0,
    }));
    
    setStations(enhancedStations);
    setMembers(currentEvent.members || []);
    setTests(currentEvent.tests || []);
    
    // DEBUG: Check if stations data is properly structured
    console.log('After sync - Stations:', enhancedStations);
    console.log('After sync - Members:', currentEvent.members);
  }, [currentEvent]);

  // --- CRUD OPERATIONS (now primarily update currentEvent) ---
  const addMember = useCallback((memberData: Omit<Member, 'id'>): Member => {
    const newMember: Member = { ...memberData, id: `m${Date.now()}` };
    setCurrentEvent(prevEvent => ({
      ...prevEvent,
      members: [...(prevEvent.members || []), newMember],
    }));
    return newMember;
  }, [setCurrentEvent]);

  const updateMember = useCallback((id: string, updates: Partial<Omit<Member, 'id'>>): boolean => {
    let memberExists = false;
    setCurrentEvent(prevEvent => {
      const updatedMembers = (prevEvent.members || []).map(m => {
        if (m.id === id) {
          memberExists = true;
          return { ...m, ...updates };
        }
        return m;
      });
      // Also update the member if they are part of any station's member list (if stations store member objects/details)
      // For now, our stations.members are IDs, so this is mainly about the top-level members array in currentEvent.
      if (!memberExists) return prevEvent;
      return { ...prevEvent, members: updatedMembers };
    });
    return memberExists;
  }, [setCurrentEvent, getMembersForStation]); // getMembersForStation might be needed if station.members need update based on role etc.

  const deleteMember = useCallback((id: string): boolean => {
    let wasDeleted = false;
    const memberToDelete = (currentEvent.members || []).find(m => m.id === id);

    if (memberToDelete && memberToDelete.assignedStationId) {
      // unassignMemberFromStation will call setCurrentEvent internally
      unassignMemberFromStation(id);
    }
    
    // Then, remove the member from the main members list in currentEvent
    // The unassignMemberFromStation might have already updated currentEvent.
    // We need to ensure we operate on the latest version of currentEvent members after unassignment.
    setCurrentEvent(prevEvent => {
      const membersAfterUnassign = prevEvent.members; // Members list potentially updated by unassignMemberFromStation
      const initialLength = (membersAfterUnassign || []).length;
      const updatedMembers = (membersAfterUnassign || []).filter(m => m.id !== id);
      wasDeleted = updatedMembers.length < initialLength;
      if (!wasDeleted) return prevEvent; // If not found (already deleted?), no change
      return { ...prevEvent, members: updatedMembers };
    });
    return wasDeleted;
  }, [currentEvent.members, setCurrentEvent, unassignMemberFromStation]);

  const assignMemberToStation = useCallback((memberId: string, stationId: string): boolean => {
    const memberToAssign = (currentEvent.members || []).find(m => m.id === memberId);
    const targetStationExists = (currentEvent.stations || []).some(s => s.id === stationId);

    if (!memberToAssign || !targetStationExists) return false;

    // If member is already assigned to a different station, unassign them first.
    // unassignMemberFromStation will call setCurrentEvent, so subsequent operations in this
    // function need to be nested within setCurrentEvent's updater function or manage state carefully.
    
    // To avoid complex chained setCurrentEvent, let's build the final event state in one go.
    setCurrentEvent(prevEvent => {
      let eventAfterUnassign = { ...prevEvent };

      // 1. Unassign from old station if necessary
      if (memberToAssign.assignedStationId && memberToAssign.assignedStationId !== stationId) {
        const oldStationId = memberToAssign.assignedStationId;
        eventAfterUnassign = {
          ...eventAfterUnassign,
          members: eventAfterUnassign.members.map(m => m.id === memberId ? { ...m, assignedStationId: undefined } : m),
          stations: eventAfterUnassign.stations.map(s =>
            s.id === oldStationId
              ? { ...s, members: (s.members || []).filter(mID => mID !== memberId), member_count: Math.max(0, (s.member_count || 0) - 1) }
              : s
          ),
        };
      }

      // 2. Assign to new station
      const finalMembers = eventAfterUnassign.members.map(m =>
        m.id === memberId ? { ...m, assignedStationId: stationId } : m
      );
      const finalStations = eventAfterUnassign.stations.map(s => {
        if (s.id === stationId) {
          const memberExistsInStation = (s.members || []).some(mID => mID === memberId);
          if (!memberExistsInStation) {
            return {
              ...s,
              members: [...(s.members || []), memberId], // Assuming station.members stores member IDs
              member_count: (s.member_count || 0) + 1,
            };
          }
        }
        return s;
      });

      return { ...eventAfterUnassign, members: finalMembers, stations: finalStations };
    });

    return true;
  }, [currentEvent.members, currentEvent.stations, setCurrentEvent]);

  // Save current event to localStorage with thorough debugging and validation
  const saveEventToLocalStorage = useCallback(() => {
    try {
      console.log('Saving currentEvent state to localStorage:', currentEvent);
      
      // Deep clone to avoid reference issues
      const clonedEvent = JSON.parse(JSON.stringify(currentEvent));
      
      // Ensure all required properties exist
      if (!clonedEvent.event_name) {
        console.error('WARNING: event_name is missing in the event being saved!');
        clonedEvent.event_name = 'Unnamed Research Session';
      }
      
      if (!clonedEvent.stations || !Array.isArray(clonedEvent.stations)) {
        console.error('WARNING: stations array is missing or invalid in the event being saved!');
        clonedEvent.stations = [];
      }
      
      // Ensure each station has the UI-specific properties
      const validatedStations = clonedEvent.stations.map((s: Station) => ({
        ...s,
        id: s.id || `s${Date.now()}`, // Ensure ID exists
        name: s.name || 'Unnamed Station',
        members: s.members || [],
        tests: s.tests || [],
        member_count: (s.member_count !== undefined) ? s.member_count : 0,
        test_count: (s.test_count !== undefined) ? s.test_count : 0,
        status: (s as ExtendedStation).status || StationStatus.Idle,
        unread_messages: (s as ExtendedStation).unread_messages || 0,
        created_at: s.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Ensure members array exists
      if (!clonedEvent.members || !Array.isArray(clonedEvent.members)) {
        console.error('WARNING: members array is missing or invalid in the event being saved!');
        clonedEvent.members = [];
      }
      
      // Create the final event object with all validated data
      const eventToSave = {
        ...clonedEvent,
        stations: validatedStations,
        updated_at: new Date().toISOString(),
      };
      
      // Stringify with indentation for debugging if needed
      const jsonString = JSON.stringify(eventToSave);
      
      // Store in localStorage
      localStorage.setItem(EVENT_STORAGE_KEY, jsonString);
      console.log('Successfully saved to localStorage - object size:', jsonString.length, 'bytes');
      console.log('Saved event structure:', {
        event_name: eventToSave.event_name,
        stations_count: eventToSave.stations.length,
        members_count: eventToSave.members.length,
        tests_count: eventToSave.tests.length
      });
      
      // Update the currentEvent state to ensure consistency
      setCurrentEvent(eventToSave);
      
      // Also directly update the derived states for immediate UI refresh
      setStations(validatedStations);
      setMembers(eventToSave.members || []);
      setTests(eventToSave.tests || []);
      
      return true;
    } catch (e) {
      console.error('Critical error saving event to localStorage:', e);
      return false;
    }
  }, [currentEvent, setCurrentEvent, setStations, setMembers, setTests]);

  // Load event from localStorage with improved error handling and validation
  const loadEventFromLocalStorage = useCallback(() => {
    try {
      console.log('Attempting to load event from localStorage...');
      const savedEventJson = localStorage.getItem(EVENT_STORAGE_KEY);
      
      if (!savedEventJson) {
        console.log('No saved event found in localStorage');
        return false;
      }
      
      console.log('Found data in localStorage, size:', savedEventJson.length, 'bytes');
      
      // Parse the JSON string
      const parsedEvent = JSON.parse(savedEventJson) as EventConfiguration;
      
      // Basic validation
      if (!parsedEvent.event_name) {
        console.error('Invalid event data: missing event_name');
        return false;
      }
      
      console.log('Loaded event structure:', {
        event_name: parsedEvent.event_name,
        stations_count: (parsedEvent.stations || []).length,
        members_count: (parsedEvent.members || []).length,
        tests_count: (parsedEvent.tests || []).length
      });
      
      // Ensure stations have all required properties
      const validatedStations = (parsedEvent.stations || []).map((s: Station) => ({
        ...s,
        id: s.id || `s${Date.now()}`,
        name: s.name || 'Unnamed Station',
        members: s.members || [],
        tests: s.tests || [],
        member_count: (s.member_count !== undefined) ? s.member_count : 0,
        test_count: (s.test_count !== undefined) ? s.test_count : 0,
        status: (s as ExtendedStation).status || StationStatus.Idle,
        unread_messages: (s as ExtendedStation).unread_messages || 0,
        created_at: s.created_at || new Date().toISOString(),
        updated_at: s.updated_at || new Date().toISOString()
      }));
      
      // Create the validated event object
      const validatedEvent = {
        ...parsedEvent,
        stations: validatedStations,
        members: parsedEvent.members || [],
        tests: parsedEvent.tests || [],
        chat: parsedEvent.chat || [],
      };
      
      console.log('Validated event to be loaded:', validatedEvent);
      
      // Update the state directly
      setCurrentEvent(validatedEvent);
      
      // Also directly update the derived states for immediate UI refresh
      setStations(validatedStations);
      setMembers(validatedEvent.members);
      setTests(validatedEvent.tests);
      
      console.log('Event successfully loaded from localStorage');
      return true;
    } catch (e) {
      console.error('Error loading event from localStorage:', e);
      return false;
    }
  }, [setCurrentEvent, setStations, setMembers, setTests]);

  // Export event as JSON file for download
  const exportEventAsJSON = useCallback(() => {
    try {
      // Create a blob with the event data
      const eventData = JSON.stringify(currentEvent, null, 2);
      const blob = new Blob([eventData], { type: 'application/json' });
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentEvent.event_name.replace(/\s+/g, '-').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error exporting event:', e);
    }
  }, [currentEvent]);

  // Import event from JSON file with improved validation and data structure handling
  const importEventFromJSON = useCallback((jsonData: string) => {
    try {
      console.log('Attempting to import event from JSON data...');
      
      // Parse the JSON string
      const parsedEvent = JSON.parse(jsonData) as EventConfiguration;
      
      // Validate required fields
      if (!parsedEvent.event_name) {
        console.error('Invalid event data: missing event_name');
        return false;
      }
      
      console.log('Imported JSON structure:', {
        event_name: parsedEvent.event_name,
        stations_count: (parsedEvent.stations || []).length,
        members_count: (parsedEvent.members || []).length,
        tests_count: (parsedEvent.tests || []).length
      });
      
      // Ensure stations have all required properties
      const validatedStations = (parsedEvent.stations || []).map((s: Station) => ({
        ...s,
        id: s.id || `s${Date.now()}`,
        name: s.name || 'Unnamed Station',
        members: s.members || [],
        tests: s.tests || [],
        member_count: (s.member_count !== undefined) ? s.member_count : 0,
        test_count: (s.test_count !== undefined) ? s.test_count : 0,
        status: (s as ExtendedStation).status || StationStatus.Idle,
        unread_messages: (s as ExtendedStation).unread_messages || 0,
        created_at: s.created_at || new Date().toISOString(),
        updated_at: s.updated_at || new Date().toISOString()
      }));
      
      // Create the validated event object
      const validatedEvent = {
        ...parsedEvent,
        stations: validatedStations,
        members: parsedEvent.members || [],
        tests: parsedEvent.tests || [],
        chat: parsedEvent.chat || [],
        created_at: parsedEvent.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Validated event to be imported:', validatedEvent);
      
      // Update the state
      setCurrentEvent(validatedEvent);
      
      // Also directly update the derived states for immediate UI refresh
      setStations(validatedStations);
      setMembers(validatedEvent.members);
      setTests(validatedEvent.tests);
      
      // Also save to localStorage for persistence
      const jsonString = JSON.stringify(validatedEvent);
      localStorage.setItem(EVENT_STORAGE_KEY, jsonString);
      console.log('Successfully saved imported event to localStorage');
      
      return true;
    } catch (e) {
      console.error('Error importing event from JSON:', e);
      return false;
    }
  }, [setCurrentEvent, setStations, setMembers, setTests]);

  // Create a new event
  const createNewEvent = useCallback((name: string, maxTime: number) => {
    const newEvent: EventConfiguration = {
      event_name: name,
      max_time: maxTime,
      stations: [], // Start with empty arrays for a new event
      members: [],
      tests: [],
      chat: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCurrentEvent(newEvent); // This will trigger state sync via useEffect
  }, [setCurrentEvent]);

  // Auto-save to localStorage whenever currentEvent changes
  useEffect(() => {
    if (!currentEvent) {
      console.warn('Attempted to auto-save, but currentEvent is undefined');
      return;
    }
    
    try {
      console.log('Auto-saving to localStorage...');
      
      // Deep clone to avoid reference issues
      const eventToSave = JSON.parse(JSON.stringify(currentEvent));
      
      // Ensure stations have all required properties including UI-specific ones
      if (eventToSave.stations) {
        eventToSave.stations = eventToSave.stations.map((s: any) => ({
          ...s,
          id: s.id || `s${Date.now()}`,
          name: s.name || 'Unnamed Station',
          members: s.members || [],
          tests: s.tests || [],
          member_count: (s.member_count !== undefined) ? s.member_count : 0,
          test_count: (s.test_count !== undefined) ? s.test_count : 0,
          status: s.status || StationStatus.Idle,
          unread_messages: s.unread_messages || 0,
          created_at: s.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }
      
      // Update timestamps
      eventToSave.updated_at = new Date().toISOString();
      
      // Save to localStorage
      const jsonString = JSON.stringify(eventToSave);
      localStorage.setItem(EVENT_STORAGE_KEY, jsonString);
      console.log('Successfully auto-saved to localStorage');
    } catch (error) {
      console.error('Error auto-saving to localStorage:', error);
    }
  }, [currentEvent]);

  // Logging effect (can be removed after debugging)
  useEffect(() => {
    console.log('AppDataProvider: currentEvent changed', currentEvent);
  }, [currentEvent]);

  // CHAT OPERATIONS
  const sendMessage = useCallback((messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setCurrentEvent(prevEvent => {
      const updatedChat = [...(prevEvent.chat || []), newMessage];
      
      // Update unread count for the recipient station
      let updatedStations = [...prevEvent.stations];
      
      if (newMessage.recipient_station_id) {
        // Private message: increase unread count for recipient
        updatedStations = updatedStations.map(station => 
          station.id === newMessage.recipient_station_id 
            ? {
                ...station,
                unread_messages: ((station as ExtendedStation).unread_messages || 0) + 1
              }
            : station
        );
      } else {
        // Broadcast message: increase unread count for all stations except sender
        updatedStations = updatedStations.map(station => 
          station.id !== newMessage.sender_station_id 
            ? {
                ...station,
                unread_messages: ((station as ExtendedStation).unread_messages || 0) + 1
              }
            : station
        );
      }
      
      return {
        ...prevEvent,
        chat: updatedChat,
        stations: updatedStations
      };
    });
    
    return newMessage;
  }, [setCurrentEvent]);

  const deleteMessage = useCallback((messageId: string): boolean => {
    let deletedMessage: ChatMessage | undefined;
    
    setCurrentEvent(prevEvent => {
      const initialLength = (prevEvent.chat || []).length;
      deletedMessage = (prevEvent.chat || []).find(m => m.id === messageId);
      
      if (!deletedMessage) {
        return prevEvent; // Message not found
      }
      
      // Instead of removing, mark the message as deleted but keep it for thread continuity
      const updatedChat = (prevEvent.chat || []).map(message => 
        message.id === messageId 
          ? { ...message, message: "[Message deleted]", deleted: true }
          : message
      );
      
      return {
        ...prevEvent,
        chat: updatedChat
      };
    });
    
    return !!deletedMessage;
  }, [setCurrentEvent]);

  const getMessagesForStation = useCallback((stationId: string): ChatMessage[] => {
    // Get messages sent to or from this station (private messages)
    return (currentEvent.chat || []).filter(
      message => 
        (message.sender_station_id === stationId) || 
        (message.recipient_station_id === stationId)
    );
  }, [currentEvent.chat]);

  const markMessageAsRead = useCallback((messageId: string): boolean => {
    let messageFound = false;
    let targetStationId: string | null = null;
    
    setCurrentEvent(prevEvent => {
      const message = (prevEvent.chat || []).find(m => m.id === messageId);
      if (!message || message.read) {
        return prevEvent; // Message not found or already read
      }
      
      messageFound = true;
      
      // Determine which station's unread count should be decremented
      if (message.recipient_station_id) {
        // Private message
        targetStationId = message.recipient_station_id;
      }
      
      // Update the message as read
      const updatedChat = (prevEvent.chat || []).map(m => 
        m.id === messageId ? { ...m, read: true } : m
      );
      
      // Update station unread counts if applicable
      let updatedStations = [...prevEvent.stations];
      if (targetStationId) {
        updatedStations = updatedStations.map(station => 
          station.id === targetStationId
            ? {
                ...station,
                unread_messages: Math.max(0, ((station as ExtendedStation).unread_messages || 0) - 1)
              }
            : station
        );
      }
      
      return {
        ...prevEvent,
        chat: updatedChat,
        stations: updatedStations
      };
    });
    
    return messageFound;
  }, [setCurrentEvent]);

  const getBroadcastMessages = useCallback((): ChatMessage[] => {
    // Get all broadcast messages (where recipient_station_id is null)
    return (currentEvent.chat || []).filter(message => message.recipient_station_id === null);
  }, [currentEvent.chat]);

  const contextValue: AppDataContextType = {
    stations, // Derived state
    setStations, // Potentially remove if all updates go via currentEvent
    tests,    // Derived state
    setTests,   // Potentially remove
    members,  // Derived state
    setMembers, // Potentially remove
    currentEvent,
    setCurrentEvent, // Primary setter for event data
    saveEventToLocalStorage,
    loadEventFromLocalStorage,
    exportEventAsJSON,
    importEventFromJSON,
    createNewEvent,
    addMember,
    updateMember,
    deleteMember,
    assignMemberToStation,
    unassignMemberFromStation,
    getMembersForStation,
    sendMessage,
    deleteMessage,
    getMessagesForStation,
    markMessageAsRead,
    getBroadcastMessages,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook for easy context usage
export const useAppData = () => useContext(AppDataContext); 