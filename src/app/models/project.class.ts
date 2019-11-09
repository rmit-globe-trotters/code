export interface Project {
  name: string;
  description: string;
  members: string[];
  id?: string;
  creator?: string;
  createdAt?: Date;
}
