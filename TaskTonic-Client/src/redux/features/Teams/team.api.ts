import { baseApi } from "@/redux/baseApi";

const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (teamData) => ({
        url: "/team",
        method: "POST",
        data: teamData,
      }),
      invalidatesTags: ["TEAM"],
    }),
    getAllTeams: builder.query({
      query: () => ({
        url: "/team",
        method: "GET",
      }),
      providesTags: ["TEAM"],
    }),
    getTeamById: builder.query({
      query: (teamId) => ({
        url: `/team/${teamId}`,
        method: "GET",
      }),
      providesTags: ["TEAM"],
    }),
    updateTeam: builder.mutation({
      query: ({ teamId, ...teamData }) => ({
        url: `/team/${teamId}`,
        method: "PATCH",
        data: teamData,
      }),
      invalidatesTags: ["TEAM"],
    }),
    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `/team/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TEAM"],
    }),
    addTeamMember: builder.mutation({
      query: ({ teamId, ...memberData }) => ({
        url: `/team/${teamId}/members`,
        method: "POST",
        data: memberData,
      }),
      invalidatesTags: ["TEAM"],
    }),
    updateTeamMember: builder.mutation({
      query: ({ teamId, memberId, ...memberData }) => ({
        url: `/team/${teamId}/members/${memberId}`,
        method: "PATCH",
        data: memberData,
      }),
      invalidatesTags: ["TEAM"],
    }),
    deleteTeamMember: builder.mutation({
      query: ({ teamId, memberId }) => ({
        url: `/team/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TEAM"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useGetAllTeamsQuery,
  useGetTeamByIdQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;