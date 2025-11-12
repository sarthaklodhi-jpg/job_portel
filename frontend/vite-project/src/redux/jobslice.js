import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    singleJob : null,
  },
  reducers: {
    // ✅ Action to set all jobs
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
        state.singleJob = action.payload;
    },
    },
});

// ✅ Export actions and reducer
export const { setAllJobs , setSingleJob} = jobSlice.actions;
export default jobSlice.reducer;
