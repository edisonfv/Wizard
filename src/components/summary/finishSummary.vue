<template>
  <div class="finish-summary">
    <!-- Cabecera con título claro y mensaje informativo -->
    <div class="summary-header">
      <div class="header-left">
        <h2 class="header-title">Resumen de Configuración</h2>
        <div class="header-info">
          <ion-icon :icon="informationCircle" class="info-icon"></ion-icon>
          <span>Verifique que todos los datos sean correctos antes de finalizar</span>
        </div>
      </div>
      <!-- Logo de la empresa (si existe) posicionado a la derecha -->
      <div class="header-right">
        <img v-if="hasLogo" :src="logoUrl" alt="Logo de la empresa" class="company-logo" />
      </div>
    </div>

    <!-- Contenedor principal con diseño de factura -->
    <div class="summary-content">
      <!-- Sección de Datos del Usuario -->
      <section class="summary-section">
        <h3 class="section-title">Datos del Usuario</h3>
        <div class="data-grid">
          <div class="data-column">
            <div class="data-item" v-if="createUser.name">
              <span class="data-label">Nombre:</span>
              <span class="data-value">{{ createUser.name }}</span>
            </div>
            <div class="data-item" v-if="createUser.email">
              <span class="data-label">Email:</span>
              <span class="data-value" :title="createUser.email">{{ createUser.email }}</span>
            </div>
            <div class="data-item" v-if="createUser.rol?.name">
              <span class="data-label">Rol:</span>
              <span class="data-value">{{ createUser.rol.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección unificada de Datos de la Empresa -->
      <section class="summary-section">
        <h3 class="section-title">Datos de la Empresa</h3>
        <div class="data-grid">
          <!-- Columna izquierda con datos principales -->
          <div class="data-column">
            <div class="data-item" v-if="companyCreation.ruc">
              <span class="data-label">RUC:</span>
              <span class="data-value">{{ companyCreation.ruc }}</span>
            </div>
            <div class="data-item" v-if="companyCreation.legalName">
              <span class="data-label">Razón Social:</span>
              <span class="data-value" :title="companyCreation.legalName">{{ companyCreation.legalName }}</span>
            </div>
            <div class="data-item" v-if="branchAndPOS.branch.commercialName">
              <span class="data-label">Nombre Comercial:</span>
              <span class="data-value" :title="branchAndPOS.branch.commercialName">{{ branchAndPOS.branch.commercialName }}</span>
            </div>
            <div class="data-item" v-if="branchAndPOS.branch.address">
              <span class="data-label">Dirección:</span>
              <span class="data-value" :title="branchAndPOS.branch.address">{{ branchAndPOS.branch.address }}</span>
            </div>
          </div>
          
          <!-- Columna derecha con datos de contacto y punto de emisión -->
          <div class="data-column">
            <div class="data-item" v-if="branchAndPOS.branch.phone">
              <span class="data-label">Teléfono:</span>
              <span class="data-value">{{ branchAndPOS.branch.phone }}</span>
            </div>
            <div class="data-item" v-if="branchAndPOS.branch.email">
              <span class="data-label">Email:</span>
              <span class="data-value" :title="branchAndPOS.branch.email">{{ branchAndPOS.branch.email }}</span>
            </div>
            <div class="data-item" v-if="branchAndPOS.pointOfSale.idPos">
              <span class="data-label">Código Punto Emisión:</span>
              <span class="data-value">{{ branchAndPOS.pointOfSale.idPos }}</span>
            </div>
            <div class="data-item" v-if="branchAndPOS.pointOfSale.name">
              <span class="data-label">Nombre Punto Emisión:</span>
              <span class="data-value" :title="branchAndPOS.pointOfSale.name">{{ branchAndPOS.pointOfSale.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Configuración de la Empresa -->
      <section class="summary-section">
        <h3 class="section-title">Configuración de la Empresa</h3>
        <div class="data-grid">
          <!-- Columna izquierda con configuraciones fiscales -->
          <div class="data-column">
            <div class="data-item">
              <span class="data-label">Régimen:</span>
              <span class="data-value">{{ companyConfig.regimeRUC || 'No especificado' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Categoría:</span>
              <span class="data-value">{{ companyConfig.categoryRUC || 'No especificada' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Agente Retención:</span>
              <span class="data-value">{{ companyConfig.taxAgent?.isAgent ? 'Sí' : 'No' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Contabilidad:</span>
              <span class="data-value">{{ companyConfig.taxAgent?.accountingRequired ? 'Obligatoria' : 'No obligatoria' }}</span>
            </div>
          </div>
          
          <!-- Columna derecha con configuraciones operativas -->
          <div class="data-column">
            <div class="data-item">
              <span class="data-label">Artesano:</span>
              <span class="data-value">{{ artisanText }}</span>
            </div>
            <div class="data-item" v-if="companyConfig.artisan?.isArtisan && companyConfig.artisan?.artisanNumber">
              <span class="data-label">Nº Artesano:</span>
              <span class="data-value">{{ companyConfig.artisan.artisanNumber }}</span>
            </div>
            <div class="data-item" v-if="companyConfig.defaultDocument">
              <span class="data-label">Doc. Defecto:</span>
              <span class="data-value">{{ getDocumentType(companyConfig.defaultDocument) }}</span>
            </div>
            <div class="data-item" v-if="companyConfig.taxes && companyConfig.taxes.length > 0">
              <span class="data-label">Impuestos:</span>
              <span class="data-value">{{ formatTaxes(companyConfig.taxes) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Características adicionales -->
        <div class="features-grid">
          <div class="feature-item" :class="{ 'feature-active': branchAndPOS.branch.delayedDispatch }">
            <ion-icon :icon="branchAndPOS.branch.delayedDispatch ? checkmarkCircle : closeCircle" class="feature-icon"></ion-icon>
            <span>Despacho Posterior</span>
          </div>
          <div class="feature-item" :class="{ 'feature-active': branchAndPOS.branch.isTouristEstablishment }">
            <ion-icon :icon="branchAndPOS.branch.isTouristEstablishment ? checkmarkCircle : closeCircle" class="feature-icon"></ion-icon>
            <span>Establecimiento Turístico</span>
          </div>
        </div>
      </section>
      
      <!-- Sección de Plan y Pago (solo si existe) -->
      <section class="summary-section" v-if="hasSalesData">
        <h3 class="section-title">Plan y Pago</h3>
        <div class="data-grid">
          <div class="data-column">
            <div class="data-item" v-if="salesData.plan">
              <span class="data-label">Plan:</span>
              <span class="data-value">{{ getPlanName(salesData.plan) }}</span>
            </div>
            <div class="data-item" v-if="salesData.billingFrequency">
              <span class="data-label">Frecuencia:</span>
              <span class="data-value">{{ capitalizeFirst(salesData.billingFrequency) }}</span>
            </div>
            <div class="data-item" v-if="salesData.paymentMethod">
              <span class="data-label">Método de Pago:</span>
              <span class="data-value">{{ getPaymentMethodName(salesData.paymentMethod) }}</span>
            </div>
          </div>
          <div class="data-column">
            <div class="data-item" v-if="salesData.payment?.amount">
              <span class="data-label">Monto:</span>
              <span class="data-value highlight">${{ formatAmount(salesData.payment.amount) }}</span>
            </div>
            <div class="data-item" v-if="salesData.payment?.date">
              <span class="data-label">Fecha:</span>
              <span class="data-value">{{ formatDate(salesData.payment.date) }}</span>
            </div>
            <div class="data-item" v-if="consultantData?.sellerName">
              <span class="data-label">Vendedor:</span>
              <span class="data-value">{{ consultantData.sellerName }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useWizardStore } from "@/stores/wizardStore";
import { informationCircle, checkmarkCircle, closeCircle } from 'ionicons/icons';

// Obtener la instancia del store
const wizardStore = useWizardStore();

// Inicializar los datos del store al montar el componente
onMounted(() => {
  createUser.value;
  companyCreation.value;
  companyConfig.value;
  branchAndPOS.value;
  salesData.value;
  consultantData.value;
  hasLogo.value;
  logoUrl.value;
  artisanText.value;
  hasSalesData.value;
});

// Obtener los datos del store
const createUser = computed(() => {
  return wizardStore.getStepData("createUser") || {
    name: "",
    email: "",
    rol: { name: "" }
  };
});

const companyCreation = computed(() => {
  return wizardStore.getStepData("companyCreation") || {
    ruc: "",
    legalName: "",
    domain: "",
    address: "",
    phone: "",
    businessEmail: ""
  };
});

const companyConfig = computed(() => {
  return wizardStore.getStepData("companyConfig") || {
    defaultDocument: "",
    searchParameter: "",
    regimeRUC: "",
    categoryRUC: "",
    taxAgent: { isAgent: false, accountingRequired: false },
    artisan: { isArtisan: false, artisanNumber: "" },
    taxes: [],
    taxesFiveNumber: "",
    logo: { url: "", fileName: "" }
  };
});

const branchAndPOS = computed(() => {
  return wizardStore.getStepData("branchAndPOS") || {
    branch: {
      idBranch: "",
      name: "",
      commercialName: "",
      address: "",
      phone: "",
      email: "",
      isTouristEstablishment: false,
      delayedDispatch: false,
      logo: {
        url: "",
        fileName: ""
      }
    },
    pointOfSale: {
      idPos: "",
      name: ""
    }
  };
});

const salesData = computed(() => {
  return wizardStore.getStepData("salesData") || {
    plan: "",
    billingFrequency: "",
    paymentMethod: "",
    payment: {
      amount: 0,
      date: "",
      transferData: {},
      datafastData: {}
    }
  };
});

const consultantData = computed(() => {
  return wizardStore.getStepData("consultant") || {
    sellerId: "",
    sellerName: ""
  };
});

// Computed para verificar si hay datos de venta
const hasSalesData = computed(() => {
  return salesData.value && (salesData.value.plan || salesData.value.billingFrequency || salesData.value.paymentMethod);
});

// Computed para verificar si hay un logo disponible
const hasLogo = computed(() => {
  // Verificar primero en companyConfig
  if (companyConfig.value.logo && companyConfig.value.logo.url) {
    return true;
  }
  
  // Verificar en branchAndPOS.branch
  if (branchAndPOS.value.branch.logo && branchAndPOS.value.branch.logo.url) {
    return true;
  }
  
  return false;
});

// Computed para obtener la URL del logo
const logoUrl = computed(() => {
  // Priorizar el logo en companyConfig
  if (companyConfig.value.logo && companyConfig.value.logo.url) {
    return companyConfig.value.logo.url;
  }
  
  // Si no existe, usar el logo en branchAndPOS.branch
  if (branchAndPOS.value.branch.logo && branchAndPOS.value.branch.logo.url) {
    return branchAndPOS.value.branch.logo.url;
  }
  
  // Valor por defecto
  return '';
});

// Funciones de utilidad para formatear datos
const getDocumentType = (type: string): string => {
  const types: Record<string, string> = {
    'facturas': 'Facturas Electrónicas',
    'recibos': 'Recibos'
  };
  return types[type] || type;
};

// Función para formatear los impuestos con tipado correcto
const formatTaxes = (taxes: string[]): string => {
  if (!taxes || !Array.isArray(taxes) || taxes.length === 0) {
    return 'Ninguno';
  }
  return taxes.map((tax: string) => `${tax}%`).join(', ');
};

const artisanText = computed(() => {
  return companyConfig.value.artisan?.isArtisan ? 'Sí' : 'No';
});

// Funciones para formatear datos de ventas
const getPlanName = (planValue: string): string => {
  const planMap: Record<string, string> = {
    'freeplan': 'Plan Gratuito',
    'liteplan': 'Plan Lite',
    'basicplan': 'Plan Básico',
    'pymeplan': 'Plan Pyme'
  };
  
  return planMap[planValue] || planValue;
};

const getPaymentMethodName = (methodValue: string): string => {
  const methodMap: Record<string, string> = {
    'transferencia': 'Transferencia Bancaria',
    'datafast-voucher': 'Datafast Voucher'
  };
  
  return methodMap[methodValue] || methodValue;
};

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
</script>

<style scoped>
.finish-summary {
  width: 100%;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Cabecera mejorada con flexbox para alinear elementos */
.summary-header {
  background: linear-gradient(135deg, #003cff, #0035e0);
  padding: 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Contenedor izquierdo para título e información */
.header-left {
  flex: 1;
}

/* Contenedor derecho para el logo */
.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.info-icon {
  font-size: 1.2rem;
}

/* Estilos del logo */
.company-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  padding: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Contenedor principal del contenido */
.summary-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Estilos para las secciones */
.summary-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
}

/* Grid para organizar los datos en dos columnas */
.data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.data-column {
  flex: 1 1 300px; /* Cada columna ocupa al menos 300px o 1fr del espacio disponible */
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Estilos para cada item de datos */
.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.data-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
}

.data-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  text-align: right;
  word-break: break-word;
  max-width: 60%;
}

.data-value.highlight {
  color: #003cff;
  font-size: 1rem;
}

/* Grid para características adicionales */
.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  flex: 1 1 200px;
  min-width: 200px;
}

.feature-active {
  background-color: rgba(0, 60, 255, 0.05);
  border-color: rgba(0, 60, 255, 0.2);
}

.feature-active .feature-icon {
  color: #003cff;
}

.feature-icon {
  font-size: 1.2rem;
  color: #64748b;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .summary-header {
    flex-direction: row;
    align-items: center;
  }
  
  .header-left {
    flex: 1;
  }
  
  .header-title {
    font-size: 1.3rem;
    margin-bottom: 4px;
  }
  
  .header-info {
    font-size: 0.8rem;
  }
  
  .company-logo {
    width: 60px;
    height: 60px;
  }
  
  .data-column {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .summary-header {
    padding: 12px;
  }
  
  .header-title {
    font-size: 1.1rem;
  }
  
  .company-logo {
    width: 50px;
    height: 50px;
  }
  
  .feature-item {
    min-width: 100%;
  }
}
</style>