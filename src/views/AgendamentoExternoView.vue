<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6 md:p-12 flex flex-col items-center">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-slate-900 mb-2">Agendamento Online</h1>
      <p class="text-slate-500 text-lg">
        Escolha o serviço desejado e reserve seu horário de forma rápida e segura.
      </p>
    </header>

    <div class="flex items-center space-x-4 mb-8">
      <div
        class="flex flex-col items-center space-y-2"
        :class="etapa === 1 ? 'text-blue-600' : 'text-slate-300'"
      >
        <div
          class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors"
          :class="etapa === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'"
        >
          <i class="pi pi-briefcase"></i>
        </div>
        <span class="text-xs font-bold tracking-wider">SERVIÇO</span>
      </div>

      <div class="w-20 h-0.5 bg-slate-200 mb-6"></div>

      <div
        class="flex flex-col items-center space-y-2"
        :class="etapa === 2 ? 'text-blue-600' : 'text-slate-300'"
      >
        <div
          class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-colors"
          :class="etapa === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'"
        >
          <i class="pi pi-user"></i>
        </div>
        <span class="text-xs font-bold tracking-wider">DADOS PESSOAIS</span>
      </div>
    </div>

    <main
      class="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12"
    >
      <div v-if="etapa === 1" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i class="pi pi-map-marker text-blue-600"></i> Secretaria
            </label>
            <select v-model="form.secretariaId" @change="buscarSetores" class="input-field">
              <option value="">Selecione a Secretaria</option>
              <option v-for="s in secretarias" :key="s.id" :value="s.id">{{ s.nome }}</option>
            </select>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i class="pi pi-building text-blue-600"></i> Setor
            </label>
            <select
              v-model="form.setorId"
              :disabled="!form.secretariaId"
              @change="buscarServicos"
              class="input-field"
            >
              <option value="">Selecione o Setor</option>
              <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
            </select>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i class="pi pi-clock text-blue-600"></i> Serviço
            </label>
            <select
              v-model="form.servicoId"
              :disabled="!form.setorId"
              @change="limparHorarios"
              class="input-field"
            >
              <option value="">Selecione o Serviço</option>
              <option v-for="s in servicos" :key="s.id" :value="s.id">{{ s.nome }}</option>
            </select>
          </div>

          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i class="pi pi-calendar text-blue-600"></i> Data do Agendamento
            </label>
            <input
              type="date"
              v-model="form.data"
              :disabled="!form.servicoId"
              @change="buscarHorarios"
              class="input-field"
            />
          </div>
        </div>

        <div v-if="slots.length > 0" class="mt-8">
          <label class="text-sm font-semibold text-slate-700 block mb-4"
            >Horários Disponíveis</label
          >
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <button
              v-for="slot in slots"
              :key="slot.hora"
              type="button"
              @click="form.hora = slot.hora"
              :class="
                form.hora === slot.hora
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              "
              class="py-3 border rounded-xl text-sm font-medium transition-all"
            >
              {{ slot.hora }}
            </button>
          </div>
        </div>

        <button @click="etapa = 2" :disabled="!form.hora" class="btn-submit mt-8">
          Continuar para Dados Pessoais <i class="pi pi-angle-right"></i>
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col space-y-2 md:col-span-2">
            <label class="text-sm font-semibold text-slate-700">Nome Completo</label>
            <input
              type="text"
              v-model="form.nome"
              placeholder="Digite seu nome"
              class="input-field"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700">CPF</label>
            <input
              type="text"
              v-model="form.cpf"
              placeholder="000.000.000-00"
              class="input-field"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700">Data de Nascimento</label>
            <input type="date" v-model="form.dataNascimento" class="input-field" />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700">Celular</label>
            <input
              type="text"
              v-model="form.celular"
              placeholder="(00) 00000-0000"
              class="input-field"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              v-model="form.email"
              placeholder="seu@email.com"
              class="input-field"
            />
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <button
            @click="etapa = 1"
            class="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Voltar
          </button>
          <button @click="agendar" :disabled="loading" class="btn-submit flex-[2] mt-0">
            {{ loading ? 'Processando...' : 'Finalizar Agendamento' }}
          </button>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-slate-100 flex gap-3">
        <i class="pi pi-info-circle text-blue-500 mt-1"></i>
        <p class="text-xs text-slate-400 leading-relaxed">
          Ao clicar em finalizar, você concorda com nossos termos de uso e política de privacidade.
          Seus dados serão utilizados exclusivamente para a gestão do agendamento público
          solicitado.
        </p>
      </div>
    </main>

    <footer class="text-center mt-8 text-slate-500 text-sm">
      <p class="text-[9px] font-bold text-gray-400 uppercase">© 2026 Prefeitura de São Luís</p>
      <p class="text-[9px] font-black text-blue-700 uppercase mt-1">
        Secretaria Municipal de Tecnologia da Informação
      </p>
    </footer>
  </div>
</template>

<script setup>
/* Lógica do Script permanece a mesma da versão anterior, garantindo funcionalidade */
import { ref, onMounted } from 'vue'
import 'primeicons/primeicons.css'

const etapa = ref(1)
const form = ref({
  secretariaId: '',
  setorId: '',
  servicoId: '',
  data: '',
  hora: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  celular: '',
  email: '',
  tipoAtendimento: 'NORMAL',
})

const secretarias = ref([])
const setores = ref([])
const servicos = ref([])
const slots = ref([])
const loading = ref(false)
const API_BASE = 'http://localhost:8080'

// Métodos (Mantendo integração com seu backend)
async function carregarSecretarias() {
  const res = await fetch(`${API_BASE}/secretarias`)
  secretarias.value = await res.json()
}
async function buscarSetores() {
  form.value.setorId = ''
  form.value.servicoId = ''
  form.value.data = ''
  limparHorarios()
  if (!form.value.secretariaId) return
  const res = await fetch(`${API_BASE}/setores/por-secretaria/${form.value.secretariaId}`)
  setores.value = await res.json()
}
async function buscarServicos() {
  form.value.servicoId = ''
  form.value.data = ''
  limparHorarios()
  if (!form.value.setorId) return
  const res = await fetch(`${API_BASE}/agendamento/api/servico/setor/${form.value.setorId}`)
  servicos.value = await res.json()
}
function limparHorarios() {
  slots.value = []
  form.value.hora = ''
}
async function buscarHorarios() {
  limparHorarios()
  if (!form.value.data || !form.value.setorId) return
  const res = await fetch(
    `${API_BASE}/api/slots/horarios-disponiveis?setorId=${form.value.setorId}&data=${form.value.data}`,
  )
  const data = await res.json()
  slots.value = data.filter((s) => s.vagasDisponiveis > 0)
}
async function agendar() {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/agendamentos/externo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!response.ok) throw new Error(await response.text())
    const result = await response.json()
    alert('✅ Agendamento realizado! Senha: ' + result.senha)
  } catch (err) {
    alert('❌ Erro: ' + err.message)
  } finally {
    loading.value = false
  }
}
onMounted(carregarSecretarias)
</script>

<style scoped>
/* Utilizando @apply do Tailwind para componentes repetitivos */
.input-field {
  @apply w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-700 transition-all focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:cursor-not-allowed;
}

.btn-submit {
  @apply w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-blue-200 disabled:shadow-none;
}
</style>
