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
          density="compact"
        ></v-select>
      </v-col>

      <v-col cols="12" class="py-0">
        <v-checkbox
          v-model="usaPausa"
          label="Usar pausa no atendimento (opcional)"
          hide-details
          density="compact"
        ></v-checkbox>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="config.horaInicio"
          label="Início Expediente"
          type="time"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="config.horaFim"
          label="Fim Expediente"
          type="time"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="6" v-if="usaPausa">
        <v-text-field
          v-model="config.pausaInicio"
          label="Início Pausa (Opcional)"
          type="time"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="6" v-if="usaPausa">
        <v-text-field
          v-model="config.pausaFim"
          label="Fim Pausa (Opcional)"
          type="time"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-radio-group v-model="config.tipoRegra" inline label="Regra de Agendamento" hide-details>
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
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="6" v-else>
        <v-text-field
          v-model="config.quantidadeAtendimentos"
          label="Total de atendimentos"
          type="number"
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="config.numeroGuiches"
          label="Número de Guichês"
          type="number"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <div class="d-flex justify-end gap-2">
      <v-btn variant="text" @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn color="green-darken-1" :loading="loading" @click="salvarConfiguracao">
        Salvar Configuração
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import api from '@/services/api'

export default {
  props: {
    config: {
      type: Object,
      default: null
    }
  },

  data: () => ({
    valid: false,
    loading: false,
    setores: [],
    usaPausa: false,

    configForm: {
      id: null,
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

  watch: {
    // 🔥 quando receber item para edição
    config: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) return

        this.configForm = {
          id: val.id || null,
          setor: { id: val.setor?.id || null },
          horaInicio: val.horaInicio || '08:00',
          horaFim: val.horaFim || '18:00',
          pausaInicio: val.pausaInicio || null,
          pausaFim: val.pausaFim || null,
          tipoRegra: val.tipoRegra || 'POR_INTERVALO',
          intervaloMinutos: val.intervaloMinutos || 20,
          quantidadeAtendimentos: val.quantidadeAtendimentos || null,
          numeroGuiches: val.numeroGuiches || 1,
          ativo: val.ativo ?? true,
        }

        this.usaPausa = !!(val.pausaInicio && val.pausaFim)
      }
    },

    usaPausa(val) {
      if (!val) {
        this.configForm.pausaInicio = null
        this.configForm.pausaFim = null
      }
    },
  },

  methods: {
    async fetchSetores() {
      try {
        const { data } = await api.get('/gerenciador/usuario-logado')
        this.setores = data.setores || []

        if (this.setores.length > 0 && !this.configForm.setor.id) {
          this.configForm.setor.id = this.setores[0].id
        }
      } catch (e) {
        console.error('Erro ao buscar setores', e)
      }
    },

    async salvarConfiguracao() {
      this.loading = true

      try {
        const payload = { ...this.config }

        if (payload.tipoRegra === 'POR_INTERVALO') {
          payload.quantidadeAtendimentos = null
        } else {
          payload.intervaloMinutos = null
        }

        if (!this.usaPausa) {
          payload.pausaInicio = null
          payload.pausaFim = null
        }

        // 👉 SE TEM ID, É UPDATE
        if (this.config?.id) {
          await api.put(
            `/configuracoes-atendimento/${this.config.id}`,
            payload
          )
        } 
        // 👉 SENÃO, CREATE
        else {
          await api.post('/configuracoes-atendimento', payload)
        }

        this.$emit('salvo')

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