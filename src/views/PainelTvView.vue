<template>
  <div class="h-screen w-screen bg-[#F0F2F5] flex flex-col overflow-hidden font-sans border-t-[8px] border-[#004A8D] relative">
    
    <header class="bg-white px-8 py-2 flex justify-between items-center h-[75px] border-b border-gray-100">
      <img src="../assets/logo-prefeitura.png" alt="Prefeitura" class="h-10 object-contain">
      <div class="text-right leading-none">
        <div class="text-2xl font-bold text-gray-700 tracking-tighter">{{ relogio }}</div>
        <div class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Atendimento ao Cidadão</div>
      </div>
    </header>

    <main class="flex-1 flex p-4 gap-4 overflow-hidden">
      
      <div class="flex-[4] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div class="flex-1 flex items-center justify-around px-12 relative bg-white">
          
          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-5xl font-bold uppercase tracking-widest mb-2">SENHA</span>
            <h1 class="text-[18vw] leading-[0.8] font-black text-[#004A8D] tracking-tighter">
              {{ senhaAtual.numero || '---' }}
            </h1>
          </div>

          <div class="h-[60%] w-[1.5px] bg-gray-100"></div>

          <div class="flex flex-col items-center justify-center">
            <span class="text-[#8e8e8e] text-5xl font-bold uppercase tracking-widest mb-2">GUICHÊ</span>
            <h1 class="text-[18vw] leading-[0.8] font-black text-[#004A8D]">
              {{ senhaAtual.guiche || '--' }}
            </h1>
          </div>
        </div>

        <div class="bg-[#003B73] py-8 shadow-inner mt-auto">
          <h2 class="text-7xl font-bold text-white text-center uppercase tracking-tight truncate px-10">
            {{ senhaAtual.cidadao || 'Aguardando...' }}
          </h2>
        </div>
      </div>

      <aside class="w-[360px] flex flex-col gap-3">
        <div class="text-center font-bold text-gray-500 text-xs uppercase tracking-[0.3em] pb-2 border-b-2 border-gray-200 mx-4">
          HISTÓRICO
        </div>
        
        <div class="flex flex-col gap-3 overflow-hidden">
          <div v-for="(item, index) in historico" :key="index" 
               class="bg-white p-4 rounded-xl border-l-[12px] border-[#0056B3] flex justify-between items-center shadow-md">
            <div class="flex flex-col leading-none">
              <span class="text-[10px] text-gray-400 font-bold uppercase mb-1">Senha</span>
              <span class="text-5xl font-black text-gray-700 tracking-tighter">{{ item.numero }}</span>
            </div>
            <div class="flex flex-col text-right leading-none">
              <span class="text-[10px] text-gray-400 font-bold uppercase mb-1">Guichê</span>
              <span class="text-5xl font-black text-[#2B78E4] tracking-tighter">{{ item.guiche }}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <div class="absolute bottom-4 left-6 z-40 flex flex-col items-center">
      <div class="bg-white p-1 rounded shadow-2xl border border-gray-100">
         <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=GAVIC" alt="QR" class="w-20 h-20" />
      </div>
      <span class="text-[10px] font-black text-gray-400 mt-1 tracking-widest">GAVIC</span>
    </div>

    <button v-if="!somAtivado" @click="ativarAudio" 
            class="fixed bottom-6 right-6 bg-[#FFC107] hover:bg-yellow-500 text-black text-[10px] font-bold py-3 px-6 rounded-full shadow-2xl z-50">
      🔔 Clique para ativar áudio
    </button>

    <audio ref="audioPlayer" src="/audio/ding.mp3"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const relogio = ref('');
const audioPlayer = ref(null);
const somAtivado = ref(false);

// Dados Mockados para teste igual à sua foto
const senhaAtual = ref({ 
  numero: 'N015', 
  guiche: '04', 
  cidadao: 'Hellywdes Silva Pereira' 
});

const historico = ref([
  { numero: 'N014', guiche: '04' },
  { numero: 'N013', guiche: '04' },
  { numero: 'N012', guiche: '04' },
  { numero: 'N011', guiche: '04' }
]);

const ativarAudio = () => {
  somAtivado.value = true;
  audioPlayer.value?.play().catch(() => {});
};

const atualizarRelogio = () => {
  const agora = new Date();
  relogio.value = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

onMounted(() => {
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
});
</script>