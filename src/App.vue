<script>
import { RouterLink, RouterView } from "vue-router";
import Nav from "./nav/Nav.vue";

export default {
  components: {
    Nav,
  },
  // mounted() {
  //   console.log(import.meta.env.VITE_VUE_SK);
  // },
};
</script>

<template>
  <div class="flex flex-col h-[100svh]">
    <Nav v-if="$store.state.user.logged" />
    <RouterView />
  </div>
</template>
