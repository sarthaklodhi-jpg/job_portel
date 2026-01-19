import {createSlice} from '@reduxjs/toolkit';
const applicationSlice = createSlice({
    name: 'applications',
    initialState: {
        applications: [],
    },
    reducers: {
        setApplications(state, action) {
            state.applications = action.payload;
        },
        updateApplicationStatus: (state, action) => {
  const { id, status } = action.payload;

  const app = state.applications.find(
    (a) => a._id === id
  );

  if (app) {
    app.status = status;
  }
},

    },
});

export const {setApplications , updateApplicationStatus,} = applicationSlice.actions;
export default applicationSlice.reducer;