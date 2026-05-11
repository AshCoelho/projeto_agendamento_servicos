<template>
    <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
        <AdminConfig></AdminConfig>

        <main class="flex-1">
            <header
                class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
            >
                <div class="text-[13px] font-bold text-gray-400">
                    Administracao /
                    <span class="text-gray-900">Pontos de Atendimento</span>
                </div>
            </header>

            <div class="max-w px-6 mx-auto">
                <div class="flex justify-between items-end mb-10">
                    <div>
                        <h2
                            class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1"
                        >
                            Localidades e Unidades
                        </h2>
                    </div>

                    <button
                        @click="alterarRota('create')"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
                    >
                        <i class="pi pi-plus"></i>
                        Novo Ponto de Atendimento
                    </button>
                </div>
            </div>

            <div class="px-4">
                <div
                    v-if="erro"
                    class="bg-red-50 text-red-600 border border-red-100 rounded-lg p-4 mb-4 text-sm font-bold"
                >
                    {{ erro }}
                </div>

                <div
                    class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden"
                >
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50 text-center"
                            >
                                <th class="px-6 py-5">Descricao</th>
                                <th class="px-6 py-5">Numero</th>
                                <th class="px-6 py-5">Secretaria</th>
                                <th class="px-6 py-5">Setor</th>
                                <th class="px-6 py-5 text-center">Status</th>
                                <th class="px-6 py-5 text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-50">
                            <tr v-if="carregando">
                                <td
                                    colspan="5"
                                    class="px-6 py-10 text-center text-gray-400 text-xs uppercase font-bold"
                                >
                                    Carregando pontos de atendimento...
                                </td>
                            </tr>

                            <tr
                                v-for="ponto in pontosAtendimento"
                                v-else
                                :key="ponto.id"
                                class="hover:bg-blue-50/30 transition-colors"
                            >
                                <td class="px-6 py-4 text-center">
                                    <div class="font-bold text-sm text-[#1e3a8a]">
                                        {{ ponto.descricao || "Ponto de atendimento" }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm font-bold text-center">
                                    {{ ponto.numero ?? "-" }}
                                </td>
                                <td
                                    class="px-6 py-4 text-[11px] text-gray-500 text-center"
                                >
                                    {{
                                        ponto.nomeSecretaria ||
                                        ponto.secretaria?.nome ||
                                        ponto.setor?.secretaria?.nome ||
                                        "-"
                                    }}
                                </td>
                                <td
                                    class="px-6 py-4 text-[11px] text-gray-500 text-center"
                                >
                                    {{ ponto.nomeSetor || ponto.setor?.nome || "-" }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="px-3 py-1 rounded-full text-[9px] font-black uppercase border"
                                        :class="
                                            ponto.ocupado
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-green-50 text-green-600 border-green-100'
                                        "
                                    >
                                        {{ ponto.ocupado ? "Ocupado" : "Livre" }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <button
                                        @click="alterarRota()"
                                        class="hover:bg-gray-200 w-10 h-10 rounded-full"
                                    >
                                        <i class="pi pi-pencil"></i>
                                    </button>
                                    <button
                                        @click="alterarRota()"
                                        class="hover:bg-gray-200 w-10 h-10 rounded-full"
                                    >
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </td>
                            </tr>

                            <tr v-if="!carregando && pontosAtendimento.length === 0">
                                <td
                                    colspan="5"
                                    class="px-6 py-10 text-center text-gray-400 text-xs uppercase font-bold"
                                >
                                    Nenhum ponto de atendimento encontrado
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import AdminConfig from "@/components/AdminConfig.vue";
import api from "@/services/api";

export default {
    components: { AdminConfig },

    data() {
        return {
            usuario: null,
            pontosAtendimento: [],
            carregando: false,
            erro: "",
        };
    },

    methods: {
        formatarPontos(pontos) {
            return pontos.map((ponto) => ({
                ...ponto,
                secretariaNome:
                    ponto.secretariaNome ||
                    ponto.secretaria?.nome ||
                    ponto.setor?.secretariaNome ||
                    ponto.setor?.secretaria?.nome ||
                    "",
                setorNome: ponto.setorNome || ponto.setor?.nome || "",
            }));
        },

        alterarRota(acao) {
            const rotas = {
              create: `/adm/cadastro-pontoatendimento`,
            };
            this.$router.push(rotas[acao]);
        },

        async carregarPontosAtendimento() {
            this.carregando = true;
            this.erro = "";

            try {
                const { data } = await api.get("/pontos-atendimento");
                const pontos = this.formatarPontos(Array.isArray(data) ? data : []);

                this.pontosAtendimento = pontos.sort((a, b) => {
                    const secretariaA = a.nomeSecretaria || "";
                    const secretariaB = b.nomeSecretaria || "";

                    

                    if (secretariaA !== secretariaB) {
                        return secretariaA.localeCompare(secretariaB);
                    }

                    const setorA = a.nomeSetor || "";
                    const setorB = b.nomeSetor || "";
                    if (setorA !== setorB) return setorA.localeCompare(setorB);

                    return Number(a.numero || 0) - Number(b.numero || 0);
                });
            } catch (e) {
                console.error("Erro ao carregar pontos de atendimento:", e);
                this.erro =
                    e.response?.data?.mensagem ||
                    "Erro ao carregar pontos de atendimento.";
                this.pontosAtendimento = [];
            } finally {
                this.carregando = false;
            }
        },
    },

    mounted() {
        this.carregarPontosAtendimento();
    },
};
</script>
