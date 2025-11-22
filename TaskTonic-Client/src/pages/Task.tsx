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
import { Plus, ListTodo, Edit, Trash2, User, FolderKanban } from "lucide-react";
import { CreateTaskModal } from "@/components/modules/Tasks/CreateTaskModal";
import { EditTaskModal } from "@/components/modules/Tasks/EditTaskModal";

import { useCreateTaskMutation, useDeleteTaskMutation, useGetAllTasksQuery, useUpdateTaskMutation } from "@/redux/features/Task/Task.api";
import type { ITask } from "@/types/task.types";

const Task = () => {
  const { data: taskData, isLoading, refetch } = useGetAllTasksQuery(undefined);
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  console.log(taskData);
  


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData).unwrap();
      refetch();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      await updateTask({ taskId, ...taskData }).unwrap();
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditClick = (task: ITask) => {
    setEditTask(task);
    setIsEditModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: "#6b7280",
      medium: "#4871dc",
      high: "#ef4444",
    };
    return colors[priority] || "#6b7280";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "#6b7280",
      'in-progress': "#4871dc",
      done: "#4bb36b",
    };
    return colors[status] || "#6b7280";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-base">Loading tasks...</div>
      </div>
    );
  }

  const tasks = taskData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4871dc]">
            Tasks
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-6 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#4871dc]">
            All Tasks
          </CardTitle>
          <CardDescription className="text-sm">
            View and manage all your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Task</TableHead>
                  <TableHead className="font-semibold">Project</TableHead>
                  <TableHead className="font-semibold">Assigned To</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: ITask) => (
                  <TableRow key={task._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit text-xs px-3 py-1"
                      >
                        <FolderKanban className="h-3 w-3" />
                        {typeof task.projectId === "string"
                          ? task.projectId
                          : task.projectId?.title || 'Unknown Project'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-[#4871dc]"
                          >
                            {typeof task.assignedTo === "string"
                              ? task.assignedTo
                              : task.assignedTo?.name || "Unknown User"}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {typeof task.assignedTo === "string"
                                ? task.assignedTo
                                : task.assignedTo?.name || "Unknown User"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs px-3 py-1">
                          <User className="h-3 w-3 mr-1" />
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                          }}
                        />
                        <span className="text-sm font-medium capitalize">
                          {task.priority}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs px-3 py-1 text-white capitalize"
                        style={{
                          backgroundColor: getStatusColor(task.status),
                        }}
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(task)}
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
                                Delete Task
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-sm">
                                This action cannot be undone. This will
                                permanently delete the task "
                                <strong>{task.title}</strong>" and remove all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="h-9">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTask(task._id)}
                                className="h-9 bg-red-600 hover:bg-red-700"
                              >
                                Delete Task
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
              <ListTodo className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Get started by creating your first task.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 px-8 text-white bg-[#4bb36b] hover:bg-[#3da15a]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={editTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Task;