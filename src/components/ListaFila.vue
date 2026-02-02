<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex border-b mb-4">
      <button 
        @click="filtro = 'AGUARDANDO'"
        :class="['px-4 py-2', filtro === 'AGUARDANDO' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500']"
      >
        Aguardando
      </button>
      <button 
        @click="filtro = 'ATENDIMENTO'"
        :class="['px-4 py-2', filtro === 'ATENDIMENTO' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500']"
      >
        Em Atendimento
      </button>
    </div>

    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-50 text-gray-600 uppercase text-sm">
          <th class="p-3">Senha</th>
          <th class="p-3">Cliente</th>
          <th class="p-3">Serviço</th>
          <th class="p-3 text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filaFiltrada" :key="item.id" class="border-b hover:bg-gray-50">
          <td class="p-3 font-mono font-bold text-blue-700">{{ item.senha }}</td>
          <td class="p-3">{{ item.clienteNome }}</td>
          <td class="p-3">
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {{ item.servicoNome }}
            </span>
          </td>
          <td class="p-3 text-center">
            <button 
              v-if="filtro === 'AGUARDANDO'"
              @click="chamarCliente(item.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm transition"
            >
              Chamar
            </button>
            <button 
              v-else
              @click="finalizarCliente(item.id)"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm transition"
            >
              Finalizar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const fila = ref([]);
const filtro = ref('AGUARDANDO');

// Busca os dados do seu backend Java
const carregarFila = async () => {
  try {
    const response = await axios.get('http://seu-backend/api/atendimentos');
    fila.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar fila", error);
  }
};

const filaFiltrada = computed(() => {
  return fila.value.filter(item => item.status === filtro.value);
});

const chamarCliente = async (id) => {
  try {
    // PATCH ou POST para mudar o status no Java e avisar o painel da TV
    await axios.patch(`http://seu-backend/api/atendimentos/${id}/chamar`, { guiche: 3 });
    alert("Cliente chamado no painel!");
    carregarFila();
  } catch (error) {
        console.error(error); // Adicione isso
        alert("Erro ao chamar cliente");
    }
};

onMounted(carregarFila);
</script>