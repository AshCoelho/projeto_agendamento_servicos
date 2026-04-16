import api from '@/services/api'

export const SlotService = {
  listarHorarios({ setorId, configuracaoId, data }) {
    return api.get('/slots/horarios-do-dia', {
      params: { setorId, configuracaoId, data }
    })
  },

  excluirHorario({ setorId, configuracaoId, data, hora }) {
    return api.delete('/slots/horarios-do-dia', {
      params: { setorId, configuracaoId, data, hora }
    })
  }
}