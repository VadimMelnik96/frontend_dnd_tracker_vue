<template>
  <div class="auth-container">
    <h1 class="medieval-title">Login</h1>
    <form @submit.prevent="handleSubmit">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="medieval-input"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="medieval-input"
      />
      <button type="submit" class="wooden-btn">Login</button>
    </form>
    <p>
      No scroll yet? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const handleSubmit = () => {
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: username.value, password: password.value }),
      // });
      // const data = await response.json();
      // if (data.success) {
      localStorage.setItem('user', JSON.stringify({ username: username.value })); // Локальная заглушка
      router.push('/battles');
      // }
    };

    return { username, password, handleSubmit };
  },
};
</script>