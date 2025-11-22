/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetAllTeamsQuery } from "@/redux/features/Teams/team.api";

import { useGetAllProjectsQuery } from "@/redux/features/Projects/Projects.api";
import type { ITask } from "@/types/task.types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask | null;
  onUpdateTask: (taskId: string, taskData: any) => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdateTask,
}: EditTaskModalProps) {
  const { data: projectsData } = useGetAllProjectsQuery(undefined);
  const { data: teamsData } = useGetAllTeamsQuery(undefined);
  const projects = projectsData?.data || [];
  const teams = teamsData?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "medium",
    status: "pending",
  });

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    if (task) {
      const projectId = typeof task.projectId === "string" ? task.projectId : task.projectId?._id || "";
      
      setFormData({
        title: task.title,
        description: task.description || "",
        projectId: projectId,
        assignedTo: typeof task.assignedTo === "string"
          ? task.assignedTo
          : (task.assignedTo?.name || task.assignedTo?._id || ""),
        priority: task.priority || "medium",
        status: task.status || "pending",
      });
      setSelectedProject(projectId);
    }
  }, [task]);

  // Get team members when project is selected
  useEffect(() => {
    if (selectedProject) {
      const project = projects.find((p: any) => p._id === selectedProject);
      if (project && project.teamId) {
        const team = teams.find((t: any) => t._id === project.teamId);
        if (team) {
          setTeamMembers(team.members || []);
        }
      }
    } else {
      setTeamMembers([]);
    }
  }, [selectedProject, projects, teams]);

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setFormData((prev) => ({ ...prev, projectId: value, assignedTo: "" }));
  };

  const handleSubmit = () => {
    if (task && formData.title && formData.projectId) {
      onUpdateTask(task._id, formData);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      priority: "medium",
      status: "pending",
    });
    setSelectedProject("");
    setTeamMembers([]);
    onClose();
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "#6b7280" },
    { value: "medium", label: "Medium", color: "#4871dc" },
    { value: "high", label: "High", color: "#ef4444" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold text-[#4871dc]">
            Edit Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update task details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter task title"
                className="h-10"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter task description"
                rows={3}
                className="resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>

            {/* Project Selection */}
            <div className="grid gap-2">
              <Label htmlFor="project" className="text-sm font-semibold">
                Project <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assign To */}
            <div className="grid gap-2">
              <Label htmlFor="assignedTo" className="text-sm font-semibold">
                Assign To
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assignedTo: value }))
                }
                disabled={!selectedProject || teamMembers.length === 0}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={
                    !selectedProject 
                      ? "Select a project first" 
                      : teamMembers.length === 0 
                      ? "No team members available" 
                      : "Select team member"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member: any) => (
                    <SelectItem key={member._id} value={member.name}>
                      <div className="flex flex-col">
                        <span>{member.name}</span>
                        <span className="text-xs text-gray-500">
                          {member.role} • Capacity: {member.capacity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority and Status Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Priority */}
              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.projectId}
            className="h-10 px-6 text-white bg-[#4871dc] hover:bg-[#3a5cb5]"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}