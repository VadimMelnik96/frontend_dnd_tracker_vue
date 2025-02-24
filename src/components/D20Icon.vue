<template>
  <svg
    viewBox="0 0 100 100"
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    style="display: inline-block"
  >
    <defs>
      <linearGradient id="d20Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #4a9c7d; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #2e6b54; stop-opacity: 1" />
      </linearGradient>
    </defs>
    <polygon
      points="50,0 95,25 95,75 50,100 5,75 5,25"
      fill="url(#d20Gradient)"
      stroke="#193028"
      stroke-width="2"
    />
  </svg>
</template>

<script>
export default {
  name: 'D20Icon',
  props: {
    size: { type: Number, default: 24 },
  },
};
</script>