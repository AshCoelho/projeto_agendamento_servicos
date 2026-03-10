<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="4" class="">
        <span class="text-subtitle-2">Setor</span>
        <v-select
          :items="setores"
          item-title="nome"
          hide-details
          placeholder="Selecione o setor"
          density="compact"
          variant="outlined"
        >
        </v-select>
        <span class="text-caption">Escolha para qual setor esta regra será aplicada </span>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-checkbox
          v-model="mostrarPausa"
          class="checkbox"
          label="Usar pausa no atendimento (opcional)"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="2">
        <span class="text-subtitle-2">Hora Início</span>
        <v-text-field
          v-model="horaInicio"
          class="hora"
          variant="outlined"
          density="compact"
          type="time"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <span class="text-subtitle-2">Hora Fim</span>
        <v-text-field
          v-model="horaFim"
          class="hora"
          variant="outlined"
          density="compact"
          type="time"
        ></v-text-field>
      </v-col>

      <template v-if="mostrarPausa">
        <v-col cols="2">
          <span class="text-subtitle-2">Início Pausa</span>
          <v-text-field
            v-model="pausaInicio"
            variant="outlined"
            density="compact"
            type="time"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <span class="text-subtitle-2">Fim Pausa</span>
          <v-text-field
            v-model="pausaFim"
            variant="outlined"
            density="compact"
            type="time"
          ></v-text-field>
        </v-col>
      </template>
    </v-row>
    <v-row dense>
      <v-col cols="7" class="">
        <span class="text-subtitle-2">Tipo de Regra</span>
        <v-select
          v-model="tipoSelecionado"
          :items="tipos"
          item-title="title"
          item-value="value"
          hide-details
          placeholder="Selecione o setor"
          density="compact"
          variant="outlined"
        >
        </v-select>
        <span class="text-caption">A interface habilita o campo certo automaticamente</span>
      </v-col>
      <v-col cols="5" class="">
        <span class="text-subtitle-2">Número de Guichês</span>
        <v-text-field hide-details density="compact" variant="outlined"> </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="tipoSelecionado === 'POR_QUANTIDADE'" cols="7">
        <span class="text-subtitle-2">Quantidade de atendimentos</span>
        <v-text-field
          v-model="quantidadeAtendimentos"
          hide-details
          density="compact"
          variant="outlined"
          type="number"
        ></v-text-field>
      </v-col>

      <v-col v-if="tipoSelecionado === 'POR_INTERVALO'" cols="7">
        <span class="text-subtitle-2">Quantidade de minutos (Intervalo)</span>
        <v-text-field
          v-model="minutosIntervalo"
          hide-details
          density="compact"
          variant="outlined"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="">
        <v-btn color="primary" class="w-100 text-capitalize"
          ><span>Salvar Configuração</span></v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn prepend-icon="mdi-arrow-left">
          <span class="text-capitalize">Voltar pra listagem</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/services/api'

export default {
  data: () => ({
    tipos: [
      {
        title: 'Por Quantidade',
        value: 'POR_QUANTIDADE',
      },
      {
        title: 'Por Intervalo',
        value: 'POR_INTERVALO',
      },
    ],
    tipoSelecionado: null,
    quantidadeAtendimentos: null,
    minutosIntervalo: null,

    horaInicio: '08:00',
    horaFim: '18:00',
    setores: [],
    pausaFim: '13:00',
    pausaInicio: '12:00',
    mostrarPausa: false,
  }),
  methods: {
    async getSetoresPorSecretaria() {
      try {
        const { data } = await api.get(`http://localhost:8080/setores/por-secretaria/${5}`)
        this.setores = data
      } catch (e) {
        console.error(e)
      }
    },
  },
  mounted() {
    this.getSetoresPorSecretaria()
  },
}
</script>

<style scoped>
::v-deep(.v-selection-control--density-default, .checkbox) {
  --v-selection-control-size: none;
  gap: 12px;
}
</style>
