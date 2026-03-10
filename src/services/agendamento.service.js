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
      // Volta a mostrar TODOS os aguardando, para o atendente ver o dia inteiro
      'AGUARDANDO': (a) => 
        a.situacao === 'AGENDADO' && 
        ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),

      'PRIORIDADES': (a) => 
        a.situacao === 'AGENDADO' && 
        a.tipoAtendimento.includes('PRIORIDADE'),

      // A regra que importa: Aba 'EM_ATENDIMENTO' mostra apenas o SEU paciente
      'ATENDIMENTO': (a) => {
        const idNoBanco = Number(a.gerenciadorId || a.usuarioId);
        const ocupado = ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao);
        const ehMeu = idNoBanco === Number(meuUsuarioId);
        
        return ocupado && ehMeu;
      },

      'CANCELADOS': (a) => ['FALTOU'].includes(a.situacao),
      'FINALIZADOS': (a) => ['ATENDIDO'].includes(a.situacao)
    }

    return regras[abaAtiva] ? listaNormalizada.filter(regras[abaAtiva]) : listaNormalizada
  }
}