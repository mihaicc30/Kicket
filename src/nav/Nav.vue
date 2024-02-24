<template>
  <nav class="wrapper flex justify-center gap-2 border-b-2 max-w-[900px] mx-auto items-center w-full min-h-[30px] my-2">
    <img src="@/components/icons/kicket.png" alt="logo" class="size-10" />
    <RouterLink to="/dashboard" class="">Dashboard</RouterLink>
    <RouterLink to="/users" class="" v-if="$store.getters.userIsAdmin">Users</RouterLink>
    <RouterLink to="/tickets" class="mr-auto">Tickets</RouterLink>

    <RouterLink to="/profile" class="ml-auto flex items-center gap-2">
      Profile
      <img v-if="isLoggedIn" :src="getUserAvatar()" alt="User Avatar" class="rounded-full size-7" />
    </RouterLink>

    <button v-if="isLoggedIn" @click="logout" class="flex items-center gap-2">Logout</button>
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
