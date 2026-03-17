<template>
  <main class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:p-8">
    <div v-if="etapa === 1" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="label">Selecione a Secretaria</label>
          <v-select
            v-model="form.secretariaId"
            :items="secretarias"
            item-title="nome"
            item-value="id"
            placeholder="Selecione a secretaria"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
            @update:model-value="buscarSetores"
          />
        </div>

        <div>
          <label class="label">Setor</label>
          <v-select
            v-model="form.setorId"
            :items="setores"
            :item-title="formatarTextoSetor"
            item-value="id"
            :disabled="!form.secretariaId"
            placeholder="Selecione o setor"
            density="compact"
            variant="outlined"
            rounded="lg"
            @update:model-value="buscarServicos"
          />
        </div>

        <div>
          <label class="label">Serviço Desejado</label>
          <v-select
            v-model="form.servicoId"
            :items="servicos"
            item-title="nome"
            item-value="id"
            :disabled="!form.setorId"
            placeholder="Selecione o serviço"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
            @update:model-value="limparHorarios"
          />
        </div>
      </div>

      <div v-if="form.setorId && setores.length" class="mt-2 ml-1">
        <p
          v-for="s in [setores.find((x) => x.id === form.setorId)]"
          :key="s.id"
          class="text-[11px] text-blue-700 italic"
        >
          <i class="pi pi-map-marker mr-1"></i>
          {{ s.endereco.logradouro }}, {{ s.endereco.numero }} - {{ s.endereco.bairro }},
          {{ s.endereco.cidade }}/{{ s.endereco.uf }}
        </p>
      </div>

      <div v-if="form.servicoId" class="mt-8 pt-6 border-t border-slate-100">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <label class="label mb-4 block">Selecione a Data</label>
            <div class="calendar-wrapper">
              <v-date-picker
                v-model="form.data"
                :allowed-dates="bloquearDatas"
                :day-class="classeDia"
                color="primary"
                flat
                full-width
                hide-header
                @update:model-value="buscarHorarios"
              ></v-date-picker>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5">
        <label class="label mb-4 block">Horários Disponíveis</label>

        <div
          v-if="form.data && slots.length > 0"
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          <button
            v-for="slot in slots"
            :key="slot.hora"
            @click="form.hora = slot.hora"
            :class="[
              'py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all duration-200',
              form.hora === slot.hora
                ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                : 'bg-white text-blue-600 border-blue-100 hover:border-blue-400 hover:bg-blue-50',
            ]"
          >
            {{ slot.hora }}
          </button>
        </div>

        <div v-else-if="form.data" class="empty-state">
          <i class="pi pi-calendar-times text-2xl mb-2"></i>
          <p class="text-xs font-medium">Sem horários para esta data</p>
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-calendar text-2xl mb-2"></i>
          <p class="text-xs font-medium text-center px-4">Selecione uma data no calendário</p>
          <div class="flex gap-4 text-xs mt-3">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-green-200 rounded"></div>
              Muitas vagas
            </div>

            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-yellow-200 rounded"></div>
              Poucas vagas
            </div>

            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-red-200 rounded"></div>
              Sem vagas
            </div>
          </div>
        </div>
      </div>

      <v-btn
        color="primary"
        :disabled="!form.hora"
        @click="etapa = 2"
        class="w-full mt-8"
        height="56"
        rounded="xl"
      >
        Continuar
      </v-btn>
    </div>

    <v-form ref="meuFormulario" v-else class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="label">Nome Completo</label>
          <v-text-field
            v-model="form.nome"
            placeholder="Digite seu nome"
            :rules="[regras.obrigatorio]"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
          />
        </div>
        <div>
          <label class="label">CPF</label>
          <v-text-field
            v-model="form.cpf"
            placeholder="000.000.000-00"
            :rules="[regras.obrigatorio, regras.cpf]"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
          />
        </div>
        <div>
          <label class="label">Nascimento</label>
          <v-text-field
            v-model="form.dataNascimento"
            type="date"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
          />
        </div>
        <div>
          <label class="label">Celular (WhatsApp)</label>
          <v-text-field
            v-model="form.celular"
            placeholder="(00) 00000-0000"
            :rules="[regras.obrigatorio, regras.celular]"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
          />
        </div>
        <div>
          <label class="label">E-mail (obrigatório)</label>
          <v-text-field
            v-model="form.email"
            type="email"
            :rules="[regras.obrigatorio, regras.email]"
            density="compact"
            variant="outlined"
            rounded="lg"
            flat
            border
          />
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-3 mt-6">
        <v-btn variant="outlined" @click="etapa = 1" class="flex-1" height="48" rounded="xl">
          Voltar
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="agendar"
          class="flex-1"
          height="48"
          rounded="xl"
        >
          Finalizar
        </v-btn>
      </div>
    </v-form>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="5000"
      rounded="pill"
      elevation="24"
    >
      <div class="flex items-center gap-3">
        <i :class="snackbar.icon" class="text-xl"></i>
        <span class="font-medium">{{ snackbar.text }}</span>
      </div>

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'primeicons/primeicons.css'

const etapa = ref(1)
const loading = ref(false)
const API_BASE = 'http://localhost:8080'
const disponibilidadeDias = ref({})
const meuFormulario = ref(null)

const regras = {
  obrigatorio: (v) => !!v || 'Campo obrigatório',
  email: (v) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(v) || 'E-mail inválido'
  },
  cpf: (v) => (v && v.length >= 11) || 'CPF incompleto',
  celular: (v) => (v && v.length >= 10) || 'Telefone incompleto',
}

const form = ref({
  secretariaId: null,
  setorId: null,
  servicoId: null,
  data: null,
  hora: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  celular: '',
  email: '',
  tipoAtendimento: 'NORMAL',
})
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'pi pi-check-circle',
})

function mostrarMensagem(texto, tipo = 'success') {
  snackbar.value.text = texto
  snackbar.value.color = tipo === 'success' ? 'green-darken-2' : 'red-darken-2'
  snackbar.value.icon = tipo === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'
  snackbar.value.show = true
}

const secretarias = ref([])
const setores = ref([])
const servicos = ref([])
const slots = ref([])
const configuracao = ref({})

async function carregarSecretarias() {
  try {
    const res = await fetch(`${API_BASE}/secretarias`)
    secretarias.value = await res.json()
  } catch (err) {
    console.error('Erro ao carregar secretarias:', err)
  }
}

function bloquearDatas(date) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const d = new Date(date)

  if (d < hoje) return false
  if (d.getDay() === 0) return false

  const iso = d.toISOString().split('T')[0]

  return disponibilidadeDias.value.includes(iso)
}

function classeDia(date) {
  const iso = new Date(date).toISOString().split('T')[0]

  const vagas = disponibilidadeDias.value[iso]

  if (vagas === undefined) return ''

  if (vagas === 0) return 'dia-sem-vaga'

  if (vagas <= 3) return 'dia-pouca-vaga'

  return 'dia-muita-vaga'
}

async function buscarDiasDisponiveis() {
  if (!form.value.setorId) return

  try {
    const res = await fetch(
      `${API_BASE}/api/slots/datas-disponiveis?setorId=${form.value.setorId}&configuracaoId=${configuracao.value[0].id}`,
    )

    const data = await res.json()
    console.log('DATAS ', data)
    disponibilidadeDias.value = data
    console.log(disponibilidadeDias)
    // disponibilidadeDias.value = {}

    // data.forEach((d) => {
    //   disponibilidadeDias.value[d.data] = d.vagas
    // })
  } catch (err) {
    console.error(err)
  }
}

async function buscarSetores() {
  if (!form.value.secretariaId) return
  try {
    const res = await fetch(`${API_BASE}/setores/por-secretaria/${form.value.secretariaId}`)
    setores.value = await res.json()
    form.value.setorId = null
    form.value.servicoId = null
    limparHorarios()
  } catch (err) {
    console.error(err)
  }
}

function formatarTextoEndereco(item) {
  if (!item) return ''

  const nome = item.nome
  const e = item.endereco

  // Se não houver endereço, retorna apenas o nome
  if (!e || !e.logradouro) return nome

  // Monta: Setor X - Rua das Graças, 100, Bairro
  const rua = e.logradouro
  const num = e.numero ? `, ${e.numero}` : ' - S/N'
  const bairro = e.bairro ? ` - ${e.bairro}` : ''

  return `${nome} (${rua}${num}${bairro})`
}

function formatarTextoSetor(item) {
  if (!item) return ''
  const bairro = item.endereco?.bairro
  return bairro ? `${item.nome} - ${bairro}` : item.nome
}

async function buscarServicos() {
  if (!form.value.setorId) return

  try {
    await getConfiguracaoBySetorId()
    const res = await fetch(`${API_BASE}/agendamento/api/servico/setor/${form.value.setorId}`)
    servicos.value = await res.json()
    form.value.servicoId = null
    limparHorarios()
    await buscarDiasDisponiveis()
  } catch (err) {
    console.error(err)
  }
}

async function getConfiguracaoBySetorId() {
  try {
    const res = await fetch(`${API_BASE}/api/configuracoes-atendimento/setor/${form.value.setorId}`)
    configuracao.value = await res.json()
    console.log(configuracao.value)
  } catch (e) {
    console.error(e)
  }
}

function resetarFormulario() {
  form.value = {
    secretariaId: null,
    setorId: null,
    servicoId: null,
    data: null,
    hora: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    celular: '',
    email: '',
    tipoAtendimento: 'NORMAL',
  }

  slots.value = []
  setores.value = []
  servicos.value = []

  etapa.value = 1
}

async function buscarHorarios() {
  if (!form.value.data || !form.value.setorId) return

  form.value.hora = ''

  try {
    const dataFormatada = form.value.data.toISOString().split('T')[0]

    const res = await fetch(
      `${API_BASE}/api/slots/horarios-disponiveis?setorId=${form.value.setorId}&data=${dataFormatada}`,
    )
    const data = await res.json()

    const agora = new Date()
    const hojeIso = agora.toISOString().split('T')[0]
    const horaAtualStr = agora.toTimeString().slice(0, 5)

    slots.value = data
      .filter((s) => s.vagasDisponiveis > 0)
      .map((s) => ({
        ...s,
        hora: s.hora.slice(0, 5),
      }))
      .filter((s) => {
        if (dataFormatada === hojeIso) {
          return s.hora > horaAtualStr
        }

        return true
      })
  } catch (err) {
    console.error(err)
  }
}

function limparHorarios() {
  slots.value = []
  form.value.hora = ''
  form.value.data = null
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

    // Feedback elegante
    mostrarMensagem(`Agendamento realizado! Senha: ${result.senha}`, 'success')

    // Limpa os dados e volta para a etapa 1
    resetarFormulario()
  } catch (err) {
    mostrarMensagem('Erro: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(carregarSecretarias)
</script>
