<template>
  <!-- Barra superior -->
  <div
    class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
  ></div>

  <div
    class="min-h-screen bg-slate-50 font-sans px-4 py-6 md:px-10 md:py-10 flex flex-col items-center"
  >
    <!-- HEADER -->
    <header class="text-center mb-8">
      <h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Agendamento Online</h1>

      <p class="text-slate-500 text-sm md:text-lg px-2">
        Escolha o serviço desejado e reserve seu horário de forma rápida e segura.
      </p>
    </header>

    <!-- STEPPER -->
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
        <span class="text-[10px] md:text-xs font-bold tracking-wider">SERVIÇO</span>
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
        <span class="text-[10px] md:text-xs font-bold tracking-wider">DADOS</span>
      </div>
    </div>

    <!-- CARD -->
    <main class="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-100 p-4 md:p-8">
      <!-- ETAPA 1 -->
      <div v-if="etapa === 1" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <!-- Secretaria -->
          <div>
            <label class="label">Secretaria</label>

            <v-select
              v-model="form.secretariaId"
              :items="secretarias"
              item-title="nome"
              item-value="id"
              placeholder="Selecione"
              density="compact"
              variant="solo"
              rounded="12"
              @update:model-value="buscarSetores"
            />
          </div>

          <!-- Setor -->
          <div>
            <label class="label">Setor</label>

            <v-select
              v-model="form.setorId"
              :items="setores"
              item-title="nome"
              item-value="id"
              :disabled="!form.secretariaId"
              placeholder="Selecione"
              density="compact"
              variant="solo"
              rounded="12"
              @update:model-value="buscarServicos"
            />
          </div>

          <!-- Serviço -->
          <div>
            <label class="label">Serviço</label>

            <v-select
              v-model="form.servicoId"
              :items="servicos"
              item-title="nome"
              item-value="id"
              :disabled="!form.setorId"
              placeholder="Selecione"
              density="compact"
              variant="solo"
              rounded="12"
              @update:model-value="limparHorarios"
            />
          </div>

          <!-- Data -->
          <div>
            <label class="label">Data</label>

            <v-text-field
              v-model="form.data"
              type="date"
              :disabled="!form.servicoId"
              density="compact"
              variant="solo"
              rounded="12"
              @change="buscarHorarios"
            />
          </div>
        </div>

        <!-- HORÁRIOS -->
        <div v-if="slots.length > 0" class="mt-6">
          <label class="label mb-3 block"> Horários Disponíveis </label>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            <button
              v-for="slot in slots"
              :key="slot.hora"
              @click="form.hora = slot.hora"
              :class="
                form.hora === slot.hora
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-slate-700'
              "
              class="py-2 md:py-3 rounded-xl text-xs font-bold transition"
            >
              {{ slot.hora }}
            </button>
          </div>
        </div>

        <v-btn
          color="primary"
          :disabled="!form.hora"
          @click="etapa = 2"
          class="w-full mt-6"
          height="48"
        >
          Continuar
        </v-btn>
      </div>

      <!-- ETAPA 2 -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div class="sm:col-span-2">
            <label class="label">Nome Completo</label>

            <v-text-field
              v-model="form.nome"
              placeholder="Digite seu nome"
              density="compact"
              variant="solo"
              rounded="12"
            />
          </div>

          <div>
            <label class="label">CPF</label>

            <v-text-field
              v-model="form.cpf"
              placeholder="000.000.000-00"
              density="compact"
              variant="solo"
              rounded="12"
            />
          </div>

          <div>
            <label class="label">Nascimento</label>

            <v-text-field
              v-model="form.dataNascimento"
              type="date"
              density="compact"
              variant="solo"
              rounded="12"
            />
          </div>

          <div>
            <label class="label">Celular</label>

            <v-text-field
              v-model="form.celular"
              placeholder="(00) 00000-0000"
              density="compact"
              variant="solo"
              rounded="12"
            />
          </div>

          <div>
            <label class="label">Email</label>

            <v-text-field v-model="form.email" density="compact" variant="solo" rounded="12" />
          </div>
        </div>

        <!-- BOTÕES -->
        <div class="flex flex-col md:flex-row gap-3 mt-6">
          <v-btn variant="outlined" @click="etapa = 1" class="flex-1" height="48"> Voltar </v-btn>

          <v-btn color="primary" :loading="loading" @click="agendar" class="flex-1" height="48">
            Finalizar
          </v-btn>
        </div>
      </div>

      <!-- INFO -->
      <div class="mt-8 pt-6 border-t border-slate-100 flex gap-3">
        <v-icon color="blue" size="small"> mdi-information-outline </v-icon>

        <p class="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
          Seus dados serão utilizados exclusivamente para gestão do agendamento.
        </p>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="text-center mt-6 text-slate-500 text-xs">
      <p class="font-bold text-gray-400 uppercase">© 2026 Prefeitura de São Luís</p>

      <p class="font-black text-blue-700 uppercase mt-1">
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
.label {
  @apply block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1;
}
</style>
