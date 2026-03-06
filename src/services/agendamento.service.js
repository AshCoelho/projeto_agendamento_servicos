export const AgendamentoService = {
  filtrarAgendamentos(lista, abaAtiva, idsChamadosManualmente) {
    // 1. Normaliza a lista
    let listaNormalizada = lista.map((item) => {
      const status = item.situacao ? item.situacao.toUpperCase() : 'AGENDADO'
      const tipoAg = item.tipoAgendamento ? item.tipoAgendamento.toUpperCase() : 'NORMAL'
      const tipoAt = item.tipoAtendimento ? item.tipoAtendimento.toUpperCase() : 'NORMAL'
      const id = item.agendamentoId || item.id

      if (idsChamadosManualmente && idsChamadosManualmente.includes(id)) {
        return { ...item, situacao: 'EM_ATENDIMENTO', tipoAgendamento: tipoAg, tipoAtendimento: tipoAt }
      }
      return { ...item, situacao: status, tipoAgendamento: tipoAg, tipoAtendimento: tipoAt }
    })

    const regras = {
      // 🔵 AGUARDANDO: Mostra TUDO que está agendado (Normal + Todas as Prioridades)
      'AGUARDANDO': (a) => 
        a.situacao === 'AGENDADO' && 
        ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),

      // 🟡 PRIORIDADES: Mostra APENAS quem tem "PRIORIDADE" no nome
      'PRIORIDADES': (a) => 
        a.situacao === 'AGENDADO' && 
        a.tipoAtendimento.includes('PRIORIDADE'),

      'ATENDIMENTO': (a) => ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao),
      'CANCELADOS': (a) => ['FALTOU'].includes(a.situacao),
      'FINALIZADOS': (a) => ['ATENDIDO'].includes(a.situacao)
    }

    return regras[abaAtiva] ? listaNormalizada.filter(regras[abaAtiva]) : listaNormalizada
  }
}