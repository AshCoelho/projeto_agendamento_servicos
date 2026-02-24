export const AgendamentoService = {
  filtrarAgendamentos(lista, abaAtiva, idsChamadosManualmente) {
    // 1. Normaliza a lista
    let listaNormalizada = lista.map((item) => {
      const status = item.situacao ? item.situacao.toUpperCase() : 'AGENDADO'
      const tipoAg = item.tipoAgendamento ? item.tipoAgendamento.toUpperCase() : 'NORMAL'
      const id = item.agendamentoId || item.id

      if (idsChamadosManualmente && idsChamadosManualmente.includes(id)) {
        return { ...item, situacao: 'EM_ATENDIMENTO', tipoAgendamento: tipoAg }
      }
      return { ...item, situacao: status, tipoAgendamento: tipoAg }
    })

    // 2. Aplica os filtros por aba
    const regras = {
      'AGUARDANDO': (a) => a.situacao === 'AGENDADO' && a.tipoAgendamento === 'AGENDADO',
      'ESPONTANEO': (a) => a.situacao === 'AGENDADO' && a.tipoAgendamento === 'ESPONTANEO',
      'ATENDIMENTO': (a) => ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao),
      'CANCELADOS': (a) => ['FALTOU'].includes(a.situacao),
      'FINALIZADOS': (a) => ['ATENDIDO'].includes(a.situacao)
    }

    return regras[abaAtiva] ? listaNormalizada.filter(regras[abaAtiva]) : listaNormalizada
  }
}