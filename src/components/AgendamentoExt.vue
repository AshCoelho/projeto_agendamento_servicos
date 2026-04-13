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
                :allowed-dates="bloquearDatas"
                :day-class="classeDia"
                color="primary"
                flat
                full-width
                hide-header
                @update:model-value="buscarHorarios"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- HORÁRIOS -->
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
          <p class="text-xs font-medium text-center px-4">
            Selecione uma data no calendário
          </p>

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
        :disabled="!form.hora"
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoPrefeitura from '@/assets/brasao.png'

const loading = ref(false)
const API_BASE = 'http://192.168.200.57:8080/api'
const disponibilidadeDias = ref(new Set())
const meuFormulario = ref(null)
const menuServico = ref(false)
const rawDias = ref([])

const regras = {
 obrigatorio: (v) => (v && v.trim().length > 0) || 'Campo obrigatório',
  email: (v) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(v) || 'E-mail inválido'
  },
  cpf: (v) => {
    if (!v) return 'CPF é obrigatório'
    const cpfLimpo = v.replace(/\D/g, '')
    return validarCPF(cpfLimpo) || 'CPF inválido'
  },
  celular: (v) => (v && v.length >= 10) || 'Telefone incompleto',

  maioridade: (v) => {
    if (!v) return 'Data de nascimento é obrigatória'
    const dataNasc = new Date(v)
    const hoje = new Date()
    let idade = hoje.getFullYear() - dataNasc.getFullYear()
    const mes = hoje.getMonth() - dataNasc.getMonth()

    // Ajusta a idade se ainda não fez aniversário no ano corrente
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--
    }

    return idade >= 18 || 'Você deve ter pelo menos 18 anos'
  },
}

const obterNomeServico = () => servicos.value.find(s => s.id === form.value.servicoId)?.nome || 'Não informado';
const obterNomeSetor = () => setores.value.find(s => s.id === form.value.setorId)?.nome || 'Não informado';

const gerarPDF = (dadosAgendamento) => {
  const doc = new jsPDF();

  // 1. Adiciona a Logo (O Vite resolve o caminho automaticamente)
  // imagem, formato, x, y, largura, altura
  doc.addImage(logoPrefeitura, 'PNG', 14, 10, 25, 25);

  // 2. Cabeçalho (ao lado da logo)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PREFEITURA MUNICIPAL", 45, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Comprovante de Agendamento Eletrônico", 45, 26);
  
  doc.setDrawColor(200);
  doc.line(14, 38, 196, 38); // Linha divisória

  // 3. Bloco de Dados
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO AGENDAMENTO", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  // Montamos o corpo do texto
  const yInicial = 60;
  const espacamento = 8;
  
  const informacoes = [
    `PROTOCOLO/SENHA: ${dadosAgendamento.senha || '---'}`,
    `SERVIÇO: ${obterNomeServico()}`,
    `SETOR: ${obterNomeSetor()}`,
    `DATA: ${form.value.data ? new Date(form.value.data).toLocaleDateString('pt-BR') : ''}`,
    `HORÁRIO: ${form.value.hora}`,
    `------------------------------------------------------------`,
    `NOME: ${form.value.nome.toUpperCase()}`,
    `CPF: ${form.value.cpf}`,
    `CELULAR: ${form.value.celular}`,
    `E-MAIL: ${form.value.email}`
  ];

  informacoes.forEach((linha, index) => {
    doc.text(linha, 14, yInicial + (index * espacamento));
  });

  // 4. Rodapé simples
  const yRodape = yInicial + (informacoes.length * espacamento) + 10;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Apresente este comprovante impresso ou no celular ao chegar no local.", 14, yRodape);
  doc.text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, 14, yRodape + 5);

  // 5. Baixar
  doc.save(`Agendamento_${form.value.cpf.replace(/\D/g, '')}.pdf`);
};

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
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
  snackbar.value.color = tipo === 'success' ? 'green-darken-2' : 'red-darken-2'
  snackbar.value.icon = tipo === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'
  snackbar.value.show = true
}

const setores = ref([])
const servicos = ref([])
const slots = ref([])
const configuracao = ref({})

// 🟢 Função para gerar o link do Google Maps
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
  const iso = new Date(date).toISOString().split('T')[0]

  const item = rawDias.value.find(d => d.data === iso)

  if (!item) return ''

  if (item.vagas === 0) return 'dia-sem-vaga'
  if (item.vagas <= 10) return 'dia-pouca-vaga'

  return 'dia-muita-vaga'
}

async function buscarDiasDisponiveis() {
  if (!form.value.setorId) return

  try {
    const res = await fetch(
      `${API_BASE}/slots/datas-disponiveis?setorId=${form.value.setorId}&configuracaoId=${configuracao.value[0].id}`,
    )

    const data = await res.json()

    console.log('DATAS', data)

    rawDias.value = Array.isArray(data) ? data : []

    disponibilidadeDias.value = new Set(
      rawDias.value.map(d => d.data)
    )

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

async function carregarServicos() {
  try {
    const res = await fetch(`${API_BASE}/agendamento/api/servico/listar-todos`)
    servicos.value = await res.json()
  } catch (err) {
    console.error('Erro ao carregar serviços:', err)
  }
}

async function buscarSetoresPorServico() {
  if (!form.value.servicoId) return

  try {
    const res = await fetch(
      `${API_BASE}/setores/por-servico/${form.value.servicoId}`
    )

    setores.value = await res.json()

    form.value.setorId = null
    limparHorarios()
  } catch (err) {
    console.error(err)
  }
}

async function getConfiguracaoBySetorId() {
  try {
    const res = await fetch(`${API_BASE}/configuracoes-atendimento/setor/${form.value.setorId}`)
    configuracao.value = await res.json()
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

watch(() => form.value.servicoId, async (novoValor) => {
  if (!novoValor) {
    setores.value = []
    return
  }

  try {
    const res = await fetch(
      `${API_BASE}/setores/por-servico/${novoValor}`
    )

    setores.value = await res.json()

    form.value.setorId = null
    limparHorarios()

    // ✅ FECHA CORRETAMENTE
    await nextTick()
    menuServico.value = false

  } catch (err) {
    console.error(err)
  }
})

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

    const res = await fetch(
      `${API_BASE}/slots/horarios-disponiveis?setorId=${form.value.setorId}&data=${dataFormatada}`,
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
  if (meuFormulario.value) {
    const { valid } = await meuFormulario.value.validate()
    if (!valid) {
      mostrarMensagem('Por favor, verifique os campos em vermelho.', 'error')
      return
    }
  }

  loading.value = true
  try {
    // 🟢 Criamos uma cópia dos dados para não estragar a formatação da tela do usuário
    const payload = {
      ...form.value,
      // Removemos pontos, traços e parênteses para enviar apenas os 11 números
      cpf: form.value.cpf.replace(/\D/g, ''),
      celular: form.value.celular.replace(/\D/g, ''),
    }

    const response = await fetch(`${API_BASE}/agendamentos/externo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // 🟢 Enviamos o payload limpo
    })

    if (!response.ok) throw new Error(await response.text())

    const result = await response.json()

    // 1. Gera o PDF primeiro
    gerarPDF(result)

    // 2. Avisa o usuário
    mostrarMensagem(`Agendamento realizado! Senha: ${result.senha}`, 'success')

    // 3. Aguarda um pouco para o usuário ver a mensagem e o download iniciar
    // Depois limpa tudo e recarrega a página do zero
    setTimeout(() => {
      resetarFormulario()
      // window.location.reload(true) força o recarregamento limpando o estado atual
      window.location.reload() 
    }, 3000) // 3 segundos de delay

  } catch (err) {
    mostrarMensagem('Erro: ' + err.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(carregarServicos)
</script>
