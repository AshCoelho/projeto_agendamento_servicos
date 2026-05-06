<template>
    <div class="min-h-screen bg-gray-100 p-4 gap-5">
        <!-- BACK -->
        <div>
            <button
                @click="logout"
                title="Sair"
                class="flex items-center justify-center mt-3 p-2 rounded-full hover:bg-black-600 transition-colors"
            >
                <vue-feather type="arrow-left" size="32" stroke="black"></vue-feather>
            </button>
        </div>

        <!-- HEADER -->
        <div class="mb-4">
            <h1 class="text-xl font-bold font-['PT Serif']">Olá, {{ usuario?.nome }}</h1>
            <p class="text-gray-500">{{ usuario?.email }}</p>
        </div>

        <!-- DADOS -->
        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h2 class="font-bold mb-2">Seus dados</h2>

            <div class="grid grid-cols-2 md:grid-cols-2 gap-2 text-xs">
                <p><b>CPF:</b> {{ usuario?.login }}</p>
                <p><b>Celular:</b> {{ usuario?.celular }}</p>
                <p><b>Cidade:</b> {{ usuario?.cidade }}</p>
                <p><b>Estado:</b> {{ usuario?.estado }}</p>
                <p><b>Bairro:</b> {{ usuario?.bairro }}</p>
            </div>
        </div>

        <!-- HISTÓRICO -->
        <div class="bg-white rounded-xl shadow p-4">
            <h2 class="font-bold mb-2">Histórico de Agendamentos</h2>

            <div v-if="carregando">Carregando...</div>

            <div v-else-if="historico.length === 0">
                <p class="italic text-gray-600">Nenhum agendamento encontrado</p>
                <button
                    @click="Agendar"
                    class="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    <vue-feather type="calendar" size="18" stroke="white"></vue-feather>
                    <b> Agendar </b>
                </button>
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="item in historico"
                    :key="item.id"
                    class="border rounded-lg p-3"
                >
                    <p><b>Senha:</b> {{ item.senha }}</p>
                    <p><b>Status:</b> {{ item.situacao }}</p>
                    <p><b>Data:</b> {{ formatarData(item.horaAgendamento) }}</p>
                    <p><b>Serviço:</b> {{ item.servico }}</p>
                    <p><b>Setor:</b> {{ item.setor }}</p>
                </div>
            </div>
        </div>
        <!-- SAIR -->
        <div>
            <button
                @click="logout"
                class="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Sair
            </button>
        </div>
    </div>
</template>

<script>
import api from "@/services/api";
import { ArrowBigLeft, ArrowBigLeftDash } from "lucide-vue-next";

export default {
    name: "UsuarioView",

    data() {
        return {
            usuario: null,
            historico: [],
            carregando: false,
        };
    },

    async created() {
        await this.buscarUsuarioLogado();
    },

    methods: {
        async buscarUsuarioLogado() {
            try {
                const { data } = await api.get("/gerenciador/usuario-logado");

                this.usuario = data;

                if (this.usuario?.login) {
                    await this.buscarHistorico();
                }
            } catch (error) {
                console.error("Erro ao buscar usuário logado:", error);
                this.logout();
            }
        },

        async buscarHistorico() {
            this.carregando = true;
            try {
                const cpf = this.usuario.login;

                const { data } = await api.get(`/agendamentos/historico/${cpf}`);

                this.historico = data;
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                this.carregando = false;
            }
        },

        formatarData(data) {
            if (!data) return "-";
            return new Date(data).toLocaleString("pt-BR");
        },

        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("usuarioId");
            this.$router.push("/");
        },

        Agendar() {
            this.$router.push("/externo");
        },
    },
};
</script>
