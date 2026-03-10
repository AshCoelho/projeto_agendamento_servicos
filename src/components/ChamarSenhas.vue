<template>
  <div class="px-8 grid grid-cols-4 gap-6 mb-5">
    <div
      class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
    >
      <div>
        <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendimentos Hoje</p>
        <h3 class="text-3xl font-black text-gray-800">{{ totalRegistradosHoje }}</h3>
        <span class="inline-block w-8 h-1 bg-blue-grey-darken-4 rounded-full"></span>
        <div class="flex gap-2 mt-2">
          <span class="text-[11px] font-bold text-blue-500 uppercase">
            {{ totalNormalGeral }} Normal
          </span>
          <span class="text-[11px] font-bold text-orange-500 uppercase">
            {{ totalPrioridadeGeral }} Prioridade
          </span>
        </div>
      </div>
      <div class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray">
        <i class="pi pi-calendar"></i>
      </div>
    </div>

    <div
      class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
    >
      <div>
        <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Pessoas na Fila</p>
        <h3 class="text-3xl font-black text-gray-800">{{ agendamentosAguardando }}</h3>
        <span class="inline-block w-8 h-1 bg-amber-lighten-2 rounded-full"></span>
        <div class="flex gap-2 mt-2">
          <span class="text-[11px] font-bold text-blue-500 uppercase">
            {{ totalNormalFila }} Normal
          </span>
          <span class="text-[11px] font-bold text-orange-500 uppercase">
            {{ totalPrioridadeFila }} Prioridade
          </span>
        </div>
      </div>

      <div class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray">
        <i class="pi pi-users text-lg"></i>
      </div>
    </div>

    <div
      class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
    >
      <div>
        <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendidos</p>
        <h3 class="text-3xl font-black text-gray-800">{{ agendamentosFinalizados }}</h3>
        <span class="inline-block w-8 h-1 bg-green-600 rounded-full"></span>
      </div>
      <div class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray">
        <i class="pi pi-verified"></i>
      </div>
    </div>

    <div
      class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
    >
      <div>
        <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Ausentes</p>
        <h3 class="text-3xl font-black text-gray-800">{{ agendamentosCancelados }}</h3>
        <span class="inline-block w-8 h-1 bg-red-600 rounded-full"></span>
      </div>
      <div class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray">
        <i class="pi pi-times-circle"></i>
      </div>
    </div>
  </div>

  <div class="px-8">
    <div class="px-8 mb-6 bg-white p-6 rounded-[15px] shadow-sm border-b-4 border-transparent">
      <h2 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
        Painel de Comandos
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          @click="handleChamarNormal"
          class="cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
        >
          <div>
            <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">Ação</p>
            <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Normal</h3>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-volume-up text-xl"></i>
          </div>
        </div>

        <div
          class="cursor-pointer bg-[#FFA000] hover:bg-[#FF8F00] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
        >
          <div @click="handleChamarPrioridade">
            <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">Ação</p>
            <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Prioridade</h3>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-bolt text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  data: () => ({
    // UI/Controle
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    paginaAtual: 1,
    itensPorPagina: 3,
    mostrarModalEdicao: false,
    mostrarModalEspontaneo: false,
    sidebarAberta: false,

    // Dados
    filtroTexto: '',
    usuario: null,
    setorTrabalhoId: null,
    secretariaTrabalhoId: null,
    enderecoEstatico: null,
    agendamentosPorSetor: [],
    selectedItem: null,
    idsChamadosManualmente: [],
    servicos: [],
    tiposAtendimento: [],
    horaAtual: new Date(),

    // Formulários
    novoAgendamento: { nomeCidadao: '', servico: null, tipoAtendimentoId: null },
  }),

  watch: {
    mostrarModalEspontaneo(novoValor) {
      const acao = novoValor ? 'addEventListener' : 'removeEventListener'
      window[acao]('keydown', this.handleEsc)
    },
  },

  computed: {
    temAtendimentoAtivo() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))

      if (!this.agendamentosPorSetor.length) return false

      return this.agendamentosPorSetor.some((a) => {
        const status = a.situacao?.toUpperCase()
        // 🟢 O campo que seu SQL preenche é o gerenciadorId
        const idNoBanco = Number(a.gerenciadorId)
        console.log(idNoBanco)

        const ocupado = status === 'CHAMADO' || status === 'EM_ATENDIMENTO'
        const ehMeu = idNoBanco === meuId

        return ocupado && ehMeu
      })
    },

    totalRegistradosHoje() {
      return this.agendamentosPorSetor.length
    },
    totalNormalGeral() {
      return this.agendamentosPorSetor.filter((a) => a.tipoAtendimento === 'NORMAL').length
    },
    totalPrioridadeGeral() {
      return this.agendamentosPorSetor.filter((a) => a.tipoAtendimento === 'PRIORIDADE').length
    },

    agendamentosFiltrados() {
      // 🟢 Pegamos o seu ID aqui
      const meuId = this.usuario?.id || localStorage.getItem('usuarioId')

      let lista = AgendamentoService.filtrarAgendamentos(
        this.agendamentosPorSetor,
        this.abaAtiva,
        this.idsChamadosManualmente,
        meuId, // 🟢 Enviamos o seu ID como 4º parâmetro
      )

      if (this.filtroTexto && this.filtroTexto.trim() !== '') {
        const termo = this.filtroTexto.toLowerCase()
        lista = lista.filter((item) => {
          const senha = item.senha ? item.senha.toLowerCase() : ''
          const nome = item.usuarioNome ? item.usuarioNome.toLowerCase() : ''
          return senha.includes(termo) || nome.includes(termo)
        })
      }

      return lista
    },

    agendamentosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina
      return this.agendamentosFiltrados.slice(inicio, inicio + this.itensPorPagina)
    },
    totalPaginas() {
      return Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina) || 1
    },
    agendamentosAguardando() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),
      ).length
    },

    agendamentosFinalizados() {
      return this.agendamentosPorSetor.filter((a) => a.situacao === 'ATENDIDO').length
    },
    agendamentosCancelados() {
      return this.agendamentosPorSetor.filter((a) => a.situacao === 'FALTOU').length
    },
    totalNormalFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento === 'NORMAL',
      ).length
    },
    totalPrioridadeFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento.includes('PRIORIDADE'),
      ).length
    },
  },

  methods: {
    mudarAba(novaAba) {
      this.abaAtiva = novaAba
      this.paginaAtual = 1
    },
    handleEsc(e) {
      if (e.key === 'Escape') this.mostrarModalEspontaneo = false
    },
    agendamentoSelecionado(item) {
      this.selectedItem = item
      this.mostrarModalEdicao = true
    },

    atualizarRelogioLocal() {
      this.horaAtual = new Date() // 🟢 Mantemos um objeto Date fresco
      this.relogio = this.horaAtual.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },

    formatarDataHora(data) {
      if (!data) return ''
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async handleLogout() {
      // 1. Pegamos os dados ANTES de qualquer tentativa de limpeza
      const token = localStorage.getItem('token')
      const usuarioId = this.usuario?.id || localStorage.getItem('usuarioId')

      console.log('Iniciando processo de saída para o usuário:', usuarioId)

      try {
        if (usuarioId && token) {
          // 2. FORÇAMOS o await. O código vai PARAR aqui até o Java responder 200 OK.
          // Se não tiver await, o router.push muda a página e mata a requisição no meio.
          await AtendenteApi.deslogarGuiche(usuarioId)
          console.log('Banco de dados atualizado: Guichê liberado.')
        } else {
          console.warn('Aviso: usuarioId ou token não encontrados para limpar guichê.')
        }
      } catch (error) {
        // Se der erro (ex: token expirado), logamos mas não travamos o usuário na tela
        console.error('Erro técnico ao deslogar guichê:', error.response?.data || error.message)
      } finally {
        // 3. AGORA SIM, com o banco resolvido, limpamos o resto
        console.log('Limpando dados locais e redirecionando...')
        localStorage.clear()
        this.usuario = null
        this.$router.push({ name: 'login' })
      }
    },

    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        this.setorTrabalhoId = localStorage.getItem('setorTrabalhoId')
        this.secretariaTrabalhoId = localStorage.getItem('secretariaTrabalhoId')

        if (!token || !this.setorTrabalhoId) return this.$router.push({ name: 'login' })

        const { data } = await AtendenteApi.getUsuarioLogado()
        this.usuario = data

        if (data.id) {
          localStorage.setItem('usuarioId', data.id)
        }
      } catch (error) {
        // Se falhar ao pegar o usuário, limpa tudo
        localStorage.clear()
        this.$router.push({ name: 'login' })
      }
    },

    async buscarAgendamentos() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()
        if (this.setorTrabalhoId) {
          const data = await AtendenteApi.buscarAgendamentosPorSetor(this.setorTrabalhoId)
          this.agendamentosPorSetor = [...data]

          // 🔍 LINHA PARA DEBUG SEGURO
          console.log('MEU ID:', this.usuario.id)
          console.log(
            'LISTA DO BANCO:',
            this.agendamentosPorSetor.map((a) => ({
              senha: a.senha,
              status: a.situacao,
              idAtendenteNoObjeto:
                this.usuario.id || a.atendenteId || (a.usuario ? a.usuario.id : 'NULO'),
            })),
          )
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e)
      }
    },

    async handleChamar(senha) {
      const itemClicado = this.agendamentosPorSetor.find((a) => a.senha === senha)
      if (!itemClicado) return

      const statusClicado = itemClicado.situacao?.toUpperCase()
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      const donoDoItemClicado = Number(itemClicado.gerenciadorId || itemClicado.usuarioId)

      // 🟢 O SEGREDO: Verifica se o botão clicado é da senha que você já está atendendo
      const ehMinhaSenhaAtual =
        (statusClicado === 'EM_ATENDIMENTO' || statusClicado === 'CHAMADO') &&
        donoDoItemClicado === meuId

      // 🛑 TRAVA: Se você está ocupado E tentou chamar uma senha DIFERENTE da atual, bloqueia.
      if (this.temAtendimentoAtivo && !ehMinhaSenhaAtual) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar outra senha.')
        return
      }

      try {
        // Se passou pela trava (porque está livre OU porque está rechamando a própria senha), dispara para a API
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id, this.setorTrabalhoId)

        if (res.status === 200) {
          if (itemClicado)
            this.idsChamadosManualmente.push(itemClicado.agendamentoId || itemClicado.id)

          this.abaAtiva = 'ATENDIMENTO'
          await this.buscarAgendamentos()
        }
      } catch (e) {
        alert(e?.response?.data?.mensagem || 'Falha na chamada.')
      }
    },

    async handleChamarNormal() {
      // 1ª VALIDAÇÃO: Você está ocupado?
      if (this.temAtendimentoAtivo) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar o próximo.')
        return
      }

      // 2ª VALIDAÇÃO: Tem alguém na fila? (Verifica se o total da fila normal é zero)
      if (this.totalNormalFila === 0) {
        alert('Não há pacientes aguardando na fila de atendimento NORMAL.')
        return
      }

      try {
        const { data } = await AtendenteApi.chamarNormal(this.setorTrabalhoId, this.usuario.id)
        if (data && data.sucesso === false) {
          alert(data.mensagem)
        }
      } catch (error) {
        console.error('Erro técnico:', error)
        alert('Falha ao chamar: Ocorreu um erro na comunicação com o servidor.')
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleChamarPrioridade() {
      if (this.temAtendimentoAtivo) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar o próximo.')
        return
      }

      try {
        const response = await AtendenteApi.chamarPrioridade(this.setorTrabalhoId, this.usuario.id)
        const dados = response.data || response

        // Cenário A: Fila Vazia
        if (dados && dados.sucesso === false) {
          alert(dados.mensagem)
        }
        // 🟢 Cenário B: SUCESSO! A tela precisa reagir e mudar de aba
        else if (dados && dados.sucesso === true) {
          if (dados.id) {
            this.idsChamadosManualmente.push(dados.id)
          }
          this.abaAtiva = 'ATENDIMENTO' // Pula para a aba do paciente atual
        }
      } catch (error) {
        console.error('Erro técnico:', error)
        const msgErro =
          error.response?.data?.mensagem ||
          error.response?.data ||
          'Ocorreu um erro ao tentar chamar.'

        if (typeof msgErro === 'string') {
          alert(msgErro)
        } else {
          alert('Erro na comunicação com o servidor.')
        }
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar?')) return
      try {
        const token = localStorage.getItem('token')
        await AtendenteApi.cancelarAtendimento(id, token)

        // Limpa o estado local imediatamente
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // Força uma limpeza na lista local para evitar que o usuário clique de novo antes do refresh
        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) this.agendamentosPorSetor[index].situacao = 'FALTOU'

        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try {
        // 1. Envia a finalização para o servidor
        await AtendenteApi.finalizarAtendimento(id)

        // 🟢 O SEGREDO: Remove o ID da lista de chamados manuais.
        // Se não remover, o "computed" do Vue acha que ele ainda está sendo chamado.
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // 2. Delay levemente maior (400ms) para o banco de dados processar o commit
        await new Promise((resolve) => setTimeout(resolve, 400))

        // 3. Fecha o modal primeiro para melhorar a experiência do usuário (UX)
        this.mostrarModalEdicao = false

        // 4. Força a busca dos novos dados
        await this.buscarAgendamentos()

        // 5. Opcional: Se quiser que ele vá direto para a aba de finalizados após concluir
        this.abaAtiva = 'FINALIZADO'
      } catch (e) {
        console.error('Erro ao finalizar:', e)
        alert('Erro ao finalizar atendimento.')
      }
    },

    async salvarEspontaneo() {
      try {
        if (!this.novoAgendamento.nomeCidadao || !this.novoAgendamento.servico) {
          alert('Preencha o nome e selecione o serviço.')
          return
        }

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          tipoAtendimentoId: Number(this.novoAgendamento.tipoAtendimentoId),
          servicoId: Number(this.novoAgendamento.servico),
          setorId: Number(this.setorTrabalhoId),
          situacao: 'AGENDADO',
        }

        // 1. Chamada para a API
        const res = await AtendenteApi.salvarEspontaneo(this.secretariaTrabalhoId, payload)

        // 2. Verificação robusta: 200 ou 201 são sucessos
        if (res.status === 200 || res.status === 201) {
          // Opcional: Pegar a senha gerada que vem no DTO de resposta
          const senhaGerada = res.data?.senha || ''

          this.mostrarModalEspontaneo = false

          // Reseta o formulário
          this.novoAgendamento = { nomeCidadao: '', servico: null, tipoAtendimentoId: null }

          // 3. Atualiza as listas
          await this.buscarAgendamentos()
          await this.carregarTiposAtendimento()

          alert(`Atendimento registrado! Senha: ${senhaGerada}`)
        }
      } catch (e) {
        // Se caiu aqui e o registro salvou, pode ser que o res.status veio diferente
        // ou a AtendenteApi lançou um erro ao tentar ler a resposta.
        console.error('Erro ao salvar:', e)

        // Verifique se o erro não é apenas um "undefined" na mensagem
        const msgErro = e.response?.data?.mensagem || e.message || 'Erro de comunicação'
        alert('Erro: ' + msgErro)
      }
    },

    async atualizarEspontaneo() {
      try {
        const idServico = this.selectedItem.servicoId || this.selectedItem.servico?.id
        const payload = { nomeCidadao: this.selectedItem.usuarioNome, servicoId: Number(idServico) }
        const token = localStorage.getItem('token')
        await AtendenteApi.atualizarEspontaneo(this.selectedItem.agendamentoId, payload, token)
        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao atualizar.')
      }
    },

    async carregarServicos() {
      try {
        const res = await AtendenteApi.carregarServicos(this.secretariaTrabalhoId)
        this.servicos = res.data
      } catch (e) {
        console.error(e)
      }
    },

    async carregarTiposAtendimento() {
      try {
        const { data } = await AtendenteApi.carregarTiposAtendimento(this.secretariaTrabalhoId)

        // 🟢 Substitui a lista antiga pelos dados reais do banco
        this.tiposAtendimento = data

        // Seleciona o 'NORMAL' automaticamente se disponível
        if (data.length > 0 && !this.novoAgendamento.tipoAtendimentoId) {
          const padrao = data.find((t) => t.nome.toUpperCase() === 'NORMAL')
          if (padrao) this.novoAgendamento.tipoAtendimentoId = padrao.id
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    },

    //handleLogout() { localStorage.clear(); this.$router.push({ name: 'login' }) }
  },

  async mounted() {
    await this.getUsuarioLogado()
    // 🟢 1. CHAMA IMEDIATAMENTE: A tela carrega na hora!
    await this.buscarAgendamentos()

    // 🟢 2. LIGA O LOOP: Agora ele só atualiza o que mudou a cada 3 segundos
    setInterval(() => {
      this.buscarAgendamentos()
    }, 3000)
    this.carregarServicos()
    this.carregarTiposAtendimento()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)

    // ✅ Define o texto do endereço/unidade com base no setor atual
    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },
}
</script>
