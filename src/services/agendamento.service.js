export const AgendamentoService = {
  filtrarAgendamentos(lista, abaAtiva, idsChamadosManualmente, meuUsuarioId) {
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
      'AGUARDANDO': (a) => 
        a.situacao === 'AGENDADO' && 
        ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),

      'PRIORIDADES': (a) => 
        a.situacao === 'AGENDADO' && 
        a.tipoAtendimento.includes('PRIORIDADE'),

      'ATENDIMENTO': (a) => {
        // 🟢 APENAS gerenciadorId. Se vier nulo, vira 0 e a regra bloqueia com segurança.
        const idNoBanco = Number(a.gerenciadorId);
        const ocupado = ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao);
        return ocupado && idNoBanco === Number(meuUsuarioId);
      },

      'CANCELADOS': (a) => {
        const idNoBanco = Number(a.gerenciadorId);
        return a.situacao === 'FALTOU' && idNoBanco === Number(meuUsuarioId);
      },

      'FINALIZADOS': (a) => {
        const idNoBanco = Number(a.gerenciadorId);
        return a.situacao === 'ATENDIDO' && idNoBanco === Number(meuUsuarioId);
      }
    }

    // Apelidos de segurança
    regras['FINALIZADO'] = regras['FINALIZADOS'];
    regras['ATENDIDOS'] = regras['FINALIZADOS'];
    regras['CANCELADO'] = regras['CANCELADOS'];
    regras['AUSENTES'] = regras['CANCELADOS'];

    // Retorna a lista filtrada ou vazio se a aba não existir
    return regras[abaAtiva] ? listaNormalizada.filter(regras[abaAtiva]) : [];
  }
}