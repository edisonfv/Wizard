<template>
  <div class="w-full flex justify-center">
    <ion-card class="shadow-md rounded-2xl overflow-hidden w-full main-container">
      <ion-card-content>
        <div class="w-full flex flex-col gap-3">
          <!-- Primera fila: contiene vendor-section y payment-section -->
          <div class="flex flex-col md:flex-row w-full justify-center gap-4">
            <!-- Sección de selección de vendedor -->
            <div class="p-3 rounded-xl shadow-sm bg-blue-50 w-full vendor-section">
              <h4 class="text-lg font-semibold text-gray-800 border-opacity-6">
                Selecciona tu nombre para registrar la venta
              </h4>
              <salesListe class="w-full" />
            </div>
            
            <!-- Sección del método de pago -->
            <div class="p-3 rounded-xl shadow-sm bg-blue-50/70 w-full h-full flex flex-col payment-section">
              <h4 class="text-lg font-semibold text-gray-800 pl-3 mt-0 mb-4 pb-2 border-b border-opacity-6">
                Selecciona el método de pago del Servicio
              </h4>
              <typePayments class="w-full" @payment-method-changed="updatePaymentMethod" />
            </div>
          </div>
          
          <!-- Segunda fila: sección de formularios - ahora condicionalmente visible -->
          <div v-if="selectedPaymentMethod" class="w-full flex justify-center animate-fadeIn">
            <div class="p-3 rounded-xl shadow-sm bg-blue-50/70 w-full md:max-w-[600px] mx-auto">
              <h4 class="text-lg font-semibold text-gray-800 pl-1 mt-0 mb-4 pb-2 border-b border-opacity-6">
                Llena los siguientes datos
              </h4>
              <component :is="currentPaymentForm" />
            </div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { IonCard, IonCardContent } from '@ionic/vue'
import typePayments from "@/components/common/steps/dataSales/sub-step2/components/typePayments.vue"
import transferPayment from "@/components/common/steps/dataSales/sub-step2/components/transferPayment.vue"
import datafastPayment from "@/components/common/steps/dataSales/sub-step2/components/datafastPayment.vue"
import salesListe from "@/components/common/steps/dataSales/sub-step2/components/salesList.vue"
import { useWizardStore } from "@/stores/wizardStore"

// Obtener la instancia del store
const wizardStore = useWizardStore()

// Estado para el método de pago seleccionado
const selectedPaymentMethod = ref('')

// Estado para el componente de formulario actual
const currentPaymentForm = ref(transferPayment) // Valor por defecto

// Cargar el método de pago desde el store si existe
onMounted(() => {
  const salesData = wizardStore.getStepData("salesData")
  if (salesData && salesData.paymentMethod) {
    selectedPaymentMethod.value = salesData.paymentMethod
  }
})

// Función para actualizar el método de pago seleccionado
const updatePaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method
}

// Determinar qué componente de formulario mostrar basado en el método de pago
watch(selectedPaymentMethod, (newValue) => {
  if (newValue) {
    switch (newValue) {
      case 'datafast-voucher':
        currentPaymentForm.value = datafastPayment
        break
      case 'transferencia':
      default:
        currentPaymentForm.value = transferPayment
        break
    }
    console.log('Método de pago cambiado a:', newValue)
  }
})
</script>

<style scoped>
/* Contenedor principal con ancho máximo */
.main-container {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .main-container {
    max-width: 950px;
  }
}

/* Animación para la aparición del formulario */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}
</style>