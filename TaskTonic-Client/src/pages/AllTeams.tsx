
import { useState } from "react";
import { 
  useGetAllTeamsQuery, 
  useCreateTeamMutation, 
  useDeleteTeamMutation,
  useDeleteTeamMemberMutation 
} from "@/redux/features/Teams/team.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

import { Plus, Users, Eye, Trash2 } from "lucide-react";
import { CreateTeamModal } from "@/components/modules/Teams/CreateTeamModal";
import { ViewTeamModal } from "@/components/modules/Teams/ViewTeamModal";

export interface TeamMember {
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

const AllTeams = () => {
  const { data: teamsData, isLoading, refetch } = useGetAllTeamsQuery(undefined);
  const [createTeam] = useCreateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const [deleteTeamMember] = useDeleteTeamMemberMutation();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewTeam, setViewTeam] = useState<Team | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleCreateTeam = async (teamData: { name: string; description: string; members: TeamMember[] }) => {
    try {
      await createTeam(teamData).unwrap();
      refetch();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete team:', error);
    }
  };

  const handleDeleteMember = async (teamId: string, memberId: string) => {
    try {
      await deleteTeamMember({ teamId, memberId }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleViewTeam = (team: Team) => {
    setViewTeam(team);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading teams...</div>
      </div>
    );
  }

  const teams = teamsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4871dc]">
            Teams
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your teams and team members
          </p>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-6 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </div>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#4871dc]">
            All Teams
          </CardTitle>
          <CardDescription className="text-sm">
            Manage your teams and view their members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Team Name</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Members</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team: Team) => (
                  <TableRow key={team._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {team.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit text-xs px-3 py-1">
                        <Users className="h-3 w-3" />
                        {team.members.length} members
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTeam(team)}
                          className="h-9 w-9 p-0 border-[#4871dc] text-[#4871dc]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Delete Team</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm">
                                This action cannot be undone. This will permanently delete the team
                                "<strong>{team.name}</strong>" and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="h-9">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTeam(team._id)}
                                className="h-9 bg-red-600 hover:bg-red-700"
                              >
                                Delete Team
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No teams found</h3>
              <p className="text-gray-500 mb-6 text-sm">Get started by creating your first team.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 px-8 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Team
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
      />

      <ViewTeamModal
        team={viewTeam}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onDeleteMember={handleDeleteMember}
      />
    </div>
  );
};

export default AllTeams;