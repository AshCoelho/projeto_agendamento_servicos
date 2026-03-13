<template>
  <div class="h-screen w-screen bg-[#F0F2F5] flex flex-col overflow-hidden font-sans relative">
    <header
      class="bg-white px-4 md:px-10 py-3 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 shrink-0"
    >
      <div class="flex items-center justify-center md:justify-start gap-3">
        <img src="../assets/brasao.png" alt="Prefeitura" class="h-8 md:h-12 object-contain" />

        <h1
          class="text-sm sm:text-lg md:text-2xl font-bold text-[#003B73] uppercase text-center md:text-left"
        >
          {{ nomeSecretaria }}
        </h1>
      </div>

      <!-- Relógio -->
      <div
        class="flex flex-col items-center md:items-end text-center md:text-right leading-none mt-2 md:mt-0"
      >
        <div class="text-base sm:text-lg md:text-2xl font-bold text-gray-700">
          {{ relogio }}
        </div>

        <div
          class="text-[8px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1"
        >
          Atendimento ao Cidadão
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative pb-0">
      <div
        class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
      ></div>

      <div
        class="flex-[4] md:flex-[4] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative"
      >
        <!-- Iframe da câmera ocupando só esse card -->
        <iframe
          v-if="!mostrarSenha"
          src="https://cameras.saoluis.ma.gov.br/cam1.html"
          class="absolute inset-0 w-full h-full z-0 rounded-2xl"
          frameborder="0"
        ></iframe>

        <div
          class="w-full text-[20px] md:text-[2vw] flex justify-center items-center pt-10 md:pt-2 font-bold"
          :class="senhaAtual?.numero?.includes('P') ? 'text-red-600' : 'text-blue-600'"
        >
          {{ senhaAtual?.numero?.includes('P') ? 'PRIORIDADE' : 'NORMAL' }}
        </div>

        <div
          v-show="mostrarSenha"
          class="flex-1 flex flex-col md:flex-row items-center justify-around px-4 md:px-10 bg-white"
        >
          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-[15px] md:text-6xl font-bold uppercase tracking-widest"
              >SENHA</span
            >
            <h1
              class="text-[25vw] md:text-[20vw] leading-[0.8] font-black tracking-tighter"
              :class="senhaAtual.numero.includes('P') ? 'text-red-600' : 'text-[#0056B3]'"
            >
              {{ senhaAtual.numero || '---' }}
            </h1>
          </div>

          <div class="h-[2px] w-full md:h-[60%] md:w-[2px] bg-gray-100 my-2 md:my-0"></div>

          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-2xl md:text-6xl font-bold uppercase tracking-widest"
              >GUICHÊ</span
            >
            <h1 class="text-[18vw] md:text-[14vw] leading-[0.8] font-black text-[#1A237E]">
              {{ guicheFormatado }}
            </h1>
          </div>
        </div>
      </div>

      <aside class="w-full md:w-[420px] flex flex-col h-1/2 md:h-full overflow-hidden">
        <div class="md:hidden mb-3 shrink-0">
          <div class="bg-[#003B73] py-3 rounded-xl shadow-lg flex justify-center items-center">
            <h2 class="text-lg font-bold text-white text-center px-4 truncate uppercase">
              {{ senhaAtual.cidadao || 'Aguardando...' }}
            </h2>
          </div>
        </div>

        <div
          class="text-center font-bold text-gray-500 text-sm md:text-[20px] uppercase pt-1 pb-2 border-b-2 border-[#0056B3] mx-4 mb-2 md:mb-4 shrink-0"
        >
          HISTÓRICO
        </div>

        <div
          class="flex-1 flex flex-col gap-2 md:gap-4 px-2 pb-4 overflow-y-auto md:overflow-hidden"
        >
          <div
            v-for="(item, index) in historico.slice(0, 4)"
            :key="index"
            class="min-h-[80px] md:h-1/4 bg-white p-4 md:p-5 rounded-[20px] md:rounded-[25px] border-l-[8px] border-[#0056B3] flex justify-between items-center shadow-md md:shadow-xl shrink-0"
          >
            <div class="flex flex-col leading-none">
              <span
                class="text-[10px] md:text-[13px] text-gray-400 font-bold uppercase mb-1 tracking-wider"
                >Senha</span
              >
              <span
                class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter"
                :class="item.numero.includes('P') ? 'text-red-600' : 'text-gray-700'"
                >{{ item.numero }}</span
              >
            </div>

            <div class="flex flex-col text-right leading-none">
              <span
                class="text-[10px] md:text-[13px] text-gray-400 font-bold uppercase mb-1 tracking-wider"
                >Guichê</span
              >
              <span
                class="text-3xl md:text-5xl lg:text-6xl font-black text-[#0056B3] tracking-tighter"
              >
                {{ String(item.guiche ?? '01').padStart(2, '0') }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="hidden md:block flex justify-between relative w-full py-5 shrink-0">
      <div class="bg-[#003B73] py-2 rounded-2xl shadow-inner w-full flex items-center px-10">
        <div class="flex-1">
          <div class="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 w-fit">
            <img :src="qrSrc" alt="QR" class="w-20 h-20" />
          </div>
        </div>

        <div class="flex-1 text-center">
          <h2
            class="text-[17px] md:text-6xl font-medium text-white break-words leading-tight max-w-full"
          >
            {{ senhaAtual.cidadao || 'Aguardando...' }}
          </h2>
        </div>

        <div class="flex-1 flex justify-end">
          <button
            v-if="!somAtivado"
            @click="ativarAudio"
            class="bg-[#FFC107] hover:bg-yellow-500 text-black text-[11px] font-black py-3 px-8 rounded-2xl shadow-2xl"
          >
            🔔 Clique para ativar áudio
          </button>
        </div>
      </div>
    </footer>

    <div v-if="!somAtivado" class="md:hidden p-4 shrink-0">
      <button
        @click="ativarAudio"
        class="w-full bg-[#FFC107] py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
      >
        🔔 Clique para Ativar Áudio
      </button>
    </div>

    <audio ref="audioPlayer" src="/audio/ding.mp3"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

/** ======= ROTAS E ESTADOS ======= **/
const route = useRoute()
const setorId = computed(() => Number(route.params.setorId || 0))

const nomeSecretaria = ref('Secretaria')
const relogio = ref('')
const audioPlayer = ref(null)
const somAtivado = ref(false)

const senhaAtual = ref({ numero: '---', guiche: null, cidadao: 'Aguardando...' })
const historico = ref([])

const lastKey = ref(null)
const fetching = ref(false)
const mostrarSenha = ref(false)

let intervalChamada = null
let intervalRelogio = null

/** ======= FILA DE ÁUDIO ======= **/
const filaChamadas = []
const falando = ref(false)

/** ======= API ======= **/
const apiPublico = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 3000,
})

/** ======= UTILITÁRIOS ======= **/
const extrairLista = (payload) =>
  Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
      ? payload.content
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.ultimasChamadas)
          ? payload.ultimasChamadas
          : []

const pegarCampo = (item, chaves) => {
  for (const k of chaves) {
    if (item?.[k] != null && item[k] !== '') return item[k]
  }
  return null
}

const atualizarRelogio = () => {
  const agora = new Date()
  relogio.value = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const qrSrc = computed(() => {
  const urlPublica = `http://localhost:3000/tv/${setorId.value}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    urlPublica,
  )}`
})

const guicheFormatado = computed(() => {
  const g = senhaAtual.value?.guiche
  return g == null || g === '' || g === '--' ? '--' : String(g).padStart(2, '0')
})

/** ======= PROCESSADOR DA FILA ======= **/
const processarFila = () => {
  if (falando.value || filaChamadas.length === 0) return

  falando.value = true
  mostrarSenha.value = true

  const chamada = filaChamadas.shift()

  const texto = `Senha ${chamada.senha}, ${chamada.nome}, comparecer ao guichê ${chamada.guiche}`

  const falar = (vezes) => {
    const msg = new SpeechSynthesisUtterance(texto)
    msg.lang = 'pt-BR'
    msg.rate = 1

    msg.onend = () => {
      if (vezes > 1) {
        falar(vezes - 1)
      } else {
        falando.value = false

        // 👇 mantém a senha na tela por mais 5 segundos
        setTimeout(() => {
          mostrarSenha.value = false
        }, 5000)

        processarFila()
      }
    }

    window.speechSynthesis.speak(msg)
  }

  // evita voz acumulada
  window.speechSynthesis.cancel()

  if (audioPlayer.value) {
    audioPlayer.value.currentTime = 0

    audioPlayer.value.play().catch(() => {})

    setTimeout(() => {
      falar(2)
    }, 1000)
  } else {
    falar(2)
  }
}

/** ======= ADICIONA NA FILA ======= **/
const falarChamada = (nome, senha, guiche) => {
  if (!somAtivado.value) return
  mostrarSenha.value = true
  filaChamadas.push({
    nome,
    senha,
    guiche,
  })

  processarFila()
}

/** ======= BUSCAR SETOR ======= **/
const buscarInfoSetor = async () => {
  if (!setorId.value) return

  try {
    const res = await apiPublico.get(`/setores/setor/${setorId.value}`)
    const setor = Array.isArray(res.data) && res.data[0]

    if (setor) {
      nomeSecretaria.value = setor.secretaria?.nome || setor.nome || 'Secretaria'
    }
  } catch (e) {
    console.warn('Erro ao buscar setor', e)
  }
}

/** ======= BUSCAR CHAMADAS ======= **/
const buscarChamadas = async () => {
  if (!setorId.value || fetching.value) return

  fetching.value = true

  try {
    const res = await apiPublico.get(
      `/agendamentos/ultimas-chamadas/${setorId.value}?t=${Date.now()}`,
      {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      },
    )

    const lista = extrairLista(res.data)

    if (!lista.length) return

    const ultima = lista[0]

    const senha =
      pegarCampo(ultima, ['senha', 'numeroSenha', 'senhaAtual', 'nsenha', 'senha_agendamento']) ||
      '---'

    const guiche = pegarCampo(ultima, ['guiche', 'numeroGuiche', 'guicheNumero']) ?? null

    const cidadao =
      pegarCampo(ultima, [
        'nomeCidadao',
        'nome_cidadao',
        'usuarioNome',
        'nomeUsuario',
        'cidadao',
      ]) || 'Cidadão'

    const key = `${
      pegarCampo(ultima, ['agendamentoId', 'id']) ?? ''
    }|${pegarCampo(ultima, ['horaChamada', 'dataChamada', 'data_chamada']) ?? ''}|${senha}`

    historico.value = lista.slice(0, 5).map((item) => ({
      numero:
        pegarCampo(item, ['senha', 'numeroSenha', 'senhaAtual', 'nsenha', 'senha_agendamento']) ||
        '---',
      guiche: pegarCampo(item, ['guiche', 'numeroGuiche', 'guicheNumero']) ?? null,
      cidadao:
        pegarCampo(item, [
          'nomeCidadao',
          'nome_cidadao',
          'usuarioNome',
          'nomeUsuario',
          'cidadao',
        ]) || 'Cidadão',
    }))

    const mudou = key !== lastKey.value
    lastKey.value = key

    senhaAtual.value = {
      numero: String(senha),
      guiche: guiche != null ? String(guiche) : null,
      cidadao: String(cidadao),
    }

    if (mudou) {
      falarChamada(senhaAtual.value.cidadao, senhaAtual.value.numero, guicheFormatado.value)
    }
  } catch (error) {
    console.error('Erro ao buscar chamadas', error)
  } finally {
    fetching.value = false
  }
}

/** ======= ATIVAR SOM ======= **/
const ativarAudio = () => {
  somAtivado.value = true
  audioPlayer.value?.play().catch(() => {})
}

/** ======= START / STOP ======= **/
const start = () => {
  stop()

  atualizarRelogio()
  intervalRelogio = setInterval(atualizarRelogio, 1000)

  buscarChamadas()
  intervalChamada = setInterval(buscarChamadas, 1500)
}

const stop = () => {
  clearInterval(intervalChamada)
  clearInterval(intervalRelogio)

  intervalChamada = null
  intervalRelogio = null
}

/** ======= CICLO DE VIDA ======= **/
onMounted(async () => {
  if (!setorId.value) {
    console.error('Nenhum setorId encontrado na URL')
    return
  }

  await buscarInfoSetor()
  start()
})

onUnmounted(stop)
</script>
