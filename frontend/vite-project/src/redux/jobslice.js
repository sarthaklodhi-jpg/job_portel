import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchjobByText: "",
    allAppliedJobs: [],
    searchedQuery : "",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchjobByText: (state, action) => {
      state.searchjobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    removeJob: (state, action) => {
  state.allAdminJobs = state.allAdminJobs.filter(
    (job) => job._id !== action.payload
  );
},

  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchjobByText,
  setAllAppliedJobs,
  setSearchedQuery,
    removeJob,
} = jobSlice.actions;

export default jobSlice.reducer;
