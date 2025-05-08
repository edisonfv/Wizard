<template>
  <div class="container-wrapper">
    <div class="config-company-container main-container">
      <!-- Tarjeta principal con sombra y bordes redondeados -->
      <ion-card class="main-card">
        <ion-card-header class="pb-0">
          <ion-card-title class="card-title">Búsqueda y Validación de RUC</ion-card-title>
          <ion-card-subtitle class="card-subtitle">
            Ingresa el RUC para verificar si la empresa existe en el sistema          </ion-card-subtitle>
        </ion-card-header>
        
        <ion-card-content class="search-section">
          <searchRUC @ruc-searched="handleRucSearched" @ruc-not-found="handleRucNotFound" />
        </ion-card-content>
      </ion-card>

      <!-- Tarjeta de información que aparece cuando se encuentra un RUC -->
      <ion-card v-if="showRucInfo" class="info-card" :class="{ 'error-card': !rucFound }">
        <ion-card-header>
          <ion-card-title class="card-title">{{ rucFound ? 'Información Validada' : 'RUC no encontrado' }}</ion-card-title>
        </ion-card-header>
        
        <ion-card-content class="info-section">
          <informationRUC :ruc-data="rucData" :ruc-found="rucFound" />
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/vue'
import searchRUC from "./components/searchRUC.vue";
import informationRUC from "./components/informationRUC.vue";

// Estado para controlar la visibilidad del componente informationRUC
const showRucInfo = ref(false);
// Estado para controlar si se encontró el RUC
const rucFound = ref(true);

// Datos del RUC que se pasarán al componente informationRUC
const rucData = ref({
  ruc: '',
  razonSocial: '',
  estado: ''
});

// Función que se ejecuta cuando se encuentra un RUC
const handleRucSearched = (data: any) => {
  // Actualizar los datos del RUC
  rucData.value = data;
  // Indicar que se encontró el RUC
  rucFound.value = true;
  // Mostrar el componente informationRUC
  showRucInfo.value = true;
};

// Función que se ejecuta cuando NO se encuentra un RUC
const handleRucNotFound = (rucNumber: string) => {
  // Actualizar los datos del RUC con información mínima
  rucData.value = {
    ruc: rucNumber,
    razonSocial: '',
    estado: 'NO ENCONTRADO'
  };
  // Indicar que NO se encontró el RUC
  rucFound.value = false;
  // Mostrar el componente informationRUC con mensaje de error
  showRucInfo.value = true;
};
</script>

<style scoped>
/* Contenedor principal con centrado */
.container-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Configuración del ancho fijo para pantallas grandes */
.main-container {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .main-container {
    max-width: 768px; /* Ancho fijo de 768px en pantallas de 768px en adelante */
  }
}

.config-company-container {
  width: 100%;
  padding: 0 16px;
}

.main-card, .info-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background-color: #f0f7ff;
  transition: all 0.3s ease;
}

.main-card:hover, .info-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.search-section, .info-section {
  padding: 0px 16px 16px;
}

.info-card {
  background-color: #f0f7ff;
}

/* Estilo para la tarjeta de error */
.error-card {
  background-color: #fff5f5;
}

/* Animación para la tarjeta de información */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-card {
  animation: fadeIn 0.5s ease-out;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .config-company-container {
    padding: 0 8px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
}
</style>