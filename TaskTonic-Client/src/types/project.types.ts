// project.types.ts
export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export interface IProject {
  _id: string;
  title: string;
  description?: string;
  teamId: {
    _id: string;
    name: string;
  } | null; // Allow teamId to be null
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  teamId?: string; // Make teamId optional for creation
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  teamId?: string | null; // Allow setting teamId to null
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}