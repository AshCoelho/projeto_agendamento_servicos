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
            <input type="text" />
        </main>
    </div>
</template>

<script>
import AdminConfig from "@/components/AdminConfig.vue";

export default {
    components: { AdminConfig },
};
</script>
