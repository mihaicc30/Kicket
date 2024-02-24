<template>
  <div v-if="!isLoggedIn" class="flex flex-col items-center gap-2 m-auto py-10">
    <p class="text-xl font-[600]">Welcome to Kicket!</p>
    <img src="@/components/icons/kicket.png" alt="logo" class="size-20" />
    <p class="text-xs">Please sign in to continue.</p>

    <div v-if="errorMessage" class="flex gap-4 flex-nowrap w-full mt-4 justify-between px-4 border-b-2 border-red-500">
      <p class="text-red-500">{{ errorMessage }}</p>
      <button @click="clearErrorMessage">✖</button>
    </div>

    <div class="flex flex-col gap-y-1 my-8">
      <p>Username</p>
      <input type="text" class="px-4 py-2 ring-1 ring-black/20" v-model="email" name="email" />
      <p>Password</p>
      <input type="password" class="px-4 py-2 ring-1 ring-black/20" v-model="password" name="password" />
      <label class="flex flex-nowrap gap-4 items-center text-xs" for="rememberMe">
        <input type="checkbox" class="size-4 ring-black/20" v-model="rememberMe" id="rememberMe" />
        <span> Remember me </span>
      </label>
    </div>
    <button class="px-4 py-2 ring-1 ring-black/20" @click="login">Login</button>
  </div>
</template>

<script>
import { encryptData, decryptData } from "@/utils/crypto";
export default {
  mounted() {
    if (localStorage.getItem("rememberMe") === "true") {
      const encryptedEmail = localStorage.getItem("email");
      const encryptedPassword = localStorage.getItem("password");

      if (encryptedEmail && encryptedPassword) {
        this.email = decryptData(encryptedEmail, import.meta.env.VITE_VUE_SK);
        this.password = decryptData(encryptedPassword, import.meta.env.VITE_VUE_SK);
      }
    }
  },
  data() {
    return {
      // temp - easier to test
      email: "mihai.culea@keymas.co.uk",
      password: "mihai.culea@keymas.co.uk",
      // email: "",
      // password: "",
      rememberMe: localStorage.getItem("rememberMe") || false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    errorMessage() {
      return this.$store.getters.getErrorMessage;
    },
  },
  watch: {
    isLoggedIn(isAuthed) {
      if (isAuthed) {
        this.$router.push("/dashboard");
      }
    },
  },
  methods: {
    isAuthenticated() {
      console.log("check is authenticated");
      console.log(this.$store.state.user);
    },
    login() {
      if (this.rememberMe) {
        const encryptedEmail = encryptData(this.email, import.meta.env.VITE_VUE_SK);
        const encryptedPassword = encryptData(this.password, import.meta.env.VITE_VUE_SK);

        localStorage.setItem("email", encryptedEmail);
        localStorage.setItem("password", encryptedPassword);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Clear localStorage if rememberMe is not checked
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
    logout() {
      this.$store.dispatch("logout");
    },
    clearErrorMessage() {
      this.$store.commit("setErrorMessage", null);
    },
  },
};
</script>
