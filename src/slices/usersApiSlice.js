<<<<<<< HEAD
import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";
=======
import { USERS_URL, CUSTOMERS_URL, USERS_URL1 } from "../constants";
import { apiSlice } from "./apiSlice";

>>>>>>> origin/practical6
export const usersApliSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: USERS_URL + '/login',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: USERS_URL + '/logout',
                method: 'POST'
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: CUSTOMERS_URL + '/register',
                method: 'POST',
                body: data
            }),
        }),
        getUser: builder.query({
            query: () => ({
                url: USERS_URL1,
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: USERS_URL1 + `/${id}`,
                method: 'DELETE'
            }),
        }),
        registerUser: builder.mutation({
            query: (data) => ({
                url: USERS_URL1,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: USERS_URL1 + `/${id}`,
            }),
            keepUnusedDataFor: 5
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: USERS_URL1 + `/${data.id}`,
                method: 'PUT',
                body: data

            }),
            invalidatesTags: ['User']
        }),
        updateUserStatus: builder.mutation({
            query: ({ id, enabled }) => ({
                url: USERS_URL1 + `/${id}/enabled`,
                method: 'PUT',
                body: { enabled }
            }),
            invalidatesTags: ['User']
        }),
    })
})
export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetUserQuery,
    useDeleteUserMutation,
    useRegisterUserMutation,
    useUpdateUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserStatusMutation
} = usersApliSlice;
