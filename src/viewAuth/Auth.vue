<template>
  <div v-if="!isLoggedIn" class="flex size-full bg-gradient-to-br from-[#2ACDDE75] via-50% to-[#4B96E575] via-white">
    <div class="card flex flex-col items-center gap-2 m-auto py-10 px-[5vw] rounded-lg shadow-md">
      <img src="@/components/icons/kicket.png" alt="logo" class="size-20" />
      <p class="text-xl font-[600]">Welcome to Kicket!</p>
      <p class="text-xs">Please sign in to continue.</p>

      <div v-if="errorMessage" class="flex gap-4 flex-nowrap w-full mt-4 justify-between px-4 border-b-2 border-red-500">
        <p class="text-red-500">{{ errorMessage }}</p>
        <button @click="clearErrorMessage">✖</button>
      </div>

      <div class="flex flex-col gap-y-2 my-8">
        <p class="text-xs font-[600]">Email</p>
        <input type="text" class="inputField p-2 outline-none border-b-2" v-model="email" name="email" placeholder="Email..." />

        <p class="text-xs font-[600]">Password</p>
        <input type="password" class="inputField p-2 outline-none border-b-2" v-model="password" name="password" placeholder="Password..." />

        <label class="flex flex-nowrap gap-4 items-center text-xs" for="rememberMe">
          <input type="checkbox" class="size-4 ring-black/20" v-model="rememberMe" id="rememberMe" />
          <span> Remember me </span>
        </label>
      </div>
      <button class="px-4 py-2 ring-1 ring-black/20 border-[1px] border-black/5 font-[600] text-sm rounded-lg shadow-md" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import { encryptData, decryptData } from "@/utils/crypto";
import store from "@/store";
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
    if (store.getters.isAuthenticated && this.$route.path === "/") {
      this.$router.push("/dashboard");
    }
  },
  data() {
    return {
      // temp - easier to test
      email: import.meta.env.VITE_VUE_EMAIL || "",
      password: import.meta.env.VITE_VUE_PASS || "",
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

<style scoped>
.card {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 16px 16px 44px #8f8f8f91, -16px -16px 44px #ffffff;
}
</style>
