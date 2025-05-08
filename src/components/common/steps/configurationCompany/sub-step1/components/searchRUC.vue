<template>
  <div>
    <ion-item lines="none" class="custom-item">
      <div class="search-container">
        <div class="input-container" :class="{ 'input-focused': isFocused, 'has-value': rucValue.length > 0 }" @click="focusInput">
          <Icon icon="material-symbols:search" class="search-icon" />
          <input 
            id="ruc"
            type="text"
            placeholder="RUC"
            v-model="rucValue"
            @focus="isFocused = true"
            @blur="isFocused = false"
            class="native-input "
            :class="{ 'has-value': rucValue.length > 0 }"
            ref="rucInput"
            required
          />
        </div>
        <ion-button size="default" @click="searchRuc" class="consultar-button" :disabled="isLoading">
          <span v-if="!isLoading">Consultar</span>
          <ion-spinner v-else name="crescent" class="spinner-button"></ion-spinner>
        </ion-button>
      </div>
    </ion-item>
    
    <!-- Mensaje de error de validación -->
    <div v-if="validationError" class="validation-error">
      <Icon icon="mdi:alert-circle-outline" class="validation-error-icon" />
      <span>{{ validationError }}</span>
    </div>

    <!-- Modal para empresa existente (MEJORADO) -->
      
      <!-- Contenido del modal -->
      <ion-modal :is-open="showExistingCompanyModal" @didDismiss="showExistingCompanyModal = false" class="existing-company-modal">
    <div class="modal-wrapper">
      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h3 class="modal-title">Coincidencia encontrada</h3>
      </div>
      
      <!-- Contenido del modal -->
      <div class="modal-content">
        <!-- Mensaje adicional modificado con icono de información azul -->
        <div class="notification-message">
          <Icon icon="mdi:information-outline" class="notification-icon" />
          <span>Esta empresa ya se encuentra registrada en el sistema.</span>
        </div>
        
        <!-- Información de la empresa -->
        <div class="company-info">
          <div class="info-row">
            <span class="info-label">RUC:</span>
            <span class="info-value">{{ existingCompany.ruc }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Razón Social:</span>
            <span class="info-value">{{ existingCompany.legalname }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Plan:</span>
            <span class="info-value plan-badge">{{ existingCompany.typePlan }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Frecuencia:</span>
            <span class="info-value frequency-badge">{{ existingCompany.frequencyType }}</span>
          </div>
        </div>
      </div>
      
      <!-- Pie del modal -->
      <div class="modal-footer">
        <ion-button expand="block" @click="showExistingCompanyModal = false" class="ok-button">OK</ion-button>
      </div>
    </div>
  </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, onMounted } from "vue"
import { IonItem, IonButton, IonSpinner, IonModal } from "@ionic/vue"
import { Icon } from "@iconify/vue"
import { useInitialData } from "@/composables/useInitialData"
import { useWizardStore } from "@/stores/wizardStore"

// Obtener instancia del store
const wizardStore = useWizardStore()

// Base de datos simulada con empresas existentes
const companyDatabase = [
  {
    ruc: "1234567890001",
    legalname: "EMPRESA EJEMPLO S.A.",
    exist: true,
    typePlan: "Plan Premium",
    frequencyType: "Mensual"
  },
  {
    ruc: "0987654321001",
    legalname: "CORPORACIÓN TEST C.A.",
    exist: true,
    typePlan: "Plan Básico",
    frequencyType: "Anual"
  },
  {
    ruc: "1122334455001",
    legalname: "SERVICIOS PRUEBA LTDA.",
    exist: true,
    typePlan: "Plan Pyme",
    frequencyType: "Mensual"
  }
];

// Base de datos simulada con 5 RUCs diferentes (original)
const rucDatabase = [
  {
    ruc: "1792780241001",
    legalName: "TODONEG S.A.",
    status: "ACTIVO",
    regimeRUC: "General",
    isAgent: true,
    accountingRequired: true,
    categoryRUC: "Negocio Popular",
    idBranch: "001",
    commercialName: "Wanqara",
    address: "PICHINCHA / QUITO / IÑAQUITO / 10 DE AGOSTO N33-62 Y N33 GUAYANAS",
  },
  {
    ruc: "1790016919001",
    legalName: "CORPORACIÓN FAVORITA C.A.",
    status: "ACTIVO",
    regimeRUC: "General",
    isAgent: true,
    accountingRequired: true,
    categoryRUC: "Contribuyente Especial",
    idBranch: "001",
    commercialName: "Supermaxi",
    address: "PICHINCHA / QUITO / CUMBAYÁ / AV. INTEROCEÁNICA KM 12.5 Y PASAJE BERMEJO",
  },
  {
    ruc: "1791251237001",
    legalName: "PROCESADORA NACIONAL DE ALIMENTOS C.A. PRONACA",
    status: "ACTIVO",
    regimeRUC: "General",
    isAgent: true,
    accountingRequired: true,
    categoryRUC: "Contribuyente Especial",
    idBranch: "001",
    commercialName: "PRONACA",
    address: "PICHINCHA / QUITO / TUMBACO / VÍA INTEROCEÁNICA KM 21",
  },
  {
    ruc: "0992757892001",
    legalName: "CORPORACIÓN EL ROSADO S.A.",
    status: "ACTIVO",
    regimeRUC: "General",
    isAgent: true,
    accountingRequired: true,
    categoryRUC: "Contribuyente Especial",
    idBranch: "001",
    commercialName: "Mi Comisariato",
    address: "GUAYAS / GUAYAQUIL / TARQUI / AV. 9 DE OCTUBRE 729 Y BOYACÁ",
  },
  {
    ruc: "1791410726001",
    legalName: "TECNOMEGA C.A.",
    status: "SUSPENDIDO",
    regimeRUC: "General",
    isAgent: false,
    accountingRequired: true,
    categoryRUC: "Sociedad",
    idBranch: "001",
    commercialName: "Tecnomega",
    address: "PICHINCHA / QUITO / LA CONCEPCIÓN / AV. REPÚBLICA E2-51 Y ATAHUALPA",
  }
];

// Valores iniciales para los datos de la compañía
const companyCreationInitial = {
  ruc: "",
  legalName: "",
  domain: "",
  address: ""
}

// Inicializar los datos para branchAndPOS
const branchAndPOSInitial = {
  branch: {
    idBranch: "",
    commercialName: "",
    address: ""
  }
}

// Inicializar los datos para companyConfig
const companyConfigInitial = {
  regimeRUC: "",
  categoryRUC: "",
  taxAgent: {
    isAgent: false,
    accountingRequired: false
  }
}

// Usar el composable useInitialData para cada sección
const { data: companyCreationData, updateFields: updateCompanyCreation } = useInitialData(
  "companyCreation",
  companyCreationInitial,
  { autoSave: true }
)

const { data: branchAndPOSData, updateFields: updateBranchAndPOS } = useInitialData(
  "branchAndPOS",
  branchAndPOSInitial,
  { 
    autoSave: true,
    nestedFields: {
      branch: ["idBranch", "commercialName", "address"]
    }
  }
)

const { data: companyConfigData, updateFields: updateCompanyConfig } = useInitialData(
  "companyConfig",
  companyConfigInitial,
  { 
    autoSave: true,
    nestedFields: {
      taxAgent: ["isAgent", "accountingRequired"]
    }
  }
)

// Usar el valor del RUC desde el store o un valor vacío
const rucValue = ref(companyCreationData.value.ruc || "")
const isFocused = ref(false)
const rucInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const validationError = ref("")
const rucIsValid = ref(false) // Variable para controlar la validez del RUC

// Estado para el modal de empresa existente
const showExistingCompanyModal = ref(false)
const existingCompany = ref({
  ruc: "",
  legalname: "",
  typePlan: "",
  frequencyType: ""
})

// Definir los eventos que este componente puede emitir
const emit = defineEmits(["ruc-searched", "ruc-not-found"])

// Inicializar rucIsValid en el montaje del componente
onMounted(() => {
  rucIsValid.value = wizardStore.wizardState.rucValidated || false;
});

// Vigilar cambios en rucIsValid para actualizar el estado del wizard
watch(rucIsValid, (newValue) => {
  // Actualizar un estado específico en el wizard para controlar la habilitación del botón
  wizardStore.updateWizardState({
    rucValidated: newValue
  })
})

const focusInput = () => {
  if (rucInput.value) {
    rucInput.value.focus()
  }
}

// Validar el formato del RUC
const validateRuc = (ruc: string): boolean => {
  // Validar que el RUC tenga 13 dígitos y solo contenga números
  if (!/^\d{13}$/.test(ruc)) {
    validationError.value = "El RUC debe contener exactamente 13 dígitos numéricos"
    rucIsValid.value = false
    return false
  }
  
  validationError.value = ""
  return true
}

// Verificar si el RUC ya existe en la base de datos simulada
const checkExistingCompany = (ruc: string) => {
  return companyDatabase.find(company => company.ruc === ruc && company.exist === true)
}

// Buscar un RUC en la base de datos simulada
const findRucInDatabase = (ruc: string) => {
  // Buscar el RUC exacto en la base de datos
  return rucDatabase.find(item => item.ruc === ruc)
}

// Actualizar el store con los datos del SRI
const updateStoreWithSRIData = (data: any) => {
  // Actualizar los datos de companyCreation
  updateCompanyCreation({
    ruc: data.ruc,
    legalName: data.legalName,
    domain: data.ruc,
    address: data.address
  })

  // Actualizar los datos de branchAndPOS
  updateBranchAndPOS({
    branch: {
      ...branchAndPOSData.value.branch,
      idBranch: data.idBranch,
      commercialName: data.commercialName,
      address: data.address
    }
  })

  // Actualizar los datos de companyConfig
  updateCompanyConfig({
    regimeRUC: data.regimeRUC,
    categoryRUC: data.categoryRUC,
    taxAgent: {
      ...companyConfigData.value.taxAgent,
      isAgent: data.isAgent,
      accountingRequired: data.accountingRequired
    }
  })

  console.log("Datos actualizados en el store desde searchRUC:", {
    companyCreation: {
      ruc: data.ruc,
      legalName: data.legalName,
    },
    branchAndPOS: {
      branch: {
        idBranch: data.idBranch,
        commercialName: data.commercialName,
        address: data.address,
      },
    },
    companyConfig: {
      regimeRUC: data.regimeRUC,
      categoryRUC: data.categoryRUC,
      taxAgent: {
        isAgent: data.isAgent,
        accountingRequired: data.accountingRequired,
      },
    }
  })
}

const searchRuc = async () => {
  // Limpiar mensaje de error previo
  validationError.value = ""
  rucIsValid.value = false // Reset del estado de validación
  
  // Validar que se haya ingresado un RUC
  if (!rucValue.value) {
    validationError.value = "Por favor, ingresa un número de RUC"
    return
  }
  
  // Validar el formato del RUC
  if (!validateRuc(rucValue.value)) {
    return
  }
  
  // Simular carga
  isLoading.value = true
  
  try {
    // Simular una petición a un servidor (esperar 1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Verificar si la empresa ya existe en nuestra base de datos simulada
    const existingCompanyData = checkExistingCompany(rucValue.value)
    
    if (existingCompanyData) {
      console.log("Empresa ya existente:", existingCompanyData)
      
      // Guardar los datos de la empresa existente para mostrarlos en el modal
      existingCompany.value = {
        ruc: existingCompanyData.ruc,
        legalname: existingCompanyData.legalname,
        typePlan: existingCompanyData.typePlan,
        frequencyType: existingCompanyData.frequencyType
      }
      
      // Mostrar el modal
      showExistingCompanyModal.value = true
      
      // No continuamos con la búsqueda en la base de datos del SRI
      isLoading.value = false
      return
    }
    
    // Si no existe, buscar el RUC en la base de datos simulada del SRI
    const foundRuc = findRucInDatabase(rucValue.value)
    
    if (foundRuc) {
      console.log("RUC encontrado:", foundRuc)

      // Verificar si el RUC está ACTIVO
      if (foundRuc.status === "ACTIVO") {
        // Marcar como RUC válido solo si está ACTIVO
        rucIsValid.value = true
      } else {
        // Si el RUC existe pero no está ACTIVO, no lo consideramos válido
        rucIsValid.value = false
      }
      
      // Actualizar el store con los datos encontrados
      updateStoreWithSRIData(foundRuc)
      
      // Preparamos los datos que necesita el componente informationRUC
      const rucData = {
        ruc: foundRuc.ruc,
        razonSocial: foundRuc.legalName,
        estado: foundRuc.status,
      }
      
      // Emitir el evento con los datos del RUC
      emit("ruc-searched", rucData)
    } else {
      console.log("RUC no encontrado:", rucValue.value)
      
      // Asegurar que el RUC no válido
      rucIsValid.value = false
      
      // Emitir el evento de RUC no encontrado
      emit("ruc-not-found", rucValue.value)
    }
  } catch (error) {
    console.error("Error al buscar el RUC:", error)
    validationError.value = "Ocurrió un error al procesar la solicitud. Intenta nuevamente."
    rucIsValid.value = false
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos originales del componente */
.custom-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.notification-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e6f0ff;
  padding: 8px 8px;
  border-radius: 7px;
  font-size: 0.75rem;
  color: #2c4b7a;
  width: 100%;
  margin-top: 5px;
}

.notification-icon {
  color: #0054e9;
  font-size: 18px;
  flex-shrink: 0;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.input-container {
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  background-color: white;
  transition: all 0.2s ease;
  cursor: text;
  height: 40px;
}

.input-container.has-value {
  background-color: rgba(var(--ion-color-primary-rgb), 0.05);
  border-color: var(--ion-color-primary);
}

.input-focused {
  border-color: #0054e9;
  box-shadow: 0 0 0 1px rgba(26, 115, 232, 0.2);
}

.search-icon {
  color: #757575;
  font-size: 18px;
  margin-right: 8px;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.native-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  padding: 0;
  width: 100%;
  caret-color: #0054e9;
  
}

.native-input.has-value {
  background-color: transparent;
}

.native-input::placeholder {
  color: #757575;
  opacity: 1;
}

.consultar-button {
  --background: #0054e9;
  --color: white;
  --border-radius: 6px;
  --padding-start: 16px;
  --padding-end: 16px;
  height: 40px;
  margin: 0;
  text-transform: none;
  font-weight: 500;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.consultar-button:disabled {
  --background: #0054e9;
  --opacity: 0.7;
}

.spinner-button {
  --color: white;
}

.validation-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 0 4px;
  color: #ef4444;
  font-size: 0.85rem;
}

.validation-error-icon {
  font-size: 16px;
}

/* NUEVOS ESTILOS MEJORADOS PARA EL MODAL */
.existing-company-modal::part(content) {
  width: 90%;
  max-width: 400px;
  height: auto;
  border-radius: 16px;
  --backdrop-opacity: 0.5;
}

.modal-wrapper {
  width: 100%;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  background-color: var(--ion-color-primary);
  color: white;
  padding: 12px;
  text-align: center;
  position: relative;
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-content {
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.info-icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(var(--ion-color-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon {
  font-size: 32px;
  color: var(--ion-color-primary);
}

.company-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.95rem;
}

.plan-badge, .frequency-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.plan-badge {
  background-color: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.frequency-badge {
  background-color: rgba(var(--ion-color-success-rgb), 0.1);
  color: var(--ion-color-success);
}

.modal-message {
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  padding: 0 10px;
}

.modal-footer {
  padding: 10px 100px 10px;
  border-top: 1px solid #e2e8f0;
}

.ok-button {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 10px;
  margin: 0;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.25);
  transition: all 0.3s ease;
}

.ok-button:hover {
  --background: var(--ion-color-primary-shade);
  box-shadow: 0 6px 16px rgba(var(--ion-color-primary-rgb), 0.3);
  transform: translateY(-2px);
}

/* Estilos responsivos */
@media (max-width: 480px) {
  .existing-company-modal::part(content) {
    width: 95%;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .info-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .info-icon {
    font-size: 28px;
  }
  
  .company-info {
    padding: 12px;
  }
  
  .info-label, .info-value {
    font-size: 0.9rem;
  }
}
</style>