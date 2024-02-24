export default {
  login(state, payload) {
    state.user = { ...payload };
  },
  logout(state) {
    state.user = userLoggedOut;
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  },
};

const userLoggedOut = {
  displayName: null,
  password: null,
  email: null,
  role: null,
  type: null,
  photoURL: null,
  logged: null,
};
