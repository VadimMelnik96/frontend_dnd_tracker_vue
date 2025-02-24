<template>
  <div class="parchment-bg">
    <Navbar :user="user" @logout="handleLogout" />
    <router-view :user="user" :encounters="encounters" @set-encounters="setEncounters" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  setup() {
    const user = ref(null);
    const encounters = ref([]);

    const handleLogout = () => {
      user.value = null;
      encounters.value = [];
      localStorage.removeItem('user');
    };

    const setEncounters = (newEncounters) => {
      encounters.value = newEncounters;
    };

    const fetchEncounters = async () => {
      // try {
      //   const response = await fetch('/api/encounters');
      //   const data = await response.json();
      //   encounters.value = data;
      // } catch (err) {
      //   console.error('Error fetching encounters:', err);
      // }
    };

    onMounted(() => {
      const storedUser = localStorage.getItem('user');
      console.log('Encounters in App:', encounters.value);
      if (storedUser) {
        user.value = JSON.parse(storedUser);
        fetchEncounters();
      }
    });

    return { user, encounters, handleLogout, setEncounters };
  },
};


</script>