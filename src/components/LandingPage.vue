<template>
  <div class="landing-container">
    <h1 class="medieval-title">Scroll of Fate</h1>
    <p class="landing-text">
      Greetings, Dungeon Master! Before you lies a mighty tool to aid in your epic encounters with players.
      The Initiative Tracker allows you to craft battle tables, track turn order, creature health, conditions,
      and concentration. No more tedious calculations or scribbled papers—just clarity, convenience, and speed!
      Dungeons and dragons await you, friend!
    </p>
    <div v-if="!user" class="landing-buttons">
      <router-link to="/login" class="wooden-btn">Login</router-link>
      <router-link to="/register" class="wooden-btn">Register</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  props: ['user'],
};
</script>