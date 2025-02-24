import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import BattleHall from '../components/BattleHall.vue';
import EncounterTable from '../components/EncounterTable.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/battles', component: BattleHall, meta: { requiresAuth: true } },
  { path: '/encounter/:id', component: EncounterTable, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.meta.requiresAuth && !user) next('/login');
  else next();
});

export default router;