export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dateOfBirth: string; // ISO string
  color: string;
  avatar?: string;
  last_updated: number; // unix timestamp for simple sync
}
