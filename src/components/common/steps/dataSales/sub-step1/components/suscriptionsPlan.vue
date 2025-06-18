<template>
  <div class="suscriptions-plan-info">
    <Icon icon="mdi:information" width="24" height="24" style="color: #000; margin-right: 8px;" />
    <span class="info-text">El plan seleccionado contiene las siguientes suscripciones:</span>
  </div>
  <div class="suscriptions-plan-container">
    <div class="suscription-card" v-for="item in suscriptions" :key="item.id">
      <div class="card-header">
        <span class="card-title">{{ item.title }}</span>
      </div>
      <div class="card-description">{{ item.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { wizardService, type Plan } from '@/services/api';

// Recibe el plan seleccionado como prop
const props = defineProps<{ selectedPlan: string }>();

const suscriptions = ref<any[]>([]);
const planes = ref<Plan[]>([]);

async function cargarPlanes() {
  try {
    const response = await wizardService.getPlanes();
    // Siempre extraer el array de planes correctamente
    if (Array.isArray(response)) {
      planes.value = response;
    } else if (response && typeof response === 'object' && Array.isArray((response as any).data)) {
      planes.value = (response as any).data;
    } else {
      planes.value = [];
    }
    updateSuscriptions();
  } catch (e) {
    planes.value = [];
    suscriptions.value = [];
  }
}

function updateSuscriptions() {
  const plan = planes.value.find(p => p.value === props.selectedPlan);
  if (plan && Array.isArray((plan as any).subscriptions)) {
    suscriptions.value = (plan as any).subscriptions;
  } else {
    suscriptions.value = [];
  }
}

onMounted(() => {
  cargarPlanes();
});

watch(
  () => props.selectedPlan,
  () => {
    updateSuscriptions();
  },
  { immediate: true, flush: 'post' }
);
</script>

<style scoped>
.suscriptions-plan-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 1.05rem;
  color: #222;
  font-weight: 500;
}
.info-text {
  color: #222;
}
.suscriptions-plan-container {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin: 18px 0 0 0;
  justify-content: center;
}
.suscription-card {
  background: #f0f7ff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 0 0 18px 0;
  min-width: 220px;
  max-width: 260px;
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s;
  overflow: hidden;
}
.suscription-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}
.card-header {
  width: 100%;
  background: #0057ff;
  padding: 14px 20px 10px 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.card-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}
.card-description {
  font-size: 0.97rem;
  color: #475569;
  padding: 16px 20px 0 20px;
}
</style>
