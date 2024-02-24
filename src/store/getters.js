export default {
  isAuthenticated(state) {
    return Boolean(state.user.logged);
  },
  getUserDetails(state) {
    return state.user;
  },
  getErrorMessage(state) {
    return state.errorMessage;
  },
}