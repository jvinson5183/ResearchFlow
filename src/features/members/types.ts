export interface Member {
  id: string; // Or number, depending on how we generate IDs
  name: string;
  role: string;
  email: string;
  assignedStationId?: string; // ID of the station this member is assigned to
} 