<template>
  <nav class="wrapper flex justify-center gap-4 border-b-2 max-w-[900px] mx-auto items-center w-full min-h-[30px] my-2">
    <img src="@/components/icons/logo.png" alt="logo" class="size-10">
    <RouterLink to="/dashboard" class="">Dashboard</RouterLink>
    <RouterLink to="/dashboard2" class="mr-auto">Dashboard2</RouterLink>

    <button v-if="isLoggedIn" @click="logout" class="ml-auto">Logout</button>
    <img v-if="isLoggedIn" :src="getUserAvatar()" alt="User Avatar" class="rounded-full size-7" />
  </nav>
</template>

<script>
import { RouterLink } from "vue-router";
import VueCookies from "vue-cookies";
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      VueCookies.remove("_auth");
      this.$router.push("/");
    },
    getUserAvatar() {
      return this.$store.state.user.photoURL;
    },
  },
};
</script>
