import { baseApi } from "@/redux/baseApi";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/task",
        method: "POST",
        data: taskData,
      }),
      invalidatesTags: ["TASK"],
    }),
    getAllTasks: builder.query({
      query: (filters = {}) => ({
        url: "/task",
        method: "GET",
        params: filters,
      }),
      providesTags: ["TASK"],
    }),
    getTaskById: builder.query({
      query: (taskId) => ({
        url: `/task/${taskId}`,
        method: "GET",
      }),
      providesTags: ["TASK"],
    }),
    updateTask: builder.mutation({
      query: ({ taskId, ...taskData }) => ({
        url: `/task/${taskId}`,
        method: "PATCH",
        data: taskData,
      }),
      invalidatesTags: ["TASK"],
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/task/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TASK"],
    }),
    assignTask: builder.mutation({
      query: ({ taskId, assignedTo }) => ({
        url: `/task/${taskId}/assign`,
        method: "PATCH",
        data: { assignedTo },
      }),
      invalidatesTags: ["TASK"],
    }),
    reassignTasks: builder.mutation({
      query: (teamId) => ({
        url: "/task/reassign",
        method: "POST",
        data: { teamId },
      }),
      invalidatesTags: ["TASK"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAssignTaskMutation,
  useReassignTasksMutation,
} = taskApi;
