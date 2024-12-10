export const uiActions = {
  toggleTheme: (state: any) => {
    console.log(state);
    return state === "dark" ? "light" : "dark";
  },
};
