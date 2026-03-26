<template>
  <div
    class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
  ></div>

  <div
    class="min-h-screen bg-slate-50 font-sans px-4 py-6 md:px-10 md:py-10 flex flex-col items-center"
  >
    <header class="text-center mb-8">
      <div class="flex justify-center">
        <img
          src="../assets/brasao.png"
          alt="Prefeitura"
          class="text-center h-8 md:h-12 object-contain"
        />
      </div>

      <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Agendamento Online</h1>
      <p class="text-slate-500 text-sm md:text-lg px-2">
        Escolha o serviço desejado e reserve seu horário de forma rápida e segura.
      </p>
    </header>

    <div class="flex items-center justify-center gap-4 md:gap-8 mb-8 flex-wrap">
      <div
        class="flex flex-col items-center space-y-1"
        :class="etapa === 1 ? 'text-blue-600' : 'text-slate-300'"
      >
        <div
          class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-lg transition-colors"
          :class="etapa === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'"
        >
          <i class="pi pi-briefcase"></i>
        </div>
        <span class="text-[10px] md:text-xs font-bold tracking-wider uppercase">Serviço</span>
      </div>
      <div class="w-10 md:w-20 h-[2px] bg-slate-200"></div>
      <div
        class="flex flex-col items-center space-y-1"
        :class="etapa === 2 ? 'text-blue-600' : 'text-slate-300'"
      >
        <div
          class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-lg transition-colors"
          :class="etapa === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'"
        >
          <i class="pi pi-user"></i>
        </div>
        <span class="text-[10px] md:text-xs font-bold tracking-wider uppercase">Dados</span>
      </div>
    </div>

    <AgendamentoExt></AgendamentoExt>

    <footer class="text-center mt-8 text-slate-500 text-xs">
      <p class="font-bold text-gray-400 uppercase tracking-widest">© 2026 Prefeitura de São Luís</p>
      <p class="font-black text-blue-700 uppercase mt-1">
        Secretaria Municipal de Tecnologia da Informação
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'primeicons/primeicons.css'
import AgendamentoExt from '@/components/AgendamentoExt.vue'

const etapa = ref(1)
const API_BASE = 'http://192.168.200.63:8080'

const secretarias = ref([])

async function carregarSecretarias() {
  try {
    const res = await fetch(`${API_BASE}/secretarias`)
    secretarias.value = await res.json()
  } catch (err) {
    console.error('Erro ao carregar secretarias:', err)
  }
}

onMounted(carregarSecretarias)
</script>

<style scoped>
.label {
  @apply block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider;
}

.calendar-wrapper {
  @apply border border-slate-200 rounded-2xl p-2 bg-slate-50/50 overflow-hidden;
}

.empty-state {
  @apply flex flex-col items-center justify-center h-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400;
}

:deep(.dia-muita-vaga) {
  background: #dcfce7 !important;
}

:deep(.dia-pouca-vaga) {
  background: #fef9c3 !important;
}

:deep(.dia-sem-vaga) {
  background: #fee2e2 !important;
}

/* Customização profunda do v-date-picker */
:deep(.v-date-picker) {
  width: 100% !important;
  background: transparent !important;
}

:deep(.v-date-picker-month__day .v-btn) {
  border-radius: 12px !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 0.875rem !important;
}

:deep(.v-date-picker-month__day--selected .v-btn) {
  background-color: #2563eb !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}

:deep(.v-date-picker-controls) {
  padding-inline-start: 0 !important;
  padding-inline-end: 0 !important;
}
</style>
