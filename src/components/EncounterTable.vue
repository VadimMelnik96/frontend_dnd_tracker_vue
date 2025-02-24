<template>
  <div class="encounter-container">
    <div class="header-row">
      <div>
        <h1 class="medieval-title">{{ encounter.name }}</h1>
        <p v-if="encounter.notes" class="encounter-notes">{{ encounter.notes }}</p>
      </div>
      <div class="button-group">
        <button class="wooden-btn" @click="showDiceRoller = true">Roll a Dice</button>
        <button class="wooden-btn" @click="$router.push('/battles')">Back to Hall</button>
        <button class="wooden-btn" @click="addCreature">Add Creature</button>
        <button class="wooden-btn" @click="nextTurn">Next Turn</button>
      </div>
    </div>
    <DiceRoller v-if="showDiceRoller" @close="showDiceRoller = false" />
    <table class="encounter-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Initiative</th>
          <th>HP</th>
          <th>AC</th>
          <th>Conditions</th>
          <th>Concentration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(creature, index) in creatures"
          :key="creature.id"
          :class="{ 'active-turn': index === currentTurn, 'dragging': draggedIndex === index }"
          draggable
          @dragstart="handleDragStart(index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop(index)"
          @dragend="handleDragEnd"
        >
          <td>
            <input
              v-model="creature.name"
              @input="updateCreature(creature.id, 'name', $event.target.value)"
              class="medieval-input"
              placeholder="Name"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="creature.initiative"
              @input="updateCreature(creature.id, 'initiative', $event.target.value)"
              class="medieval-input"
              placeholder="Init."
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="creature.hp"
              @input="updateCreature(creature.id, 'hp', $event.target.value)"
              class="medieval-input"
              placeholder="HP"
            />
          </td>
          <td>
            <input
              type="number"
              v-model.number="creature.ac"
              @input="updateCreature(creature.id, 'ac', $event.target.value)"
              class="medieval-input"
              placeholder="AC"
            />
          </td>
          <td @click="setShowConditions(creature.id)" class="conditions-cell">
            {{ creature.conditions.length > 0 ? creature.conditions.join(', ') : 'None' }}
            <div
              v-if="showConditions === creature.id"
              class="conditions-wrapper"
              :ref="(el) => setConditionsRef(creature.id, el)"
            >
              <select
                multiple
                v-model="creature.conditions"
                @change="updateCreature(creature.id, 'conditions', creature.conditions); hideConditions()"
                class="medieval-input medieval-select"
              >
                <option v-for="condition in conditionsList" :key="condition" :value="condition">
                  {{ condition }}
                </option>
              </select>
              <button class="wooden-btn reset-btn" @click="resetConditions(creature.id)">
                None
              </button>
            </div>
          </td>
          <td>
            <input
              type="checkbox"
              v-model="creature.concentration"
              @change="updateCreature(creature.id, 'concentration', creature.concentration)"
            />
          </td>
          <td class="actions-cell">
            <button class="action-btn" @click="handleActionInput(creature.id, 'damage')">
              ⚔️
            </button>
            <button class="action-btn" @click="handleActionInput(creature.id, 'heal')">
              💉
            </button>
            <button class="action-btn delete-btn" @click="deleteCreature(creature.id)">
              ❌
            </button>
            <input
              v-if="actionInput.creatureId === creature.id && actionInput.type !== 'delete'"
              type="number"
              v-model.number="actionInput.value"
              @input="actionInput.value = $event.target.value"
              @keypress.enter="handleDamageHeal(creature.id, actionInput.value, actionInput.type === 'heal')"
              class="medieval-input action-input"
              :placeholder="actionInput.type === 'damage' ? 'Damage' : 'Healing'"
              :ref="(el) => setActionInputRef(creature.id, el)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import DiceRoller from './DiceRoller.vue';

export default {
  name: 'EncounterTable',
  components: { DiceRoller },
  props: {
    encounters: Array,
  },
  emits: ['set-encounters'],
  setup(props, { emit }) {
    const route = useRoute();
    const currentTurn = ref(0);
    const conditionsList = ref([]);
    const showConditions = ref(null);
    const actionInput = ref({ creatureId: null, type: null, value: '' });
    const draggedIndex = ref(null);
    const showDiceRoller = ref(false);
    const conditionsRefs = ref({});
    const actionInputRefs = ref({});

    const encounterId = parseInt(route.params.id);
    const encounter = ref(
      props.encounters.find((e) => e.id === encounterId) || {
        id: encounterId,
        name: 'Unnamed Encounter',
        notes: '',
        creatures: [],
      }
    );
    const creatures = ref([...encounter.value.creatures]);

    const fetchEncounter = () => {
      conditionsList.value = [
        'Blinded', 'Charmed', 'Deafened', 'Exhausted', 'Frightened', 'Grappled',
        'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned',
        'Prone', 'Restrained', 'Stunned', 'Unconscious'
      ];
      // fetch(`/api/encounters/${route.params.id}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     const updatedEncounters = props.encounters.map((e) =>
      //       e.id === parseInt(route.params.id) ? data : e
      //     );
      //     emit('set-encounters', updatedEncounters);
      //     encounter.value = data || encounter.value;
      //     creatures.value = [...encounter.value.creatures];
      //   })
      //   .catch((err) => console.error('Error loading:', err));
    };

    const addCreature = () => {
      console.log('Adding creature to encounter:', encounter.value);
      const newCreature = {
        id: Date.now(),
        name: '',
        initiative: '',
        hp: 0,
        ac: '',
        conditions: [],
        concentration: false,
      };
      creatures.value = [...creatures.value, newCreature];
      const updatedEncounter = { ...encounter.value, creatures: creatures.value };
      emit('set-encounters', props.encounters.map((e) =>
        e.id === encounter.value.id ? updatedEncounter : e
      ));
      encounter.value = updatedEncounter;
      // fetch(`/api/encounters/${encounter.value.id}/creatures`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCreature),
      // });
    };

    const deleteCreature = (creatureId) => {
      creatures.value = creatures.value.filter((c) => c.id !== creatureId);
      const updatedEncounter = { ...encounter.value, creatures: creatures.value };
      emit('set-encounters', props.encounters.map((e) =>
        e.id === encounter.value.id ? updatedEncounter : e
      ));
      encounter.value = updatedEncounter;
      // fetch(`/api/creatures/${creatureId}`, { method: 'DELETE' });
      if (currentTurn.value >= creatures.value.length) {
        currentTurn.value = Math.max(0, currentTurn.value - 1);
      }
    };

    const updateCreature = (creatureId, field, value) => {
      creatures.value = creatures.value.map((c) =>
        c.id === creatureId ? { ...c, [field]: value } : c
      ).sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
      const updatedEncounter = { ...encounter.value, creatures: creatures.value };
      emit('set-encounters', props.encounters.map((e) =>
        e.id === encounter.value.id ? updatedEncounter : e
      ));
      encounter.value = updatedEncounter;
      // fetch(`/api/creatures/${creatureId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ [field]: value }),
      // });
    };

    const handleDamageHeal = (creatureId, amount, isHeal) => {
      const parsedAmount = parseInt(amount) || 0;
      creatures.value = creatures.value.map((c) =>
        c.id === creatureId
          ? { ...c, hp: (parseInt(c.hp) || 0) + (isHeal ? parsedAmount : -parsedAmount) }
          : c
      );
      const updatedEncounter = { ...encounter.value, creatures: creatures.value };
      emit('set-encounters', props.encounters.map((e) =>
        e.id === encounter.value.id ? updatedEncounter : e
      ));
      encounter.value = updatedEncounter;
      // fetch(`/api/creatures/${creatureId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ hp: updatedEncounter.creatures.find((c) => c.id === creatureId).hp }),
      // });
      actionInput.value = { creatureId: null, type: null, value: '' };
    };

    const nextTurn = () => {
      if (!creatures.value.length) return;
      currentTurn.value = (currentTurn.value + 1) % creatures.value.length;
      actionInput.value = { creatureId: null, type: null, value: '' };
    };

    const handleActionInput = (creatureId, type) => {
      actionInput.value = { creatureId, type, value: '' };
    };

    const handleDragStart = (index) => {
      draggedIndex.value = index;
      console.log('Drag started at index:', index);
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      console.log('Dragging over index:', index);
    };

    const handleDrop = (index) => {
      console.log('Dropped at index:', index, 'from:', draggedIndex.value);
      if (draggedIndex.value === null || draggedIndex.value === index) return;
      const updatedCreatures = [...creatures.value];
      const [draggedItem] = updatedCreatures.splice(draggedIndex.value, 1);
      updatedCreatures.splice(index, 0, draggedItem);
      creatures.value = updatedCreatures;
      const updatedEncounter = { ...encounter.value, creatures: updatedCreatures };
      emit('set-encounters', props.encounters.map((e) =>
        e.id === encounter.value.id ? updatedEncounter : e
      ));
      encounter.value = updatedEncounter;
    };

    const handleDragEnd = () => {
      draggedIndex.value = null;
      console.log('Drag ended');
    };

    const resetConditions = (creatureId) => {
      updateCreature(creatureId, 'conditions', []);
      showConditions.value = null;
    };

    const setConditionsRef = (creatureId, el) => {
      if (el) conditionsRefs.value[creatureId] = el;
    };

    const setActionInputRef = (creatureId, el) => {
      if (el) actionInputRefs.value[creatureId] = el;
    };

    const setShowConditions = (creatureId) => {
      showConditions.value = creatureId;
    };

    const hideConditions = () => {
      showConditions.value = null;
    };

    const handleClickOutside = (event) => {
      const actionRef = actionInputRefs.value[actionInput.value.creatureId];
      if (actionRef && !actionRef.contains(event.target)) {
        actionInput.value = { creatureId: null, type: null, value: '' };
      }
      const conditionRef = conditionsRefs.value[showConditions.value];
      if (conditionRef && !conditionRef.contains(event.target)) {
        showConditions.value = null;
      }
    };

    onMounted(() => {
      fetchEncounter();
      document.addEventListener('mousedown', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });

    return {
      currentTurn,
      conditionsList,
      showConditions,
      actionInput,
      draggedIndex,
      showDiceRoller,
      conditionsRefs,
      actionInputRefs,
      creatures,
      encounter,
      addCreature,
      deleteCreature,
      updateCreature,
      handleDamageHeal,
      nextTurn,
      handleActionInput,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
      resetConditions,
      setConditionsRef,
      setActionInputRef,
      setShowConditions,
      hideConditions,
    };
  },
};
</script>