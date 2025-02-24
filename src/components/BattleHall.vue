<template>
  <div class="battle-hall-container">
    <h1 class="medieval-title">Hall of Battles</h1>
    <button v-if="!showCreateForm" class="wooden-btn" @click="showCreateForm = true">
      Create Encounter
    </button>
    <form v-else @submit.prevent="handleCreateEncounter" class="create-encounter-form">
      <input
        v-model="name"
        type="text"
        placeholder="Encounter Name"
        class="medieval-input"
      />
      <textarea
        v-model="notes"
        placeholder="Notes"
        class="medieval-input"
      />
      <button type="submit" class="wooden-btn">Create</button>
      <button type="button" class="wooden-btn" @click="showCreateForm = false">Cancel</button>
    </form>
    <ul v-if="!showCreateForm" class="encounter-list">
      <li v-for="encounter in encounters" :key="encounter.id" class="encounter-item">
        <router-link :to="`/encounter/${encounter.id}`" class="medieval-link">
          {{ encounter.name }}
        </router-link>
        <button class="delete-btn" @click="deleteEncounter(encounter.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'BattleHall',
  props: ['encounters', 'user'],
  emits: ['set-encounters'], // Указываем, что компонент будет отправлять событие 'set-encounters'
  setup(props, { emit }) {
    const showCreateForm = ref(false);
    const name = ref('');
    const notes = ref('');

    const handleCreateEncounter = async () => {
      if (name.value) {
        // try {
        //   const response = await fetch('/api/encounters', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name: name.value, notes: notes.value, userId: props.user.id }),
        //   });
        //   const newEncounter = await response.json();
        //   emit('set-encounters', [...props.encounters, newEncounter]);
        // } catch (err) {
        //   console.error('Error creating encounter:', err);
        // }
        const newEncounter = { id: Date.now(), name: name.value, notes: notes.value, creatures: [] }; // Локальная заглушка
        emit('set-encounters', [...props.encounters, newEncounter]);
        name.value = '';
        notes.value = '';
        showCreateForm.value = false;
      }
    };

    const deleteEncounter = (encounterId) => {
      // fetch(`/api/encounters/${encounterId}`, { method: 'DELETE' })
      //   .then(() => {
      //     emit('set-encounters', props.encounters.filter((e) => e.id !== encounterId));
      //   })
      //   .catch((err) => console.error('Error deleting encounter:', err));
      emit('set-encounters', props.encounters.filter((e) => e.id !== encounterId)); // Локальная заглушка
    };

    return { showCreateForm, name, notes, handleCreateEncounter, deleteEncounter };
  },
};
</script>