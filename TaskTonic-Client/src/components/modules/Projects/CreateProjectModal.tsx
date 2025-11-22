/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
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

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const { data: teamsData } = useGetAllTeamsQuery(undefined);
  const teams = teamsData?.data || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
  });

  const handleSubmit = () => {
    if (formData.title && formData.teamId) {
      onCreateProject(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      teamId: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold text-[#4871dc]">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Add a new project with details. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Project Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter project title"
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
                placeholder="Enter project description"
                rows={3}
                className="resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>

            {/* Team Selection */}
            <div className="grid gap-2">
              <Label htmlFor="team" className="text-sm font-semibold">
                Team <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.teamId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, teamId: value }))
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: any) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            disabled={!formData.title || !formData.teamId}
            className="h-10 px-6 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}