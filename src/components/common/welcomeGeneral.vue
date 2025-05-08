<template>
  <ion-content>
    <div class="welcome-container" :class="{ 'animate': isAnimated }">
      <!-- Fondo con diseño minimalista y accesible -->
      <div class="minimal-background">
        <div class="gradient-overlay"></div>
      </div>
  
      <!-- Contenido principal con mejor estructura semántica -->
      <div class="content">
        <div class="welcome-card">
          <!-- Logo container como parte de la tarjeta pero sin padding -->
          <div class="logo-wrapper">
            <div class="logo-container" aria-hidden="true">
              <img 
                src="@/assets/icons/logo-horizontal.png" 
                alt="Logo Wanqara" 
                class="logo-image" 
              />
            </div>
          </div>
          
          <!-- Contenido de la tarjeta -->
          <div class="card-content">
            <!-- Título principal con jerarquía clara -->
            <h1 class="welcome-title">¡Bienvenido a Wanqara!</h1>
            
            <!-- Descripción con texto más claro y conciso -->
            <div class="description-container">
              <p class="description-text">
                Este asistente te guiará paso a paso para crear y configurar una empresa de forma rápida y sencilla.
              </p>
            </div>
            
            <!-- Indicación para continuar con mejor contraste y visibilidad -->
            <div class="cta-container">
              <p class="cta-text">
                Haz clic en el botón para comenzar la configuración
              </p>
            </div>

            <!-- Botón Comenzar con mejor accesibilidad y feedback visual -->
            <div class="button-container">
              <ion-button 
                expand="block"
                class="start-button" 
                @click="onStartClick"
                aria-label="Comenzar el proceso de configuración"
              >
                Comenzar
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ion-content>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonContent, IonButton } from '@ionic/vue';

// Estado para controlar las animaciones
const isAnimated = ref(false);

// Definimos el evento que emitirá este componente cuando se haga clic en "Comenzar"
const emit = defineEmits(['start']);

onMounted(() => {
  // Pequeño retraso para asegurar que las transiciones se ejecuten correctamente
  setTimeout(() => {
    isAnimated.value = true;
  }, 100);
});

// Función que se ejecuta cuando se hace clic en el botón "Comenzar"
const onStartClick = () => {
  // Emitimos el evento 'start' para notificar al componente padre
  emit('start');
};
</script>
  
<style scoped>
/* Estilos base con mejor organización */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
  
.welcome-container {
  font-family: var(--ion-font-family);
  min-height: 100vh;
  background-color: white;
  color: var(--ion-color-dark);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
}

/* Fondo minimalista con mejor contraste */
.minimal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #f9f9f9;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(var(--ion-color-primary-rgb), 0.05) 0%, rgba(var(--ion-color-primary-rgb), 0.02) 100%);
}
  
/* Contenido principal con animaciones mejoradas */
.content {
  position: relative;
  z-index: 1;
  text-align: center;
  width: 100%;
  max-width: 600px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.welcome-container.animate .content {
  opacity: 1;
  transform: translateY(0);
}
  
/* Tarjeta de bienvenida con mejor elevación y contraste */
.welcome-card {
  position: relative;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Contenedor del logo que se extiende al ancho completo */
.logo-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}

.logo-container {
  width: 100%;
  height: 100px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(var(--ion-color-primary-rgb), 0.15);
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0.2s;
}

.welcome-container.animate .logo-container {
  opacity: 1;
  transform: scale(1);
}

.logo-image {
  height: 60%;
  object-fit: contain;
}

/* Contenido de la tarjeta con padding adecuado */
.card-content {
  padding: 2rem;
}
  
/* Título con mejor jerarquía visual */
.welcome-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0.4s;
}

.welcome-container.animate .welcome-title {
  opacity: 1;
  transform: translateY(0);
}
  
/* Descripción con mejor legibilidad */
.description-container {
  margin-bottom: 2.5rem;
}
  
.description-text {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0.6s;
}

.welcome-container.animate .description-text {
  opacity: 1;
  transform: translateY(0);
}
  
/* Sección de llamada a la acción con mejor contraste */
.cta-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: rgba(var(--ion-color-primary-rgb), 0.05);
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 0.8s;
}

.welcome-container.animate .cta-container {
  opacity: 1;
  transform: translateY(0);
}
  
.cta-text {
  font-size: 1rem;
  color: var(--ion-color-primary);
  font-weight: 500;
}
  
/* Botón de comenzar con mejor feedback visual */
.button-container {
  margin-top: 2.5rem;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: 1s;
}

.welcome-container.animate .button-container {
  opacity: 1;
  transform: translateY(0);
}
  
.start-button {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --padding-start: 40px;
  --padding-end: 40px;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(var(--ion-color-primary-rgb), 0.2);
  transition: all 0.3s ease;
}
  
.start-button:hover {
  --background: var(--ion-color-primary-shade);
  box-shadow: 0 10px 20px rgba(var(--ion-color-primary-rgb), 0.25);
  transform: translateY(-2px);
}

.start-button:active {
  transform: translateY(1px);
  box-shadow: 0 5px 10px rgba(var(--ion-color-primary-rgb), 0.15);
}
  
/* Ajustes responsivos mejorados */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.8rem;
  }
    
  .description-text {
    font-size: 1rem;
  }
    
  .cta-text {
    font-size: 0.9rem;
  }
    
  .card-content {
    padding: 1.75rem 1.5rem;
  }
    
  .logo-container {
    height: 70px;
  }
}
  
@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.5rem;
  }
    
  .description-text {
    font-size: 0.9rem;
  }
    
  .card-content {
    padding: 1.5rem 1rem;
  }
    
  .logo-container {
    height: 60px;
  }
    
  .start-button {
    --padding-top: 14px;
    --padding-bottom: 14px;
    --padding-start: 30px;
    --padding-end: 30px;
    font-size: 1rem;
  }
}
</style>