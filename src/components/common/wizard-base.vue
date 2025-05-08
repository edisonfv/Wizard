<template>
  <IonPage>
    <IonContent class="ion-content">
      <!-- Pantalla de bienvenida (se muestra primero) -->
      <welcomeGeneral v-if="!started" @start="handleStart" />
      <!-- Contenido principal del wizard (se muestra después de hacer clic en "Comenzar") -->
      <div v-else class="wizard-container">
        <ProgressBar 
          :steps="steps" 
          :current-step="currentStep" 
          :show-title="true"
          @update:current-step="updateStep"
        />
        <!-- Contenedor del contenido -->
        <div class="wizard-content">
          <!-- Renderizado dinámico basado en el paso actual -->
          <template v-if="hasSubStepsForCurrentStep">
            <!-- Si el paso actual tiene sub-pasos -->
            <div class="sub-step-container">
              <!-- Componente del sub-paso actual -->
              <component 
                :is="currentSubStepComponent"
              />
            </div>
          </template>
          <template v-else>
            <!-- Renderizado normal para pasos sin sub-pasos -->
            <component 
              v-if="currentStepComponent" 
              :is="currentStepComponent" 
            />
          </template>
        </div>
        <!-- Botones de navegación -->
        <div class="navigation-controls">
          <IonButton fill="outline" @click="handlePrevious" :disabled="shouldDisablePreviousButton">
            Anterior
          </IonButton>
          <IonButton @click="handleNext" :disabled="shouldDisableNextButton">
            {{ isLastStepAndSubStep ? 'Finalizado' : 'Siguiente' }}
          </IonButton>
        </div>
      </div>
    </IonContent>
    
    <!-- Modal de confirmación para finalizar el wizard -->
    <ConfirmationModal 
      :is-open="showConfirmationModal"
      title=""
      message=""
      secondary-message=""
      confirm-button-text="Finalizar"
      cancel-button-text="Continuar Editando"
      @confirm="handleConfirmFinish" 
      @cancel="handleCancelFinish"   
    ><finishSummary /> </ConfirmationModal>
    
    <!-- Modal de confirmación para el paso de ventas -->
    <ConfirmationModal 
      :is-open="showSalesConfirmationModal"
      title=""
      message=""
      secondary-message=""
      confirm-button-text="Continuar"
      cancel-button-text="Revisar Datos"
      confirm-button-color="primary"
      @confirm="handleConfirmSalesNext" 
      @cancel="handleCancelSalesNext"
    > 
    <SalesSummary />
    </ConfirmationModal> 
    
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from "@ionic/vue"
import { computed, ref, PropType, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import ProgressBar from "@/components/common/progressBar.vue"
import welcomeGeneral from "@/components/common/welcomeGeneral.vue"
import ConfirmationModal from "@/components/ui/confirmationModal.vue" // Cambiado a la nueva ruta
import { useWizardNavigation } from "@/composables/useWizardNavigation"
import { useWizardStore } from "@/stores/wizardStore"
import type { Component } from "vue"
import { useWizardValidation } from "@/composables/useWizardValidation"
import SalesSummary from "@/components/summary/salesSummary.vue" // Importamos el componente
import finishSummary from "@/components/summary/finishSummary.vue" // Importamos el componente

// Obtener las funciones de validación del composable
const { shouldDisableNextButton, shouldDisablePreviousButton } = useWizardValidation()

// Obtenemos el router para la navegación
const router = useRouter()

// Obtenemos la instancia del store
const wizardStore = useWizardStore()

// Props para configurar el wizard
const props = defineProps({
  // Tipo de wizard (ventas, soporte, cliente, general)
  wizardType: {
    type: String as PropType<"sales" | "soporte" | "cliente" | "general">,
    required: true,
  },
  // Mapeo de componentes para cada paso principal
  stepComponents: {
    type: Object as PropType<Record<string, Component>>,
    required: true,
  },
  // Configuración de sub-pasos
  subStepsConfig: {
    type: Object as PropType<Record<string, Array<{ title: string; component: Component }>>>,
    required: true,
  },
})

// Estado para controlar si se ha iniciado el wizard
const started = ref(false)

// Variable para controlar la visibilidad del modal de confirmación
const showConfirmationModal = ref(false)

// Variable para controlar la visibilidad del modal de confirmación de ventas
const showSalesConfirmationModal = ref(false)

// Inicializamos el wizard con el tipo proporcionado y la configuración de sub-pasos
const {
  // Estado
  currentStep,
  currentSubStepIndex,
  steps,
  currentStepKey,
  
  // Computed properties
  hasSubStepsForCurrentStep,
  currentSubStepComponent,
  isLastStepAndSubStep,
  
  // Funciones de navegación
  next,
  previous,
  goToStep,
  resetSubStep
} = useWizardNavigation(props.wizardType, props.subStepsConfig)

// Obtenemos el componente para el paso actual
const currentStepComponent = computed(() => {
  const key = currentStepKey.value
  return props.stepComponents[key] || null
})

// Actualizamos el estado del wizard cuando cambia el paso
watch(currentStepKey, (newStepKey) => {
  wizardStore.updateWizardState({
    currentStep: newStepKey,
    currentSubStep: currentSubStepIndex.value + 1,
  })

  // Mostrar el estado completo en consola
  console.log("Wizard state actualizado (watch currentStepKey):", {
    wizardState: wizardStore.getCurrentWizardState,
    formData: wizardStore.getAllFormData,
  })
})

// Función para manejar el evento de inicio desde welcomeGeneral
const handleStart = () => {
  started.value = true
  // Actualizar el tipo de wizard en el store
  wizardStore.updateWizardState({
    type: props.wizardType,
  })

  // Mostrar el estado completo en consola
  console.log("Wizard state actualizado (handleStart):", {
    wizardState: wizardStore.getCurrentWizardState,
    formData: wizardStore.getAllFormData,
  })
}

// Función para actualizar los datos de plan y billingFrequency si estamos en el paso data-sales
const updateSalesDataIfNeeded = () => {
  // Verificar si estamos en el paso data-sales y el subpaso 1 (indexSalesDataSS1)
  if (currentStepKey.value === "data-sales" && currentSubStepIndex.value === 0) {
    // Obtener los datos actuales de salesData
    const salesData = wizardStore.getStepData("salesData")

    // Verificar si tenemos datos de plan y billingFrequency para actualizar
    if (salesData && (salesData.plan || salesData.billingFrequency)) {
      // No es necesario hacer nada aquí, ya que los datos se actualizan directamente
      // desde el componente typePlan.vue mediante el watch y las funciones
    }
  }
}

// Modificar la función handleNext para asegurar que los datos se guarden correctamente
const handleNext = () => {
  // Actualizar datos de salesData si es necesario
  updateSalesDataIfNeeded();

  // Si estamos en el último paso y sub-paso y el botón dice "Finalizado"
  if (isLastStepAndSubStep.value) {
    // Mostramos el modal de confirmación en lugar de avanzar
    showConfirmationModal.value = true;
    return;
  }

  // MODIFICACIÓN: Mostrar el modal de confirmación de ventas cuando estamos
  // en el paso data-sales y el subpaso 2 (indexSalesDataSS2)
  if (currentStepKey.value === "data-sales" && currentSubStepIndex.value === 2) {
    // Verificar si se cumplen todas las condiciones para habilitar el botón
    if (!shouldDisableNextButton.value) {
      // Mostrar el modal de confirmación de ventas
      showSalesConfirmationModal.value = true;
      return;
    }
  }

  // Forzar una actualización del store antes de proceder
  if (currentStepKey.value === "config-company") {
    // Esperar un momento para asegurar que los datos se han guardado
    setTimeout(() => {
      // Avanzar al siguiente paso/subpaso usando el nuevo método next()
      const completed = next();
      if (completed) {
        // Aquí podrías manejar la finalización del wizard si es necesario
        console.log("Wizard completado");
      }
    }, 200);
  } else {
    // Para todos los demás casos, procedemos normalmente
    const completed = next();
    if (completed) {
      // Aquí podrías manejar la finalización del wizard si es necesario
      console.log("Wizard completado");
    }
  }
};

// Función para manejar la confirmación del modal de ventas
const handleConfirmSalesNext = () => {
  // Ocultamos el modal
  showSalesConfirmationModal.value = false
  
  // Procedemos al siguiente paso/subpaso usando el nuevo método next()
  next();
}

// Función para manejar la cancelación del modal de ventas
const handleCancelSalesNext = () => {
  // Simplemente ocultamos el modal sin hacer nada más
  showSalesConfirmationModal.value = false
}

// Función para manejar la confirmación del modal
const handleConfirmFinish = () => {
  // Ocultamos el modal
  showConfirmationModal.value = false

  // Obtener todos los datos del formulario para procesar
  const formData = wizardStore.getAllFormData
  console.log("Wizard finalizado con datos:", {
    wizardState: wizardStore.getCurrentWizardState,
    formData: formData,
  })

  // Navegamos a la página de finishedCompany
  router.push("/finished-company")
}

// Función para manejar la cancelación del modal
const handleCancelFinish = () => {
  // Simplemente ocultamos el modal sin hacer nada más
  showConfirmationModal.value = false
}

// Maneja la lógica de navegación "anterior"
const handlePrevious = () => {
  // Usamos el nuevo método previous() para manejar la navegación hacia atrás
  const result = previous();
  
  // Si result es false, significa que estamos en el primer paso y no podemos retroceder más
  if (!result) {
    console.log("No se puede retroceder más, estamos en el primer paso");
  }
  
  // Actualizar el subpaso en el store
  wizardStore.updateWizardState({
    currentSubStep: currentSubStepIndex.value + 1,
  });

  // Mostrar el estado completo en consola
  console.log("Wizard state actualizado (handlePrevious):", {
    wizardState: wizardStore.getCurrentWizardState,
    formData: wizardStore.getAllFormData,
  });
}

// Maneja la actualización manual del paso
const updateStep = (step: number) => {
  // Si cambiamos a un paso diferente, reseteamos el sub-paso
  if (step !== currentStep.value) {
    resetSubStep()
  }
  goToStep(step)

  // Actualizar el estado del wizard cuando se cambia de paso mediante la barra de navegación
  wizardStore.updateWizardState({
    currentStep: steps.value[step]?.key || "",
    currentSubStep: 1, // Reseteamos al primer subpaso
  })

  // Mostrar el estado completo en consola
  console.log("Wizard state actualizado (updateStep - navegación):", {
    wizardState: wizardStore.getCurrentWizardState,
    formData: wizardStore.getAllFormData,
  })
}

//Cargamos los datos iniciales si existen
onMounted(() => {
  // Inicializar currentSubStepIndex a 0 al montar el componente
  resetSubStep()

  // Cargar datos iniciales si están disponibles, por ejemplo de localStorage
  try {
    const savedData = localStorage.getItem("wizardData")
    if (savedData) {
      wizardStore.loadInitialData(JSON.parse(savedData))

      // Mostrar el estado cargado en consola
      console.log("Wizard state cargado desde localStorage:", {
        wizardState: wizardStore.getCurrentWizardState,
        formData: wizardStore.getAllFormData,
      })
    }
  } catch (error) {
    console.error("Error cargando datos guardados:", error)
  }
})

// Define un ref para el estado del wizard
const wizardState = ref({
  currentStep: "",
  currentSubStep: 0,
})

// Modificar el watch para usar copia profunda en los logs
watch([currentStepKey, currentSubStepIndex], () => {
  // Actualiza el estado del wizard con los valores actuales
  wizardState.value = {
    currentStep: currentStepKey.value,
    currentSubStep: currentSubStepIndex.value + 1,
  };

  // Actualiza el estado del wizard en el store
  wizardStore.updateWizardState(wizardState.value);

  // Muestra el estado completo en la consola con copia profunda para evitar referencias
  console.log("Wizard state actualizado (watch currentStepKey y currentSubStepIndex):", {
    wizardState: JSON.parse(JSON.stringify(wizardStore.getCurrentWizardState)),
    formData: JSON.parse(JSON.stringify(wizardStore.getAllFormData))
  });
});
</script>
<style scoped>
.ion-content {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Asegura que ocupe toda la pantalla */
}
.wizard-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permite que crezca */
  height: 100%; /* Asegura que ocupe toda la altura disponible */
}
.wizard-content {
  flex-grow: 1; /* Hace que el contenido ocupe el espacio restante */
  display: flex;
  flex-direction: column; /* Cambiado a column para que el indicador esté arriba */
  align-items: center;
  padding: 0px;
  overflow-y: auto; /* Permite scroll si el contenido es muy grande */
}
.sub-step-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  padding-left: 16px;
  padding-top: 7px;
  padding-bottom: 7px;
  background: white;
  position: sticky; /* Cambiado de static a sticky */
  bottom: 0; /* Fija al fondo */
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); /* Añade una sombra sutil para separar visualmente */
  z-index: 10; /* Asegura que esté por encima de otros elementos */
}
</style>