<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-link">Home</router-link>
    <div class="navbar-links">
      <router-link v-if="user" to="/battles" class="navbar-link">My Battles</router-link>
      <button v-if="user" class="wooden-btn navbar-logout" @click="$emit('logout')">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  props: ['user'],
};
</script>