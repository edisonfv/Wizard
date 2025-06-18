<template>
  <ion-card class="w-full shadow-md rounded-xl overflow-hidden">
    <ion-card-content class="p-4">
      <typePlan v-model:selectedPlan="selectedPlan" />
      <suscriptionsPlan v-if="selectedPlan" :selected-plan="selectedPlan" />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonCard, IonCardContent } from '@ionic/vue'
import typePlan from "@/components/common/steps/dataSales/sub-step1/components/typePlan.vue"
import suscriptionsPlan from "@/components/common/steps/dataSales/sub-step1/components/suscriptionsPlan.vue"
import { useWizardStore } from '@/stores/wizardStore';

const selectedPlan = ref("");

// Limpiar todo el formData al entrar a este paso
const wizardStore = useWizardStore();
onMounted(() => {
  wizardStore.resetCompanyCreation(); // Ahora limpia todo el formData
});
</script>