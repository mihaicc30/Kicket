export default {
  cookieLogin(context, payload) {
    // here will be an actual call to the server api
    // if cookie is valid, fetch data from DB and set user with the query data
    let userFromDB = databaseMockup.find((user) => user.email === payload.email);
    if (userFromDB) {
      context.commit("login", userFromDB);
    } else {
      console.error("Invalid credentials");
      context.commit("setErrorMessage", "Invalid credentials");
    }
  },
  login(context, payload) {
    // here will be an actual call to the server api
    // mimicking auth with email & pass
    let userFromDB = databaseMockup.find((user) => user.email === payload.email && user.password === payload.password);
    if (userFromDB) {
      context.commit("login", userFromDB);
    } else {
      console.error("Invalid credentials");
      context.commit("setErrorMessage", "Invalid credentials");
    }
  },
  logout(context) {
    context.commit("logout");
  },
};

const databaseMockup = [
  {
    displayName: "Mihai C",
    password: "mihai.culea@keymas.co.uk",
    email: "mihai.culea@keymas.co.uk",
    role: "Junior Support Developer",
    type: "admin",
    photoURL: "https://randomuser.me/api/portraits/men/1.jpg",
    logged: true,
  },
  {
    displayName: "Mihai C",
    password: "a",
    email: "a",
    role: "Junior Support Developer",
    type: "user",
    photoURL: "https://randomuser.me/api/portraits/men/2.jpg",
    logged: true,
  },
];
