
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Users, User } from "lucide-react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  capacity: number;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  createdBy: string | {
    name: string;
    email: string;
  };
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

interface ViewTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteMember: (teamId: string, memberId: string) => void;
}

export function ViewTeamModal({
  team,
  isOpen,
  onClose,
  onDeleteMember,
}: ViewTeamModalProps) {
  if (!team) return null;

  const handleDeleteMember = (memberId: string) => {
    if (memberId) {
      onDeleteMember(team._id, memberId);
    }
  };

  const getCreatedByInfo = () => {
    if (typeof team.createdBy === 'string') {
      return { name: 'Unknown', email: '' };
    }
    return team.createdBy;
  };

  const createdBy = getCreatedByInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#4871dc]">
            <Users className="h-6 w-6 text-[#4bb36b]" />
            {team.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {team.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-5">
            {/* Team Information */}
            <div className="grid grid-cols-6 gap-4 p-4 border rounded-lg bg-[#f8f9ff]">
              <div className="space-y-1 col-span-3">
                <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Created By
                </Label>
                <p className="text-sm font-medium truncate">{createdBy.name}</p>
                {createdBy.email && (
                  <p className="text-xs text-gray-500 truncate">
                    {createdBy.email}
                  </p>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Total Members
                </Label>
                <p className="text-xl font-bold text-[#4bb36b]">
                  {team.members.length}
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <Label className="text-lg font-bold border-b pb-2 block text-[#4871dc]">
                Team Members ({team.members.length})
              </Label>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-100 rounded-lg border font-semibold text-xs text-gray-700">
                <div className="col-span-4">MEMBER</div>
                <div className="col-span-4">ROLE</div>
                <div className="col-span-2">CAPACITY</div>
                <div className="col-span-2 text-center">ACTIONS</div>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    {/* Member Name */}
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-[#4871dc]"
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-sm truncate">
                          {member.name}
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-4 min-w-0">
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 truncate"
                      >
                        {member.role}
                      </Badge>
                    </div>

                    {/* Capacity */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold">
                        {member.capacity}
                      </span>
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-2 flex justify-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl flex items-center gap-2">
                              <Trash2 className="h-5 w-5 text-red-600" />
                              Remove Member
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm space-y-2">
                              <p>
                                Are you sure you want to remove this member from
                                the team?
                              </p>
                              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                <p className="font-semibold text-red-800 text-sm">
                                  {member.name}
                                </p>
                                <p className="text-red-600 text-xs">
                                  {member.role}
                                </p>
                              </div>
                              <p className="font-medium">
                                This action cannot be undone.
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="h-9">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMember(member._id)}
                              className="h-9 bg-red-600 hover:bg-red-700"
                            >
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {team.members.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-[#f8f9ff]">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-base font-semibold mb-1">No Members</h3>
                  <p className="text-sm text-gray-500">
                    This team doesn't have any members yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}