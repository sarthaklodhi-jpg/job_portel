import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],           // list of companies
    singleCompany: null,     // selected company details
    searchCompanyByText: "", 
  },
  reducers: {
    // ✅ Set all companies
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },

    // ✅ Set single company
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },

    // ✅ Search filter
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },

    // 🔥 NEW: Remove company from state (after delete)
    removeCompany: (state, action) => {
      state.companies = state.companies.filter(
        (company) => company._id !== action.payload
      );
    },
  },
});

// ✅ Export actions
export const {
  setCompanies,
  setSingleCompany,
  setSearchCompanyByText,
  removeCompany,
} = companySlice.actions;

// ✅ Export reducer
export default companySlice.reducer;
