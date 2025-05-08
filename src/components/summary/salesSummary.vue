<template>
  <div class="sales-summary">    
    <!-- Nuevo encabezado según el diseño de la imagen -->
    <div class="summary-header">
      <h2 class="header-title">Confirmacion Informacion de venta</h2>
      <div class="header-info">
        <ion-icon :icon="informationCircle" class="info-icon"></ion-icon>
        <span>Verifique que todos los datos sean correctos. No podra regresar a este paso</span>
      </div>
    </div>
    
    <div class="summary-container">
      <!-- Datos generales y de pago en una disposición más compacta -->
      <div class="summary-flex-container">
        <!-- Datos generales -->
        <div class="summary-section flex-1">
          <h4 class="section-title">Datos Generales</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="item-label">Plan:</span>
              <span class="item-value">{{ getPlanName(salesData.plan) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">Frecuencia:</span>
              <span class="item-value">{{ capitalizeFirst(salesData.billingFrequency) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">Método de Pago:</span>
              <span class="item-value">{{ getPaymentMethodName(salesData.paymentMethod) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Datos de pago -->
        <div class="summary-section flex-1">
          <h4 class="section-title">Datos de Pago</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="item-label">Monto:</span>
              <span class="item-value highlight">${{ formatAmount(salesData.payment.amount) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">Fecha:</span>
              <span class="item-value">{{ formatDate(salesData.payment.date) }}</span>
            </div>
          </div>
          
          <!-- Datos específicos según método de pago -->
          <div class="payment-details">
            <template v-if="salesData.paymentMethod === 'transferencia'">
              <div class="summary-item">
                <span class="item-label">Institución:</span>
                <span class="item-value">{{ salesData.payment.transferData.financialInstitution }}</span>
              </div>
              <div class="summary-item">
                <span class="item-label">Comprobante:</span>
                <span class="item-value">{{ truncateText(salesData.payment.transferData.proofPayment, 20) }}</span>
              </div>
            </template>
            
            <template v-else-if="salesData.paymentMethod === 'datafast-voucher'">
              <div class="summary-item">
                <span class="item-label">Tipo de Tarjeta:</span>
                <span class="item-value">{{ salesData.payment.datafastData.typeCard }}</span>
              </div>
              <div class="summary-item">
                <span class="item-label">Número de Lote:</span>
                <span class="item-value">{{ salesData.payment.datafastData.numberLote }}</span>
              </div>
            </template>
            <template v-else>
              <div class="summary-item">
                <span class="item-label">Detalles:</span>
                <span class="item-value">No hay detalles adicionales.</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      
      <!-- Datos del vendedor - CORREGIDO: fondo blanco y alineación horizontal -->
      <div class="summary-section" v-if="consultantData && consultantData.sellerName">
        <div class="seller-info">
          <span class="seller-label">Vendedor:</span>
          <span class="seller-name">{{ consultantData.sellerName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWizardStore } from "@/stores/wizardStore";
import { informationCircle } from 'ionicons/icons'; // Importar el icono de información

// Obtener la instancia del store
const wizardStore = useWizardStore();

// Datos reactivos para evitar problemas de reactividad
const salesData = ref({
    plan: "",
    billingFrequency: "",
    paymentMethod: "",
    payment: {
      amount: 0,
      date: "",
      transferData: {
        financialInstitution: "",
        proofPayment: ""
      },
      datafastData: {
        typeCard: "",
        numberLote: ""
      }
    }
  });

const consultantData = ref({
    sellerId: "",
    sellerName: ""
  });

// Inicializar los datos del store con valores por defecto
const defaultSalesData = {
    plan: "",
    billingFrequency: "",
    paymentMethod: "",
    payment: {
      amount: 0,
      date: "",
      transferData: {
        financialInstitution: "",
        proofPayment: ""
      },
      datafastData: {
        typeCard: "",
        numberLote: ""
      }
    }
  };

const defaultConsultantData = {
    sellerId: "",
    sellerName: ""
  };

onMounted(() => {
  // Obtener los datos de venta y consultor del store o usar los valores por defecto
  const storedSalesData = wizardStore.getStepData("salesData");
  salesData.value = storedSalesData ? { ...defaultSalesData, ...storedSalesData } : defaultSalesData;

  const storedConsultantData = wizardStore.getStepData("consultant");
  consultantData.value = storedConsultantData ? { ...defaultConsultantData, ...storedConsultantData } : defaultConsultantData;
});

// Funciones de utilidad para formatear datos
const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const capitalizeFirst = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Función para truncar texto largo
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Función para obtener el nombre del plan
const getPlanName = (planValue: string): string => {
  const planMap: Record<string, string> = {
    'freeplan': 'Plan Gratuito',
    'liteplan': 'Plan Lite',
    'basicplan': 'Plan Básico',
    'pymeplan': 'Plan Pyme'
  };
  
  return planMap[planValue] || planValue;
};

// Función para obtener el nombre del método de pago
const getPaymentMethodName = (methodValue: string): string => {
  const methodMap: Record<string, string> = {
    'transferencia': 'Transferencia Bancaria',
    'datafast-voucher': 'Datafast Voucher'
  };
  
  return methodMap[methodValue] || methodValue;
};
</script>

<style scoped>
.sales-summary {
  width: 100%;
  padding: 0;
  background-color: #f0f7ff; /* Fondo azul muy claro */
  border-radius: 0.5rem;
  border: 1px solid #e1effe;
}

/* Estilos para el nuevo encabezado */
.summary-header {
  background-color: #003cff;
  padding: 10px;
  border-radius: 0.5rem 0.5rem 0 0;
  color: white;
}

.header-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.info-icon {
  font-size: 1.2rem;
}

.summary-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.55rem;
}

.summary-flex-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .summary-flex-container {
    flex-direction: row;
  }
}

.summary-section {
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.flex-1 {
  flex: 1;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a56db; /* Azul principal */
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e1effe;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
}

.payment-details {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e1effe;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.item-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
}

.item-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
}

.item-value.highlight {
  color: #1f2937; /* Azul principal */
  font-size: 0.95rem;
}

/* CORREGIDO: Estilos para la sección del vendedor */
.seller-info {
  display: flex;
  align-items: center; /* Alinea verticalmente */
  gap: 0.5rem;
}

.seller-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a56db; /* Azul principal */
}

.seller-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>