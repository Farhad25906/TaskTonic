/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Plus,
  FolderKanban,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { CreateProjectModal } from "@/components/modules/Projects/CreateProjectModal";
import { EditProjectModal } from "@/components/modules/Projects/EditProjectModal";

import { useCreateProjectMutation, useDeleteProjectMutation, useGetAllProjectsQuery, useUpdateProjectMutation } from "@/redux/features/Projects/Projects.api";
import type { IProject } from "@/types/project.types";

const AllProjects = () => {
  const {
    data: projectData,
    isLoading,
    refetch,
  } = useGetAllProjectsQuery(undefined);
  const [createProject] = useCreateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<IProject | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData).unwrap();
      refetch();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleUpdateProject = async (projectId: string, projectData: any) => {
    try {
      await updateProject({ projectId, ...projectData }).unwrap();
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleEditClick = (project: IProject) => {
    setEditProject(project);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading projects...</div>
      </div>
    );
  }

  const projects = projectData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4871dc]">
            Projects
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and track progress
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-6 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#4871dc]">
            All Projects
          </CardTitle>
          <CardDescription className="text-sm">
            View and manage all your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Project Name</TableHead>
                  <TableHead className="font-semibold">Team</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created By</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: IProject) => (
                  <TableRow key={project._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit text-xs px-3 py-1"
                      >
                        <Users className="h-3 w-3" />
                        {project.teamId ? (
                          typeof project.teamId === "string" ? (
                            project.teamId
                          ) : (
                            project.teamId.name
                          )
                        ) : (
                          <span className="text-gray-400">No team</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs px-3 py-1 text-white capitalize"
                        style={{ 
                          backgroundColor: 
                            project.status === 'PLANNING' ? '#6b7280' :
                            project.status === 'IN_PROGRESS' ? '#4871dc' :
                            project.status === 'COMPLETED' ? '#4bb36b' :
                            '#6b7280'
                        }}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">
                          {typeof project.createdBy === 'string' 
                            ? project.createdBy 
                            : project.createdBy?.name || 'Unknown'}
                        </div>
                        {typeof project.createdBy !== 'string' && project.createdBy?.email && (
                          <div className="text-xs text-gray-500">
                            {project.createdBy.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(project)}
                          className="h-9 w-9 p-0 border-[#4871dc] text-[#4871dc]"
                        >
                          <Edit className="h-4 w-4" />
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
                              <AlertDialogTitle className="text-xl">
                                Delete Project
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-sm">
                                This action cannot be undone. This will
                                permanently delete the project "
                                <strong>{project.title}</strong>" and remove all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="h-9">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project._id)}
                                className="h-9 bg-red-600 hover:bg-red-700"
                              >
                                Delete Project
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
              <FolderKanban className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Get started by creating your first project.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 px-8 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={editProject}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  );
};

export default AllProjects;