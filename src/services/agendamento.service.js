export const AgendamentoService = {
  filtrarAgendamentos(lista, abaAtiva, idsChamadosManualmente, meuUsuarioId, perfil) {

    const perfilUpper = (perfil || '').toUpperCase()

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

    const ehAdmin = perfilUpper === 'SUPERADMIN' || perfilUpper === 'CADASTRO'

    const regras = {
      'AGUARDANDO': (a) =>
        a.situacao === 'AGENDADO' &&
        ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),

      'PRIORIDADES': (a) =>
        a.situacao === 'AGENDADO' &&
        a.tipoAtendimento.includes('PRIORIDADE'),

      'ATENDIMENTO': (a) => {
        const idNoBanco = Number(a.gerenciadorId)
        const ocupado = ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao)

        // 🔥 ADMIN vê todos atendimentos em andamento
        if (ehAdmin) return ocupado

        return ocupado && idNoBanco === Number(meuUsuarioId)
      },

      'CANCELADOS': (a) => a.situacao === 'FALTOU',

      'FINALIZADOS': (a) => {
        const idNoBanco = Number(a.gerenciadorId)

        // 🔥 ADMIN vê TODOS finalizados
        if (ehAdmin) return a.situacao === 'ATENDIDO'

        return a.situacao === 'ATENDIDO' && idNoBanco === Number(meuUsuarioId)
      }
    }

    // aliases
    regras['FINALIZADO'] = regras['FINALIZADOS']
    regras['ATENDIDOS'] = regras['FINALIZADOS']
    regras['CANCELADO'] = regras['CANCELADOS']
    regras['AUSENTES'] = regras['CANCELADOS']

    return regras[abaAtiva]
      ? listaNormalizada.filter(regras[abaAtiva])
      : []
  }
}