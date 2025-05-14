export interface Member {
  id: string; // Or number, depending on how we generate IDs
  name: string;
  role: string;
  email: string;
  assignedStationId?: string | number | null; // Optional, for future use
} 