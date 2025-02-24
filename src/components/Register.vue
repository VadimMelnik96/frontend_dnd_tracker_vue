<template>
  <div class="auth-container">
    <h1 class="medieval-title">Create Your Scroll</h1>
    <form @submit.prevent="handleSubmit">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="medieval-input"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="medieval-input"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="medieval-input"
      />
      <button type="submit" class="wooden-btn">Create</button>
    </form>
    <p>
      Already have a Battle Hall? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const handleSubmit = () => {
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: username.value, email: email.value, password: password.value }),
      // });
      // const data = await response.json();
      // if (data.success) {
      localStorage.setItem('user', JSON.stringify({ username: username.value })); // Локальная заглушка
      router.push('/battles');
      // }
    };

    return { username, email, password, handleSubmit };
  },
};
</script>