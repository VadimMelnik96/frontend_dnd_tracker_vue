<template>
  <div class="dice-roller">
    <h3>Roll a Dice</h3>
    <button class="close-btn" @click="$emit('close')">✖</button>
    <div class="dice-options">
      <div v-for="die in diceTypes" :key="die" class="dice-row">
        <span>{{ die.toUpperCase() }}</span>
        <button @click="updateDiceCount(die, -1)">-</button>
        <span>{{ dice[die] }}</span>
        <button @click="updateDiceCount(die, 1)">+</button>
      </div>
    </div>
    <button class="wooden-btn roll-btn" @click="handleRoll">Roll</button>
    <div v-if="results" class="roll-results">
      <p v-for="(rolls, die) in results.rolls" :key="die">{{ die.toUpperCase() }}: {{ rolls.join(', ') }}</p>
      <p>Total: {{ results.total }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DiceRoller',
  setup() {
    const diceTypes = ['d20', 'd12', 'd10', 'd8', 'd6', 'd4'];
    const dice = ref({ d20: 0, d12: 0, d10: 0, d8: 0, d6: 0, d4: 0 });
    const results = ref(null);

    const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

    const handleRoll = () => {
      const rollResults = {};
      let total = 0;

      Object.keys(dice.value).forEach((die) => {
        const sides = parseInt(die.replace('d', ''));
        const count = dice.value[die];
        if (count > 0) {
          const rolls = Array.from({ length: count }, () => rollDice(sides));
          rollResults[die] = rolls;
          total += rolls.reduce((sum, roll) => sum + roll, 0);
        }
      });

      results.value = { rolls: rollResults, total };
    };

    const updateDiceCount = (die, change) => {
      dice.value[die] = Math.max(0, dice.value[die] + change);
    };

    return { diceTypes, dice, results, handleRoll, updateDiceCount };
  },
};
</script>