<template>
    <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
        <AdminConfig></AdminConfig>
        <main class="flex-1">
            <header
                class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
            >
                <div class="text-[13px] font-bold text-gray-400">
                    Administracao /
                    <span class="text-gray-500">Pontos de Atendimento</span>
                    <span class="text-gray-900">/ Criação Pontos de Atendimento</span>
                </div>
            </header>
            <div class="max-w px-6 mx-auto">
                <div class="flex justify-between items-end mb-10">
                    <div>
                        <h2
                            class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1"
                        >
                            Criação Pontos de Atendimento
                        </h2>
                    </div>
                </div>
            </div>

            <form @submit.prevent="Salvar">
                <div class="flex-row">
                    <label>Descrição</label>
                    <input
                        v-model="form.descricao"
                        class="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder-gray-400"
                        type="text"
                    />
                </div>
                <div class="flex-row">
                    <label>número</label>
                    <input
                        v-model="form.numero"
                        class="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder-gray-400"
                        type="number"
                    />
                </div>
                <!-- Barra de Secretarias -->
                <div class="flex-row">
                    <label for=""> Setores </label>
                    <div
                        @click="abrir = !abrir"
                        class="mt-1 px-3 py-2 border border-gray-300 rounded-xl cursor-pointer flex justify-between w-50"
                    >
                        <span>
                            {{
                                selecionado?.nome ||
                                selecionado?.descricao ||
                                "Selecione um setor"
                            }}
                        </span>
                        <span>
                            <i class="pi pi-angle-down"></i>
                        </span>
                    </div>
                    <div
                        v-if="abrir"
                        class="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow max-h-60 overflow-y-auto w-50"
                    >
                        <div
                            v-for="s in setores"
                            :key="s.id"
                            @click="selecionarSetor(s)"
                            class="text-black-500 px-3 py-2 hover:bg-blue-200 cursor-pointer"
                        >
                            {{ s.nome }}
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
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
            form: {
                descricao: "",
                numero: "",
                setor_id: null,
            },

            abrir: false,
            selecionado: null,
            setores: [],
        };
    },

    async mounted() {
        try {
            const res = await api.get("/setores");
            this.setores = res.data;
            console.log(res.data);
        } catch (e) {
            console.error(e);
        }
    },
    methods: {
        selecionarSetor(setor) {
            console.log(setor);
            this.selecionado = setor;
            this.form.setor_id = setor.id;
            this.abrir = false;
        },
    },
    async Salvar() {
        const payload = {
            descricao: this.form.descricao,
            numero: Number(this.form.numero),
            setorId: this.form.setor_id,
        };
        try {
            await api.post("/pontos-atendimento", payload);
        } catch (e) {
            console.error("Erro ao Cadastrar Ponto de Atendimento: ", e);
        }
    },
};
</script>
