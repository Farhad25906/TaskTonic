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
import { Badge } from "@/components/ui/badge";
import { Plus, Users, X } from "lucide-react";

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer", 
  "Full Stack Developer",
  "UI/UX Designer",
  "Project Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Product Manager",
];

// Use the same TeamMember interface as AllTeams.tsx
export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  capacity: number;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: {
    name: string;
    description: string;
    members: TeamMember[];
  }) => void;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
}: CreateTeamModalProps) {
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    members: [] as TeamMember[],
  });

  const [newMember, setNewMember] = useState<Omit<TeamMember, '_id'>>({
    name: "",
    role: "",
    capacity: 3,
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.capacity > 0) {
      // Generate a temporary ID for new members
      const memberWithId: TeamMember = {
        ...newMember,
        _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      setNewTeam((prev) => ({
        ...prev,
        members: [...prev.members, memberWithId],
      }));
      setNewMember({ name: "", role: "", capacity: 3 });
    }
  };

  const handleRemoveMember = (index: number) => {
    setNewTeam((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (newTeam.name && newTeam.members.length > 0) {
      onCreateTeam(newTeam);
      setNewTeam({ name: "", description: "", members: [] });
    }
  };

  const handleClose = () => {
    setNewTeam({ name: "", description: "", members: [] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-[#4871dc]">
            Create New Team
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Add a new team and its members. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Team Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter team name"
                className="h-10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter team description"
                rows={3}
                className="resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                {newTeam.description.length}/200 characters
              </p>
            </div>

            <div className="border-t pt-4">
              <Label className="text-lg font-bold mb-3 block text-[#4871dc]">
                Team Members <span className="text-red-500">*</span>
              </Label>

              {/* Add Member Form */}
              <div className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-[#f8f9ff]">
                <div className="col-span-4">
                  <Input
                    placeholder="Member name"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={newMember.capacity.toString()}
                    onValueChange={(value) =>
                      setNewMember((prev) => ({
                        ...prev,
                        capacity: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Cap" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-5">
                  <Select
                    value={newMember.role}
                    onValueChange={(value) =>
                      setNewMember((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    onClick={handleAddMember}
                    className="w-full h-10 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
                    disabled={!newMember.name || !newMember.role}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Members List */}
              {newTeam.members.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Added Members ({newTeam.members.length})
                  </Label>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {newTeam.members.map((member, index) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-white"
                      >
                        <div className="flex-1 grid grid-cols-12 gap-3 items-center min-w-0">
                          <div className="col-span-4 font-medium text-sm truncate">
                            {member.name}
                          </div>
                          <div className="col-span-5">
                            <Badge
                              variant="secondary"
                              className="text-xs truncate max-w-full"
                            >
                              {member.role}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">
                            Cap: <strong>{member.capacity}</strong>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(index)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-6 border-2 border-dashed rounded-lg text-center bg-[#f8f9ff]">
                  <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">No members added yet</p>
                  <p className="text-xs text-gray-500">
                    Add team members using the form above
                  </p>
                </div>
              )}
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
            disabled={!newTeam.name || newTeam.members.length === 0}
            className="h-10 px-6 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
          >
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}