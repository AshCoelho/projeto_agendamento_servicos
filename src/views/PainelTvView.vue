novo
<template>
  <div
    class="min-h-screen w-screen bg-[#F0F2F5] flex flex-col overflow-x-hidden font-sans relative"
  >
    <header
      class="bg-white px-4 md:px-10 py-3 flex justify-between items-center border-b border-gray-100"
    >
      <div class="flex items-center">
        <img
          src="../assets/logo-prefeitura.png"
          alt="Prefeitura"
          class="h-8 md:h-12 object-contain"
        />
      </div>
      <div class="text-right leading-none">
        <div class="text-xl md:text-2xl font-bold text-gray-700">{{ relogio }}</div>
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
        class="flex-[4] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative p-6 md:p-0"
      >
        <div
          class="flex-1 flex flex-col md:flex-row items-center justify-around bg-white gap-8 md:gap-0"
        >
          <div class="flex flex-col items-center justify-center">
            <span
              class="text-[#8e8e8e] text-2xl md:text-6xl font-bold uppercase tracking-widest mb-2"
              >SENHA</span
            >
            <h1
              class="text-[30vw] md:text-[20vw] leading-[0.8] font-black tracking-tighter"
              :class="senhaAtual.numero.includes('P') ? 'text-red-600' : 'text-[#0056B3]'"
            >
              {{ senhaAtual.numero || '---' }}
            </h1>
          </div>

          <div class="hidden md:block h-[60%] w-[2px] bg-gray-100"></div>
          <div class="block md:hidden w-full h-[2px] bg-gray-100"></div>

          <div class="flex flex-col items-center justify-center">
            <span
              class="text-[#8e8e8e] text-2xl md:text-6xl font-bold uppercase tracking-widest mb-2"
              >GUICHÊ</span
            >
            <h1 class="text-[20vw] md:text-[14vw] leading-[0.8] font-black text-[#1A237E]">
              {{ guicheFormatado }}
            </h1>
          </div>
        </div>
      </div>

      <aside class="w-full md:w-[420px] flex flex-col h-auto md:h-full overflow-hidden">
        <div class="md:hidden mb-4">
          <div
            class="bg-[#003B73] py-4 rounded-2xl shadow-lg w-full flex justify-center items-center"
          >
            <h2 class="text-2xl font-bold text-white text-center px-4 truncate">
              {{ senhaAtual.cidadao || 'Aguardando...' }}
            </h2>
          </div>
        </div>

        <div
          class="text-center font-bold text-gray-500 text-lg md:text-[20px] uppercase pt-1 pb-2 border-b-2 border-[#0056B3] mx-4 mb-4"
        >
          HISTÓRICO
        </div>

        <div
          class="flex flex-col gap-3 px-2 pb-4 md:pb-2 overflow-y-auto md:overflow-hidden flex-1"
        >
          <div
            v-for="(item, index) in historico.slice(0, 4)"
            :key="index"
            class="flex-1 bg-white p-4 md:p-5 rounded-[20px] md:rounded-[25px] border-l-[8px] border-[#0056B3] flex justify-between items-center shadow-md md:shadow-xl"
          >
            <div class="flex flex-col leading-none">
              <span
                class="text-[10px] md:text-[13px] text-gray-400 font-bold uppercase mb-1 md:mb-2 tracking-wider"
                >Senha</span
              >
              <span class="text-3xl md:text-6xl font-black text-gray-700 tracking-tighter">{{
                item.numero
              }}</span>
            </div>

            <div class="flex flex-col text-right leading-none">
              <span
                class="text-[10px] md:text-[13px] text-gray-400 font-bold uppercase mb-1 md:mb-2 tracking-wider"
                >Guichê</span
              >
              <span class="text-3xl md:text-6xl font-black text-[#0056B3] tracking-tighter">
                {{ String(item.guiche ?? '01').padStart(2, '0') }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="relative w-full py-6 md:py-12 px-4">
      <div
        class="hidden md:flex bg-[#003B73] py-4 rounded-2xl shadow-inner w-full justify-center items-center"
      >
        <h2 class="text-6xl font-bold text-white text-center px-20 truncate">
          {{ senhaAtual.cidadao || 'Aguardando...' }}
        </h2>
      </div>

      <div class="mt-4 md:absolute md:inset-0 flex flex-row items-center justify-between md:px-8">
        <div class="hidden md:block bg-white p-2 rounded-[12px] shadow-lg border border-gray-100">
          <img :src="qrSrc" alt="QR" class="w-12 h-12 md:w-20 md:h-20" />
        </div>

        <button
          v-if="!somAtivado"
          @click="ativarAudio"
          class="bg-[#FFC107] hover:bg-yellow-500 text-black text-[10px] md:text-[11px] font-black py-2 md:py-3 px-4 md:px-8 rounded-xl shadow-lg pointer-events-auto w-full md:w-auto"
        >
          🔔 Clique para ativar áudio
        </button>
      </div>
    </footer>

    <audio ref="audioPlayer" src="/audio/ding.mp3"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const setorId = computed(() => Number(route.params.setorId || 0))

const apiPublico = axios.create({
  baseURL: 'http://10.0.0.243:8080',
  timeout: 8000,
})

const relogio = ref('')
const audioPlayer = ref(null)
const somAtivado = ref(false)

const senhaAtual = ref({ numero: '---', guiche: null, cidadao: 'Aguardando...' })
const historico = ref([])

let intervalChamada = null
let intervalRelogio = null

const lastKey = ref(null)
const fetching = ref(false)

const qrSrc = computed(() => {
  // 1. Defina a base da sua URL pública
  const urlPublica = `http://192.168.100.21:5173/tv/${setorId.value}`

  // 2. Codifique a URL para que caracteres como '/' e ':' não quebrem o link
  const data = encodeURIComponent(urlPublica)

  // 3. Retorne o link da API do QR Code
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`
})

const guicheFormatado = computed(() => {
  const g = senhaAtual.value?.guiche
  if (g == null || g === '' || g === '--') return '--'
  return String(g).padStart(2, '0')
})

const atualizarRelogio = () => {
  const agora = new Date()
  relogio.value = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function extrairLista(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.ultimasChamadas)) return payload.ultimasChamadas
  return []
}

function pegarCampo(item, chaves) {
  for (const k of chaves) {
    if (item && item[k] != null && item[k] !== '') return item[k]
  }
  return null
}

const buscarChamadas = async () => {
  console.log('Buscando chamadas para o setor:', setorId.value)
  if (!setorId.value || setorId.value === 0) {
    console.warn('setorId inválido na rota.')
    return
  }
  if (fetching.value) return
  fetching.value = true

  try {
    const res = await apiPublico.get(
      `/agendamentos/ultimas-chamadas/${setorId.value}?t=${Date.now()}`,
      { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } },
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

    const horaChamada = pegarCampo(ultima, ['horaChamada', 'dataChamada', 'data_chamada'])
    const agendamentoId = pegarCampo(ultima, ['agendamentoId', 'id'])
    const key = String(agendamentoId ?? '') + '|' + String(horaChamada ?? '') + '|' + String(senha)

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
    console.error('Erro ao buscar chamadas:', error?.response?.data || error?.message || error)
  } finally {
    fetching.value = false
  }
}

const falarChamada = (nome, senha, guiche) => {
  if (!somAtivado.value) return

  const texto = `Senha ${senha}, ${nome}, comparecer ao guichê ${guiche}`

  const falar = (vezesRestantes) => {
    const msg = new SpeechSynthesisUtterance()
    msg.text = texto
    msg.lang = 'pt-BR'
    msg.rate = 1.0

    msg.onend = () => {
      if (vezesRestantes > 1) {
        falar(vezesRestantes - 1)
      }
    }

    window.speechSynthesis.speak(msg)
  }

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

const ativarAudio = () => {
  somAtivado.value = true
  audioPlayer.value?.play().catch(() => {})
}

function start() {
  stop()
  atualizarRelogio()
  intervalRelogio = setInterval(atualizarRelogio, 1000)

  buscarChamadas()
  intervalChamada = setInterval(buscarChamadas, 1500)
}

function stop() {
  if (intervalChamada) clearInterval(intervalChamada)
  if (intervalRelogio) clearInterval(intervalRelogio)
  intervalChamada = null
  intervalRelogio = null
}

onMounted(start)
onUnmounted(stop)

onMounted(() => {
  if (route.params.setorId) {
    setorId.value = Number(route.params.setorId)
    start()
  } else {
    console.error('Nenhum setorId encontrado na URL')
  }
})
</script>
