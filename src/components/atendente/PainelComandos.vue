<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <button @click="$emit('chamar', 'NORMAL')" class="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:bg-blue-700 font-bold text-xl">
      CHAMAR NORMAL
    </button>
    <button @click="$emit('chamar', 'PRIORIDADE')" class="bg-amber-500 text-white p-6 rounded-2xl shadow-lg hover:bg-amber-600 font-bold text-xl">
      CHAMAR PRIORIDADE
    </button>
  </div>
</template>