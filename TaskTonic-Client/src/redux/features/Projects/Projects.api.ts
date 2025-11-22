import { baseApi } from "@/redux/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/project",
        method: "POST",
        data: projectData,
      }),
      invalidatesTags: ["PROJECT"],
    }),
    getAllProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),
    getProjectById: builder.query({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),
    getProjectsByTeam: builder.query({
      query: (teamId) => ({
        url: `/project/team/${teamId}`,
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),
    updateProject: builder.mutation({
      query: ({ projectId, ...projectData }) => ({
        url: `/project/${projectId}`,
        method: "PATCH",
        data: projectData,
      }),
      invalidatesTags: ["PROJECT"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROJECT"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectsByTeamQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;