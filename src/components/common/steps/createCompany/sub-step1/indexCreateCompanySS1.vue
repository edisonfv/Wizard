<template>
  <ion-card class="wizard-card">
    <ion-card-content class="wizard-content">
      <!-- Contenedor principal centrado con ancho controlado -->
      <div class="centered-container">
        <div class="unified-form-container">
          <h4 class="section-title">Datos de la Empresa y Matriz</h4>
          
          <!-- Formulario unificado -->
          <div class="form-wrapper">
            <!-- Componente createCompany -->
            <createCompany />
            
            <!-- Componente companySucursal -->
            <companySucursal />
            
            <!-- Componente companyPOS -->
            <div class="pos-section">
              <h4 class="subsection-title">Datos del Punto de Emisión</h4>
              <companyPOS />
            </div>
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent } from '@ionic/vue';
import companyPOS from "@/components/common/steps/createCompany/sub-step1/components/createPOS.vue";
import companySucursal from "@/components/common/steps/createCompany/sub-step1/components/createSucursal.vue";
import createCompany from "@/components/common/steps/createCompany/sub-step1/components/createCompany.vue";
</script>

<style scoped>
/* Estilos para la tarjeta principal */
.wizard-card {
  width: 100%;
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.wizard-content {
  padding: 16px;
}

/* Contenedor centrado con ancho controlado */
.centered-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Contenedor del formulario unificado con ancho controlado */
.unified-form-container {
  width: 60%; /* Mismo ancho que tenía el componente companyPOS original */
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Título principal */
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Contenedor del formulario */
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Sección del punto de emisión */
.pos-section {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

/* Subtítulo para secciones */
.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .unified-form-container {
    width: 90%; /* Ancho mayor en pantallas pequeñas */
    padding: 15px;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .subsection-title {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .unified-form-container {
    width: 100%; /* Ancho completo en pantallas muy pequeñas */
    padding: 12px;
  }
}
</style>