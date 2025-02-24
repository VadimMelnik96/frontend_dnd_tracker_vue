<template>
  <div class="dice-roller">
    <h3>Roll a Dice</h3>
    <button class="close-btn" @click="$emit('close')">✖</button>
    <div class="dice-options">
      <div v-for="die in diceTypes" :key="die" class="dice-row">
        <svg :class="'dice-icon ' + die" viewBox="0 0 100 100" width="24" height="24">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#4a9c7d" stroke="#193028" stroke-width="2" />
          <text x="50" y="60" text-anchor="middle" fill="#fff" font-size="30" font-family="'MedievalSharp', cursive">
            {{ die.toUpperCase() }}
          </text>
        </svg>
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

<style scoped>
.dice-roller {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 250px;
  background: rgba(255, 245, 220, 0.9);
  border: 3px solid #5a3e2b;
  border-radius: 10px 0 0 10px;
  padding: 20px;
  box-shadow: -5px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  animation: scrollReveal 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes scrollReveal {
  0% {
    width: 0;
    opacity: 0;
    transform: translateY(-50%) scaleY(0.1);
  }
  20% {
    width: 80px;
    opacity: 0.3;
    transform: translateY(-50%) scaleY(0.4);
  }
  40% {
    width: 150px;
    opacity: 0.6;
    transform: translateY(-50%) scaleY(0.7);
  }
  60% {
    width: 220px;
    opacity: 0.8;
    transform: translateY(-50%) scaleY(0.9);
  }
  80% {
    width: 260px;
    opacity: 0.95;
    transform: translateY(-50%) scaleY(1.02);
  }
  100% {
    width: 250px;
    opacity: 1;
    transform: translateY(-50%) scaleY(1);
  }
}

.dice-roller h3 {
  margin: 0 0 20px;
  color: #8b0000;
  text-align: center;
}

.dice-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dice-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dice-icon {
  margin-right: 10px;
}

.d20 { fill: #4a9c7d; }
.d12 { fill: #6b8e23; }
.d10 { fill: #8b0000; }
.d8  { fill: #483d8b; }
.d6  { fill: #ff8c00; }
.d4  { fill: #9400d3; }

.dice-row span {
  font-size: 16px;
  color: #333;
}

.dice-row button {
  background: #5a3e2b;
  color: #fff;
  border: 1px solid #3c2f2f;
  padding: 2px 8px;
  cursor: pointer;
}

.dice-row button:hover {
  background: #3c2f2f;
}

.roll-btn {
  margin-top: 20px;
  width: 100%;
}

.roll-results {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #8b0000;
}

.close-btn:hover {
  color: #ff0000;
}
</style>