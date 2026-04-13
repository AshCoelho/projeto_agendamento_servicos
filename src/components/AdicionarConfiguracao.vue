<template>
  <v-form ref="form" v-model="valid">
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="config.setor.id"
          :items="setores"
          item-title="nome"
          item-value="id"
          label="Selecione o Setor"
          required
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="config.horaInicio"
          label="Início Expediente"
          type="time"
          variant="outlined"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="config.horaFim"
          label="Fim Expediente"
          type="time"
          variant="outlined"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="config.pausaInicio"
          label="Início Pausa (Opcional)"
          type="time"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="config.pausaFim"
          label="Fim Pausa (Opcional)"
          type="time"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-radio-group v-model="config.tipoRegra" inline label="Regra de Agendamento">
          <v-radio label="Por Intervalo (minutos)" value="POR_INTERVALO"></v-radio>
          <v-radio label="Por Quantidade (total)" value="POR_QUANTIDADE"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col cols="6" v-if="config.tipoRegra === 'POR_INTERVALO'">
        <v-text-field
          v-model="config.intervaloMinutos"
          label="Minutos por atendimento"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="6" v-else>
        <v-text-field
          v-model="config.quantidadeAtendimentos"
          label="Total de atendimentos"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="config.numeroGuiches"
          label="Número de Guichês"
          type="number"
          variant="outlined"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <div class="d-flex justify-end gap-2">
      <v-btn variant="text" @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn color="green-darken-1" :loading="loading" @click="salvarConfiguracao"
        >Salvar Configuração</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import api from '@/services/api'

export default {
  data: () => ({
    valid: false,
    loading: false,
    setores: [],
    config: {
      setor: { id: null },
      horaInicio: '08:00',
      horaFim: '18:00',
      pausaInicio: null,
      pausaFim: null,
      tipoRegra: 'POR_INTERVALO',
      intervaloMinutos: 20,
      quantidadeAtendimentos: null,
      numeroGuiches: 1,
      ativo: true,
    },
  }),
  methods: {
    async fetchSetores() {
      try {
        // Usando a rota que você mencionou no mounted do pai
        const { data } = await api.get('/setores/por-secretaria/5')
        this.setores = data
      } catch (e) {
        console.error('Erro ao buscar setores', e)
      }
    },
    async salvarConfiguracao() {
      this.loading = true
      try {
        // Formata os campos antes de enviar para garantir que nulos sejam respeitados
        const payload = { ...this.config }
        if (payload.tipoRegra === 'POR_INTERVALO') payload.quantidadeAtendimentos = null
        else payload.intervaloMinutos = null

        // Se a pausa estiver vazia, envia null para não quebrar a validação do Java
        if (!payload.pausaInicio) {
          payload.pausaInicio = null
          payload.pausaFim = null
        }

        await api.post('/configuracoes-atendimento', payload)
        this.$emit('salvo') // Avisa o pai para fechar o modal e atualizar
      } catch (e) {
        const msg = e.response?.data?.message || 'Erro ao salvar configuração'
        alert(msg)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.fetchSetores()
  },
}
</script>
