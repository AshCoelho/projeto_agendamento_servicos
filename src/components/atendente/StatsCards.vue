<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div v-for="card in cards" :key="card.label" class="bg-white p-4 rounded-xl shadow-sm border-l-4" :class="card.color">
      <p class="text-xs text-gray-500 uppercase font-bold">{{ card.label }}</p>
      <h3 class="text-2xl font-bold">{{ card.value }}</h3>
    </div>
  </div>
</template>

<script setup>
defineProps(['stats']); // Recebe os dados do componente pai
const cards = [
  { label: 'Atendimentos Hoje', value: 12, color: 'border-blue-500' },
  { label: 'Pessoas na Fila', value: 5, color: 'border-orange-500' },
  { label: 'Em Guichê', value: 2, color: 'border-green-500' },
  { label: 'Finalizados', value: 10, color: 'border-purple-500' }
];
</script>