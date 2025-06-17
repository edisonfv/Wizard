<template>
  <div class="information-ruc-container">
    <!-- Mensaje de éxito cuando el RUC no existe pero es válido para continuar -->
    <div v-if="rucValidForContinue" class="success-message">
      <Icon icon="mdi:check-circle" class="success-icon" />
      <div class="success-content">
        <h5 class="success-title">RUC válido para continuar</h5>
        <p class="success-description">
          El RUC <strong>{{ rucData.ruc }}</strong> no existe en el sistema, pero es válido para continuar con el registro.
        </p>
      </div>
    </div>

    <!-- Mensaje de error cuando no se encuentra el RUC y no es válido para continuar -->
    <div v-else-if="!rucFound" class="error-message">
      <Icon icon="mdi:alert-circle" class="error-icon" />
      <div class="error-content">
        <h5 class="error-title">RUC no encontrado</h5>
        <p class="error-description">
          No se ha encontrado información para el RUC: <strong>{{ rucData.ruc }}</strong>
        </p>
        <p class="error-suggestion">
          Por favor, verifica que el número ingresado sea correcto e intenta nuevamente.
        </p>
      </div>
    </div>

    <!-- Contenedor de la información del RUC (se muestra solo si se encontró el RUC) -->
    <div v-else class="ruc-info-grid">
      <!-- RUC -->
      <div class="info-card">
        <div class="info-header">
          <Icon icon="mdi:file-document-outline" class="info-icon" />
          <h5 class="info-title">RUC</h5>
        </div>
        <div class="info-value">{{ rucData.ruc }}</div>
      </div>
      
      <!-- Razón social -->
      <div class="info-card">
        <div class="info-header">
          <Icon icon="mdi:domain" class="info-icon" />
          <h5 class="info-title">Razón social</h5>
        </div>
        <div class="info-value">{{ rucData.razonSocial }}</div>
      </div>
      
      <!-- Estado contribuyente -->
      <div class="info-card">
        <div class="info-header">
          <Icon icon="mdi:check-circle-outline" class="info-icon" />
          <h5 class="info-title">Estado contribuyente</h5>
        </div>
        <div class="info-value" :class="{ 'estado-activo': rucData.estado === 'ACTIVO' }">
          <div class="status-indicator" :class="{ 'active': rucData.estado === 'ACTIVO' }"></div>
          {{ rucData.estado }}
        </div>
      </div>
    </div>
    
    <!-- Mensaje de confirmación (solo si el estado es ACTIVO) -->
    <div class="confirmation-message" v-if="rucFound && rucData.estado === 'ACTIVO'">
      <Icon icon="mdi:check-circle" class="confirmation-icon" />
      <p>La información del RUC ha sido validada correctamente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

// Definición de la interfaz para los datos del RUC
interface RucData {
  ruc: string;
  razonSocial: string;
  estado: string;
}

// Recibir los datos del RUC y el estado de búsqueda como props desde el componente padre
defineProps<{
  rucData: RucData;
  rucFound: boolean;
  rucValidForContinue?: boolean;
}>();
</script>

<style scoped>
.information-ruc-container {
  width: 100%;
  padding: 0;
}

.ruc-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.info-card {
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.info-icon {
  color: var(--ion-color-primary);
  font-size: 18px;
}

.info-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin: 0;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.estado-activo {
  color: #10b981;
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
}

.status-indicator.active {
  background-color: #10b981;
}

.confirmation-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
}

.confirmation-icon {
  color: #10b981;
  font-size: 20px;
}

.confirmation-message p {
  margin: 0;
  color: #10b981;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Estilos para el mensaje de error */
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.error-icon {
  color: #ef4444;
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ef4444;
  margin: 0 0 8px 0;
}

.error-description, .error-suggestion {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-suggestion {
  color: #666;
}

/* Estilos para el mensaje de éxito */
.success-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.success-icon {
  color: #22c55e;
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.success-content {
  flex: 1;
}

.success-title {
  font-size: 1rem;
  font-weight: 600;
  color: #22c55e;
  margin: 0 0 8px 0;
}

.success-description {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .ruc-info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .info-card {
    padding: 8px;
  }
  
  .error-message {
    padding: 12px;
  }
}
</style>