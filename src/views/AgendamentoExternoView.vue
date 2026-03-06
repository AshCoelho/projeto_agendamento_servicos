<template>
  <div
    class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
  ></div>
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
          class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl transition-colors"
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
          class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl transition-colors"
          :class="etapa === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-current'"
        >
          <i class="pi pi-user"></i>
        </div>
        <span class="text-xs font-bold tracking-wider">DADOS PESSOAIS</span>
      </div>
    </div>

    <main
      class="w-full max-w-4xl bg-white rounded-[12px] shadow-2xl border border-slate-100 p-8 md:p-12"
    >
      <div v-if="etapa === 1" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
              <i class="pi pi-map-marker text-blue-600 mr-1"></i> Secretaria
            </label>
            <v-select
              v-model="form.secretariaId"
              :items="secretarias"
              item-title="nome"
              item-value="id"
              placeholder="Selecione a Secretaria"
              density="compact"
              rounded="12px"
              variant="solo"
              class="w-full text-xs font-bold"
              @update:model-value="buscarSetores"
              required
            ></v-select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
              <i class="pi pi-building text-blue-600 mr-1"></i> Setor
            </label>
            <v-select
              v-model="form.setorId"
              :items="setores"
              item-title="nome"
              item-value="id"
              :disabled="!form.secretariaId"
              placeholder="Selecione o Setor"
              density="compact"
              rounded="12px"
              variant="solo"
              class="w-full text-xs font-bold"
              @update:model-value="buscarServicos"
              required
            ></v-select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
              <i class="pi pi-clock text-blue-600 mr-1"></i> Serviço
            </label>
            <v-select
              v-model="form.servicoId"
              :items="servicos"
              item-title="nome"
              item-value="id"
              :disabled="!form.setorId"
              placeholder="Selecione o Serviço"
              density="compact"
              rounded="12px"
              variant="solo"
              class="w-full text-xs font-bold"
              @update:model-value="limparHorarios"
              required
            ></v-select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
              <i class="pi pi-calendar text-blue-600 mr-1"></i> Data do Agendamento
            </label>
            <v-text-field
              v-model="form.data"
              type="date"
              :disabled="!form.servicoId"
              density="compact"
              rounded="12px"
              variant="solo"
              class="w-full text-xs font-bold"
              @change="buscarHorarios"
              required
            ></v-text-field>
          </div>
        </div>

        <div v-if="slots.length > 0" class="mt-8">
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-4 ml-1"
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
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              "
              class="py-3 rounded-[12px] text-xs font-black uppercase transition-all shadow-sm"
            >
              {{ slot.hora }}
            </button>
          </div>
        </div>

        <v-btn
          color="primary"
          :disabled="!form.hora"
          @click="etapa = 2"
          class="text-capitalize w-100 mt-6"
          height="48"
        >
          Continuar para Dados Pessoais
          <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
              >Nome Completo</label
            >
            <v-text-field
              v-model="form.nome"
              placeholder="Digite seu nome"
              density="compact"
              rounded="12px"
              variant="solo"
              class="text-xs font-bold"
            ></v-text-field>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
              >CPF</label
            >
            <v-text-field
              v-model="form.cpf"
              placeholder="000.000.000-00"
              density="compact"
              rounded="12px"
              variant="solo"
              class="text-xs font-bold"
            ></v-text-field>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
              >Data de Nascimento</label
            >
            <v-text-field
              v-model="form.dataNascimento"
              type="date"
              density="compact"
              rounded="12px"
              variant="solo"
              class="text-xs font-bold"
            ></v-text-field>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
              >Celular</label
            >
            <v-text-field
              v-model="form.celular"
              placeholder="(00) 00000-0000"
              density="compact"
              rounded="12px"
              variant="solo"
              class="text-xs font-bold"
            ></v-text-field>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
              >Email</label
            >
            <v-text-field
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              density="compact"
              rounded="12px"
              variant="solo"
              class="text-xs font-bold"
            ></v-text-field>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <v-btn
            variant="outlined"
            @click="etapa = 1"
            class="text-capitalize flex-1"
            height="48"
            style="border-radius: 12px"
          >
            Voltar
          </v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            @click="agendar"
            class="text-capitalize flex-[2]"
            height="48"
            style="border-radius: 15px"
          >
            Finalizar Agendamento
          </v-btn>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-slate-100 flex gap-3">
        <v-icon color="blue" size="small">mdi-information-outline</v-icon>
        <p class="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
          Ao clicar em finalizar, você concorda com nossos termos de uso. Seus dados serão
          utilizados exclusivamente para a gestão do agendamento solicitado.
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
import { ref, onMounted } from 'vue'
import 'primeicons/primeicons.css'

const etapa = ref(1)
const loading = ref(false)
const API_BASE = 'http://localhost:8080'

// Estado do Formulário
const form = ref({
  secretariaId: null,
  setorId: null,
  servicoId: null,
  data: '',
  hora: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  celular: '',
  email: '',
  tipoAtendimento: 'NORMAL',
})

// Listas de Dados
const secretarias = ref([])
const setores = ref([])
const servicos = ref([])
const slots = ref([])

// 1. Carrega as Secretarias (Executa no onMounted)
async function carregarSecretarias() {
  try {
    const res = await fetch(`${API_BASE}/secretarias`)
    secretarias.value = await res.json()
  } catch (err) {
    console.error('Erro ao carregar secretarias:', err)
  }
}

// 2. Busca Setores baseado na Secretaria (Chamado no @update:model-value da Secretaria)
async function buscarSetores() {
  if (!form.value.secretariaId) return

  try {
    const res = await fetch(`${API_BASE}/setores/por-secretaria/${form.value.secretariaId}`)
    if (!res.ok) throw new Error('Falha ao buscar setores')
    setores.value = await res.json()

    // Limpa campos filhos para manter integridade
    form.value.setorId = null
    form.value.servicoId = null
  } catch (err) {
    console.error('Erro ao buscar setores:', err)
  }
}

// 3. Busca Serviços baseado no Setor (Chamado no @update:model-value do Setor)
async function buscarServicos() {
  if (!form.value.setorId) return

  try {
    // Note que usamos o mesmo padrão de rota da sua API
    const res = await fetch(`${API_BASE}/agendamento/api/servico/setor/${form.value.setorId}`)
    if (!res.ok) throw new Error('Falha ao buscar serviços')
    servicos.value = await res.json()

    form.value.servicoId = null
    limparHorarios()
  } catch (err) {
    console.error('Erro ao buscar serviços:', err)
  }
}

// 4. Busca Horários Disponíveis
async function buscarHorarios() {
  limparHorarios()
  if (!form.value.data || !form.value.setorId) return

  try {
    const res = await fetch(
      `${API_BASE}/api/slots/horarios-disponiveis?setorId=${form.value.setorId}&data=${form.value.data}`,
    )
    const data = await res.json()
    // Filtra apenas slots com vagas > 0
    slots.value = data.filter((s) => s.vagasDisponiveis > 0)
  } catch (err) {
    console.error('Erro ao buscar horários:', err)
  }
}

function limparHorarios() {
  slots.value = []
  form.value.hora = ''
}

// 5. Finaliza o Agendamento
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

    // Opcional: Resetar o formulário ou redirecionar
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
