<template>
  <div class="h-screen w-screen bg-[#F0F2F5] flex flex-col overflow-hidden font-sans relative">
    <header class="bg-white px-10 py-3 flex justify-between items-center border-b border-gray-100">
      <div class="flex items-center">
        <img src="../assets/logo-prefeitura.png" alt="Prefeitura" class="h-12 object-contain" />
      </div>
      <div class="text-right leading-none">
        <div class="text-2xl font-bold text-gray-700">{{ relogio }}</div>
        <div class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
          Atendimento ao Cidadão
        </div>
      </div>
    </header>

    <main class="flex-1 flex p-4 gap-4 overflow-hidden relative pb-0">
      <div
        class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
      ></div>
      <div
        class="flex-[4] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative"
      >
        <div class="flex-1 flex items-center justify-around px-12 bg-white">
          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-6xl font-bold uppercase tracking-widest mb-2"
              >SENHA</span
            >
            <h1 class="text-[20vw] leading-[0.8] font-black text-[#0056B3] tracking-tighter">
              {{ senhaAtual.numero || '---' }}
            </h1>
          </div>

          <div class="h-[60%] w-[2px] bg-gray-100"></div>

          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-6xl font-bold uppercase tracking-widest mb-2"
              >GUICHÊ</span
            >
            <h1 class="text-[14vw] leading-[0.8] font-black text-[#1A237E]">
              {{ String(senhaAtual.guiche).padStart(2, '0') || '--' }}
            </h1>
          </div>
        </div>
      </div>

      <aside class="w-[420px] flex flex-col h-full overflow-hidden">
        <div
          class="text-center font-bold text-gray-500 text-[20px] uppercase pt-1 pb-2 border-b-2 border-[#0056B3] mx-4 mb-4"
        >
          HISTÓRICO
        </div>

        <div class="flex-1 flex flex-col gap-4 px-2 pb-2 overflow-hidden">
          <div
            v-for="(item, index) in historico.slice(0, 4)"
            :key="index"
            class="flex-1 bg-white p-5 rounded-[25px] border-l-[8px] border-[#0056B3] flex justify-between items-center shadow-xl transition-all"
          >
            <div class="flex flex-col leading-none">
              <span class="text-[13px] text-gray-400 font-bold uppercase mb-2 tracking-wider"
                >Senha</span
              >
              <span class="text-6xl font-black text-gray-700 tracking-tighter">
                {{ item.numero }}
              </span>
            </div>

            <div class="flex flex-col text-right leading-none">
              <span class="text-[13px] text-gray-400 font-bold uppercase mb-2 tracking-wider"
                >Guichê</span
              >
              <span class="text-6xl font-black text-[#0056B3] tracking-tighter">
               {{ String(item.guiche).padStart(2, '0') }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="relative w-full py-12">
      <div
        class="bg-[#003B73] py-4 rounded-2xl shadow-inner w-full flex justify-center items-center"
      >
        <h2 class="text-6xl font-bold text-white text-center px-20">
          {{ senhaAtual.cidadao || 'Aguardando...' }}
        </h2>
      </div>

      <div class="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
        <div class="pointer-events-auto transform -translate-y-4">
          <div
            class="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center"
          >
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=GAVIC"
              alt="QR"
              class="w-20 h-20"
            />
            <span class="text-[10px] font-black text-gray-800 mt-1 tracking-widest uppercase"
              >{{ SIGLA_SECRETARIA }}</span
            >
          </div>
        </div>

        <button
          v-if="!somAtivado"
          @click="ativarAudio"
          class="bg-[#FFC107] hover:bg-yellow-500 text-black text-[11px] font-black py-3 px-8 rounded-2xl shadow-2xl pointer-events-auto transform translate-y-8"
        >
          🔔 Clique para ativar áudio
        </button>
      </div>
    </footer>

    <audio ref="audioPlayer" src="/audio/ding.mp3"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'

const relogio = ref('')
const audioPlayer = ref(null)
const somAtivado = ref(false)

const senhaAtual = ref({ numero: '---', guiche: '--', cidadao: 'Aguardando...' })
const historico = ref([])

const SIGLA_SECRETARIA = 'GAVIC'

const atualizarRelogio = () => {
  const agora = new Date()
  relogio.value = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const buscarChamadas = async () => {
  try {
    const res = await api.get(`/agendamentos/ultimas-chamadas/${SIGLA_SECRETARIA}`)

    if (res.status === 200 && res.data.length > 0) {
      const novasChamadas = res.data
      const ultima = novasChamadas[0]

      if (ultima.senha !== senhaAtual.value.numero) {
        // 1. Atualiza os dados na tela
        senhaAtual.value = {
          numero: ultima.senha,
          guiche: ultima.guiche,
          cidadao: ultima.nomeCidadao,
        }

        falarChamada(ultima.nomeCidadao, ultima.senha, ultima.guiche)

        historico.value = novasChamadas.slice(1, 5).map((item) => ({
          numero: item.senha,
          guiche: item.guiche,
        }))
      }
    }
  } catch (error) {
    console.error('Erro ao buscar chamadas:', error)
  }
}

const falarChamada = (nome, senha, guiche) => {
  if (!somAtivado.value) return

  const mensagem = new SpeechSynthesisUtterance()
  mensagem.text = `Senha ${senha}, ${nome}, comparecer ao guichê ${guiche}`
  mensagem.lang = 'pt-BR'
  mensagem.rate = 0.9
  mensagem.pitch = 1

  let repeticoes = 0
  const totalRepeticoes = 2

  // Função que gerencia a repetição
  mensagem.onend = () => {
    repeticoes++
    if (repeticoes < totalRepeticoes) {
      setTimeout(() => {
        window.speechSynthesis.speak(mensagem)
      }, 500)
    }
  }

  // Toca o sino uma única vez antes de começar a falar
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = 0
    audioPlayer.value.play()

    setTimeout(() => {
      window.speechSynthesis.speak(mensagem)
    }, 1200)
  } else {
    window.speechSynthesis.speak(mensagem)
  }
}

const ativarAudio = () => {
  somAtivado.value = true
  audioPlayer.value?.play().catch(() => {})
}

let intervalChamada = null

onMounted(() => {
  atualizarRelogio()
  setInterval(atualizarRelogio, 1000)

  buscarChamadas()

  intervalChamada = setInterval(buscarChamadas, 3000)
})

onUnmounted(() => {
  clearInterval(intervalChamada)
})
</script>
