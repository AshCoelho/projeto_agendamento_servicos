<template>
  <main class="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 p-4 md:p-8">
    <v-form ref="meuFormulario" class="space-y-6">
      <!--/ SETOR / SERVIÇO -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="label">Serviço Desejado</label>
          <v-autocomplete
            v-model="form.servicoId"
            v-model:menu="menuServico"
            :items="servicos"
            item-title="nome"
            item-value="id"
            placeholder="Digite ou selecione o serviço"
            density="compact"
            variant="outlined"
            rounded="lg"
            clearable
            hide-no-data
            :rules="[regras.obrigatorio]"
            required
          />
        </div>

        <div>
          <label class="label">Setor</label>
          <v-select
            v-model="form.setorId"
            :items="setores"
            :item-title="formatarTextoSetor"
            item-value="id"
            :disabled="!form.servicoId"
            placeholder="Selecione o setor"
            density="compact"
            variant="outlined"
            rounded="lg"
            @update:model-value="aoSelecionarSetor"
            :rules="[regras.obrigatorio]"
            required
          />
        </div>
      </div>

      <!-- ENDEREÇO -->
      <div v-if="form.setorId && setores.length" class="mt-2 ml-1">
        <div v-for="s in [setores.find((x) => x.id === form.setorId)]" :key="s.id">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1">
            <span class="text-[11px] text-slate-600 italic">
              <i class="pi pi-map-marker mr-1 text-red-500"></i>
              {{ s.endereco.logradouro }}, {{ s.endereco.numero }} - {{ s.endereco.bairro }}
            </span>
            <a
              :href="gerarLinkMapa(s.endereco)"
              target="_blank"
              class="text-[11px] font-bold text-blue-700 hover:underline flex items-center"
            >
              Clique aqui para ver no Maps
              <i class="pi pi-external-link ml-1 text-[9px]"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- CALENDÁRIO -->
      <div v-if="form.servicoId" class="mt-8 pt-6 border-t border-slate-100">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <label class="label mb-4 block">Selecione a Data</label>
            <div class="calendar-wrapper">
              <v-date-picker
                v-model="form.data"
                :key="rawDias.length + (form.setorId || 0)"
                :allowed-dates="bloquearDatas"
                :day-class="classeDia"
                color="primary"
                flat
                full-width
                hide-header
                @update:model-value="buscarHorarios"
              />
              <p v-if="!form.data && tentouEnviar" class="text-red-500 text-xs mt-1">
                Selecione uma data
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- HORÁRIOS -->
      <div class="lg:col-span-5">
        <label class="label mb-4 block">Horários Disponíveis</label>
        <p v-if="!form.hora && tentouEnviar" class="text-red-500 text-xs mt-1">
          Selecione um horário
        </p>
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

          <!-- <div class="flex gap-4 justify-center text-xs mt-3">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-[#dcfce7] border border-green-300 rounded"></div>
              Muitas vagas
            </div>

            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-[#fef9c3] border border-yellow-300 rounded"></div>
              Poucas vagas
            </div>

            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-[#fee2e2] border border-red-300 rounded"></div>
              Sem vagas
            </div>
          </div> -->
        </div>
      </div>

      <!-- DADOS PESSOAIS -->
      <div v-if="form.hora" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
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
            maxlength="14"
            :rules="[regras.obrigatorio, regras.cpf]"
            @input="formatarCPF"
            density="compact"
            variant="outlined"
            rounded="lg"
          />
        </div>

        <div>
          <label class="label">Nascimento</label>
          <v-text-field
            v-model="form.dataNascimento"
            type="date"
            :rules="[regras.obrigatorio, regras.maioridade]"
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
            maxlength="15"
            :rules="[regras.obrigatorio, regras.celular]"
            @input="formatarCelular"
            density="compact"
            variant="outlined"
            rounded="lg"
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

      <!-- BOTÃO FINAL -->
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!form.servicoId || !form.setorId || !form.data || !form.hora"
        @click="agendar"
        class="w-full mt-8"
        height="56"
        rounded="xl"
      >
        Finalizar Agendamento
      </v-btn>
    </v-form>

    <!-- SNACKBAR -->
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
import api from '@/services/api'
import { watch } from 'vue'
import { nextTick } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoPrefeitura from '@/assets/brasao.png'

const loading = ref(false)
const tentouEnviar = ref(false)
const API_BASE = 'http://192.168.200.57:8080/api'
const disponibilidadeDias = ref(new Set())
const meuFormulario = ref(null)
const menuServico = ref(false)
const rawDias = ref([])


const regras = {
  // Versão corrigida: verifica se existe e só dá trim se for string
  obrigatorio: (v) => {
    if (v === null || v === undefined || String(v).trim() === '') return 'Campo obrigatório'
    return true
  },
  
  email: (v) => {
    if (!v) return 'E-mail é obrigatório'
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(v) || 'E-mail inválido'
  },

  cpf: (v) => {
    if (!v) return 'CPF é obrigatório'
    const cpfLimpo = v.replace(/\D/g, '')
    return validarCPF(cpfLimpo) || 'CPF inválido'
  },

  celular: (v) => (v && v.replace(/\D/g, '').length >= 10) || 'Telefone incompleto',

  maioridade: (v) => {
    if (!v) return 'Data de nascimento é obrigatória'
    const dataNasc = new Date(v)
    const hoje = new Date()
    let idade = hoje.getFullYear() - dataNasc.getFullYear()
    const mes = hoje.getMonth() - dataNasc.getMonth()

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--
    }

    return idade >= 18 || 'Você deve ter pelo menos 18 anos'
  },
}

const obterNomeServico = () =>
  servicos.value.find((s) => s.id === form.value.servicoId)?.nome || 'Não informado'
const obterNomeSetor = () =>
  setores.value.find((s) => s.id === form.value.setorId)?.nome || 'Não informado'

const gerarPDF = (dadosAgendamento) => {
  const doc = new jsPDF()
  const margin = 14

  // 1. Cabeçalho com Logo
  doc.addImage(logoPrefeitura, 'PNG', margin, 10, 14, 23)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('PREFEITURA MUNICIPAL DE SÃO LUÍS', 30, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text('Comprovante de Agendamento Eletrônico', 30, 24)

  // Linha divisória elegante
  doc.setDrawColor(220)
  doc.line(margin, 35, 196, 35)

  // 2. DESTAQUE DA SENHA (O mais importante)
  doc.setFillColor(245, 245, 245) // Fundo cinza bem clarinho
  doc.rect(margin, 40, 182, 20, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(50)
  doc.text('PROTOCOLO / SENHA', margin + 5, 48)
  doc.setFontSize(18)
  doc.setTextColor(0, 51, 102) // Azul escuro
  doc.text(dadosAgendamento.senha || 'N001', margin + 5, 56)

  // 3. INFORMAÇÕES DO AGENDAMENTO
  let y = 75
  doc.setFontSize(11)
  doc.setTextColor(0)

  // Coluna 1: O Que e Onde
  doc.setFont('helvetica', 'bold')
  doc.text('SERVIÇO:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(obterNomeServico(), margin + 25, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text('SETOR:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(obterNomeSetor(), margin + 25, y)

  y += 8
  // coluna dupla para Data e Hora
  doc.setFont('helvetica', 'bold')
  doc.text('DATA:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(
    form.value.data ? new Date(form.value.data).toLocaleDateString('pt-BR') : '',
    margin + 25,
    y,
  )

  doc.setFont('helvetica', 'bold')
  doc.text('HORÁRIO:', margin + 80, y)
  doc.setFont('helvetica', 'normal')
  doc.text(form.value.hora, margin + 105, y)

  // Divisória sutil
  y += 12
  doc.setDrawColor(240)
  doc.line(margin, y, 196, y)

  // 4. DADOS DO REQUERENTE
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('DADOS DO REQUERENTE', margin, y)

  y += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`NOME: ${form.value.nome.toUpperCase()}`, margin, y)
  y += 8
  doc.text(`CPF: ${form.value.cpf}`, margin, y)
  y += 8
  doc.text(`CONTATO: ${form.value.celular} | ${form.value.email}`, margin, y)

  y += 12
  doc.setDrawColor(240)
  doc.line(margin, y, 196, y)

  // AVISO!
  y += 6
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text(
    'Importante: Apresente este comprovante impresso ou no celular ao chegar no local.',
    14,
    y,
  )

  // 5. RODAPÉ
  doc.setFontSize(8)
  doc.setTextColor(150)
  const rodapeY = 280
  doc.text('Este documento é um comprovante oficial de agendamento.', margin, rodapeY)
  doc.text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, 196, rodapeY, { align: 'right' })

  doc.save(`Agendamento_${form.value.cpf.replace(/\D/g, '')}.pdf`)
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(9))) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.charAt(10))) return false

  return true
}

const form = ref({
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

function formatarCPF() {
  let v = form.value.cpf.replace(/\D/g, '') // Remove tudo que não é dígito
  if (v.length > 11) v = v.slice(0, 11) // Limita a 11 números

  v = v.replace(/(\d{3})(\d)/, '$1.$2') // Ponto após o 3º dígito
  v = v.replace(/(\d{3})(\d)/, '$1.$2') // Ponto após o 6º dígito
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Traço após o 9º dígito

  form.value.cpf = v
}

function formatarCelular() {
  let v = form.value.celular.replace(/\D/g, '') // Remove tudo que não é dígito
  if (v.length > 11) v = v.slice(0, 11) // Limita a 11 números

  v = v.replace(/^(\d{2})(\d)/g, '($1) $2') // Parênteses no DDD
  v = v.replace(/(\d{5})(\d)/, '$1-$2') // Traço após o 5º dígito do número

  form.value.celular = v
}

function mostrarMensagem(texto, tipo = 'success') {
  snackbar.value.text = texto
  snackbar.value.color = tipo === 'success' ? 'success' : 'error'
  snackbar.value.icon = tipo === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'
  snackbar.value.show = true
}

const setores = ref([])
const servicos = ref([])
const slots = ref([])
const configuracao = ref({})

//  Função para gerar o link do Google Maps
function gerarLinkMapa(endereco) {
  if (!endereco) return '#'

  // Se tiver coordenadas, usa o link direto por geolocalização (mais preciso)
  if (endereco.latitude && endereco.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${endereco.latitude},${endereco.longitude}`
  }

  //console.log("Endereço:",endereco.latitude)

  // Caso não tenha coordenadas, gera o link por busca de texto (fallback)
  const buscaTexto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buscaTexto)}`
}

function bloquearDatas(date) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const d = new Date(date)

  if (d < hoje) return false
  if (d.getDay() === 0) return false

  const iso = d.toISOString().split('T')[0]

  return disponibilidadeDias.value.has(iso)
}

function classeDia(date) {
  if (!rawDias.value || rawDias.value.length === 0) return ''

  // Converte o parâmetro 'date' (que pode ser Date, String ou Number) para um Date objeto
  const d = new Date(date)

  // Formata para YYYY-MM-DD (ex: 2026-04-20) de forma segura
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  const iso = `${ano}-${mes}-${dia}`

  // Procura o item no seu array (conforme o print do seu Preview)
  const item = rawDias.value.find((x) => x.data === iso)

  if (!item) return ''

  // Defina seus critérios de vagas aqui
  if (item.vagas === 0) return 'dia-sem-vaga'
  if (item.vagas > 0 && item.vagas <= 10) return 'dia-pouca-vaga'
  if (item.vagas > 10) return 'dia-muita-vaga'

  return ''
}

async function buscarDiasDisponiveis() {
  // 1. Verifica se o setorId existe
  if (!form.value.setorId) return

  // 2. Tenta pegar o ID da configuração de forma segura
  // Se configuracao for um Array vindo do banco, usamos [0]
  // Se for um objeto único, usamos apenas .id
  const config = configuracao.value
  const configId = Array.isArray(config) ? config[0]?.id : config?.id

  // Se não tiver o ID da configuração ainda, não faz a chamada
  if (!configId) {
    console.warn("Aguardando carregar configuração do setor...")
    return
  }

  try {
    // Usando a string de URL direta conforme sua preferência
    const res = await api.get(`/slots/datas-disponiveis?setorId=${form.value.setorId}&configuracaoId=${configId}`)
    
    const data = res.data

    rawDias.value = []
    await nextTick()
    rawDias.value = Array.isArray(data) ? data : []

    disponibilidadeDias.value = new Set(rawDias.value.map((d) => d.data))
  } catch (err) {
    console.error("Erro ao buscar datas:", err.response?.data || err.message)
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

async function carregarServicos() {
  try {
    // O Axios já entrega o objeto pronto em res.data
    const res = await api.get('/agendamento/api/servico/listar-todos')
    servicos.value = res.data 
  } catch (err) {
    // Se cair aqui, verifique se err.response existe
    console.error('Erro detalhado:', err.response || err)
  }
}

async function buscarSetoresPorServico() {
  if (!form.value.servicoId) return
  try {
    const res = await api.get(`/setores/por-servico/${form.value.servicoId}`)
    setores.value = res.data
    form.value.setorId = null
    limparHorarios()
  } catch (err) {
    console.error(err)
  }
}

async function getConfiguracaoBySetorId() {
  try {
    const res = await api.get(`/configuracoes-atendimento/setor/${form.value.setorId}`)
    configuracao.value = res.data
    //console.log(configuracao.value)
  } catch (e) {
    console.error(e)
  }
}

async function aoSelecionarSetor() {
  if (!form.value.setorId) return

  try {
    await getConfiguracaoBySetorId()
    await buscarDiasDisponiveis()
    limparHorarios()
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => form.value.servicoId,
  async (novoValor) => {
    if (!novoValor) {
      setores.value = []
      return
    }

    try {
      const res = await api.get(`/setores/por-servico/${novoValor}`)

      setores.value = res.data

      form.value.setorId = null
      limparHorarios()

      //  FECHA CORRETAMENTE
      await nextTick()
      menuServico.value = false
    } catch (err) {
      console.error(err)
    }
  },
)

function resetarFormulario() {
  form.value = {
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
}

async function buscarHorarios() {
  if (!form.value.data || !form.value.setorId) return

  form.value.hora = ''

  try {
    const dataFormatada = form.value.data.toISOString().split('T')[0]

    const res = await api.get(`/slots/horarios-disponiveis?setorId=${form.value.setorId}&data=${dataFormatada}`)

    // REMOVIDO: const data = await res.json()
    // NO AXIOS:
    const data = res.data

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
  tentouEnviar.value = true

  if (meuFormulario.value) {
    // Agora o validate() não vai mais dar erro de .trim()
    const { valid } = await meuFormulario.value.validate()
    const dataHoraValida = !!form.value.data && !!form.value.hora

    if (!valid || !dataHoraValida) {
      mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'error')
      return
    }
  }

  loading.value = true
  try {
    const payload = {
      ...form.value,
      // Garante que o CPF vá limpo
      cpf: form.value.cpf.replace(/\D/g, ''),
      celular: form.value.celular.replace(/\D/g, ''),
      // Garante que a data vá como String YYYY-MM-DD para o Spring
      data: form.value.data instanceof Date 
            ? form.value.data.toISOString().split('T')[0] 
            : form.value.data
    }

    const res = await api.post('/agendamentos/externo', payload)
    
    gerarPDF(res.data)
    mostrarMensagem(`Agendamento realizado! Senha: ${res.data.senha}`, 'success')

    setTimeout(() => {
      window.location.reload()
    }, 3000)
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || err.message
    mostrarMensagem('Erro: ' + msg, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(carregarServicos)
</script>

<style scoped>
/* Estiliza o botão interno do dia no calendário */
:deep(.dia-muita-vaga .v-btn) {
  background-color: #dcfce7 !important; /* Verde claro */
  color: #166534 !important;
  opacity: 1 !important;
}

:deep(.dia-pouca-vaga .v-btn) {
  background-color: #fef9c3 !important; /* Amarelo claro */
  color: #854d0e !important;
  opacity: 1 !important;
}

:deep(.dia-sem-vaga .v-btn) {
  background-color: #fee2e2 !important; /* Vermelho claro */
  color: #991b1b !important;
  opacity: 1 !important;
}

/* Mantém o destaque azul quando o usuário CLICAR em um dia */
:deep(.v-date-picker-month__day--selected .v-btn) {
  background-color: #1867c0 !important;
  color: white !important;
}
</style>
