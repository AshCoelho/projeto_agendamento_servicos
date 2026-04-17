import api from '@/services/api'

export const AtendenteApi = {
  // Alterado: Agora busca agendamentos por SETOR
  async buscarAgendamentosPorSetor(setorId, gerenciadorId = null, perfil = 'ATENDENTE') {
      let url = `/agendamentos/setor/${setorId}`
      let params = []

      // 1. Adiciona o gerenciadorId se existir
      if (gerenciadorId && !isNaN(gerenciadorId)) {
          params.push(`gerenciadorId=${gerenciadorId}`)
      }

      // 2. ALTERAÇÃO CRÍTICA: Envia o 'perfil' em vez de 'cadastro'
      // O seu Controller no Java agora espera @RequestParam(name = "perfil")
      params.push(`perfil=${perfil}`)

      // 3. Monta a Query String
      if (params.length > 0) {
          url += `?${params.join('&')}`
      }

      // console.log('URL FINAL:', url) 
      // Exemplo: /agendamentos/setor/5?gerenciadorId=10&perfil=CADASTRO

      const res = await api.get(url)
      return Array.isArray(res.data) ? res.data : []
  },
  
  async chamarPorSenha(senha, gerenciadorId, setorId, horario) {
    return await api.post(
      `/agendamentos/chamar/por-senha/${encodeURIComponent(senha)}/${gerenciadorId}/${setorId}`,
      null, // O segundo parâmetro é o corpo (body), enviamos null
      { 
        params: { 
          horario: horario // O Axios anexa isso como ?horario=...
        } 
      }
    );
  },

  async chamarNormal(setorId, gerenciadorId, horario) {
    return await api.post(`/agendamentos/chamar/normal/${setorId}/${gerenciadorId}?horario=${encodeURIComponent(horario)}`)
  },

  async chamarPrioridade(setorId, gerenciadorId, horario) {
    return await api.post(`/agendamentos/chamar/prioridade/${setorId}/${gerenciadorId}?horario=${encodeURIComponent(horario)}`)
  },

  async cancelarAtendimento(id, horario) {
  // 🟢 Usando o mesmo padrão de concatenação que deu certo no finalizar
  return await api.put(`/agendamentos/cancelar/${id}?horario=${encodeURIComponent(horario)}`);
},

  async finalizarAtendimento(id, horario) {
    // Envia o horário via query string para o Spring Boot
    return await api.put(`/agendamentos/finalizar/${id}?horario=${encodeURIComponent(horario)}`);
  },

  async salvarEspontaneo(secretariaId, payload, horario) {
    // A URL agora leva o ?horario=...
    return await api.post(`/agendamentos/espontaneo/${secretariaId}?horario=${encodeURIComponent(horario)}`, payload);
  },

  async carregarTiposAtendimento(secretariaId) {
    return await api.get(`/tipos-atendimento/secretaria/${secretariaId}/ativos`);
  },

  async atualizarEspontaneo(id, payload, token) {
    return await api.put(`/agendamentos/atualizar-espontaneo/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  async getUsuarioLogado() {
    return await api.get('/gerenciador/usuario-logado')
  },

  async carregarServicosPorSetor(setorId, gerenciadorId = null, apenasCadastro = false) {
      let url = `/agendamento/api/servico/setor/${setorId}?cadastro=${apenasCadastro}`

      // 🔒 Adiciona o ID do gerenciador se ele existir (para especialistas/gerais)
      if (gerenciadorId && !isNaN(gerenciadorId)) {
        url += `&gerenciadorId=${gerenciadorId}`
      }

      //console.log("URL FINAL:", url)

      const response = await api.get(url)
      return response.data
  },

  async deslogarGuiche(gerenciadorId) {
    // Adicionamos um log aqui para você ver se o método é chamado
    //console.log("API: Chamando logout-guiche para ID", gerenciadorId);
    return await api.post(`/gerenciador/${gerenciadorId}/logout-guiche`);
  },

  async heartbeat(agendamentoId) {
    return await api.put(`/agendamentos/heartbeat/${agendamentoId}`)
  },
}