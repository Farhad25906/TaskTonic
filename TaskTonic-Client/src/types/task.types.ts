export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

// You can also export the values as constants if needed
export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM", 
  HIGH: "HIGH",
} as const;

export const TASK_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  projectId: {
    _id: string;
    title: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  originallyAssignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  assignmentHistory: string[];
  priority: TaskPriority;
  status: TaskStatus;
  lastReassignedAt?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  projectId?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface AssignTaskData {
  assignedTo: string;
}

export interface AutoAssignTaskData {
  projectId: string;
  priority?: TaskPriority;
}

export interface ReassignTasksData {
  fromMemberId: string;
  toMemberId: string;
  projectId?: string;
}