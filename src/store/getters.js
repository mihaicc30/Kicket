export default {
  isAuthenticated(state) {
    return Boolean(state.user.logged);
  },
  getUserDetails(state) {
    return state.user;
  },
  getUserType(state) {
    return state.user.type;
  },
  userIsAdmin(state) {
    return state.user.type === "admin";
  },
  getErrorMessage(state) {
    return state.errorMessage;
  },
};
