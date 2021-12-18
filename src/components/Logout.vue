<template>
  <a @click="signOut">{{ $t("Logout") }}</a>
</template>

<script>
import { signOut } from "../backend/services/UserService";

export default {
  methods: {
    async signOut() {
      try {
        await signOut();
        this.$store.commit("unsetCurrentUser");
        this.$router.replace("/sign-in");
      } catch (error) {}
    },
  },
};
</script>
