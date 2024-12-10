import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  // Retrieve the saved theme from localStorage or default to "light"
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme); // Save the theme to localStorage
      return newTheme;
    },
  },
});

export const { toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;
