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
        <button
          class="toggle-sin-ruc"
          :class="{ active: sinRucActive }"
          @click="toggleSinRuc"
          type="button"
        >
          Sin RUC
        </button>
      </div>
    </ion-item>
    
    <!-- Mensaje de error de validación -->
    <div v-if="validationError" class="validation-error">
      <Icon icon="mdi:alert-circle-outline" class="validation-error-icon" />
      <span>{{ validationError }}</span>
    </div>
    <!-- Mensaje de éxito de validación -->
    <!-- Eliminado: successMessage no existe -->

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
import { useToast } from 'vue-toastification';
import { wizardService, CompanyExist, RucData } from "@/services/api"

// Obtener instancia del store
const wizardStore = useWizardStore()

// Eliminar companyDatabase y checkExistingCompany, reemplazar por función asíncrona que consulta el endpoint

// Verificar si el RUC ya existe en la base de datos del endpoint
const checkExistingCompany = async (ruc: string): Promise<CompanyExist | undefined> => {
  try {
    const companies = await wizardService.getCompanyExist()
    return companies.find(company => company.ruc === ruc)
  } catch (error) {
    console.error("Error consultando empresas existentes:", error)
    return undefined
  }
}

// Eliminar rucDatabase y la función findRucInDatabase, reemplazar por función asíncrona que consulta el endpoint

// Buscar un RUC en la base de datos simulada (ahora desde el endpoint)
const findRucInDatabase = async (ruc: string): Promise<RucData | undefined> => {
  try {
    const rucs = await wizardService.getRucDataBase()
    return rucs.find(item => item.ruc === ruc)
  } catch (error) {
    console.error("Error consultando base de datos de RUCs:", error)
    return undefined
  }
}

// Valores iniciales para los datos de la compañía
const companyCreationInitial = {
  ruc: "",
  legalName: "",
  domain: "",
  address: "",
  phone: "",
  businessEmail: "",
  status: "",
  regimeRUC: "",
  isAgent: false,
  accountingRequired: false,
  categoryRUC: "",
  branches: []
}

// Inicializar los datos para branchAndPOS
const branchAndPOSInitial = {
  branch: {
    idBranch: "",
    commercialName: "",
    address: "",
    phone: "",
    email: "",
    isTouristEstablishment: false,
    delayedDispatch: false,
    logo: { url: '', fileName: '' }
  },
  pointOfSale: { idPos: '', name: '' }
}

// Inicializar los datos para companyConfig
const companyConfigInitial = {
  regimeRUC: "",
  categoryRUC: "",
  taxAgent: {
    isAgent: false,
    accountingRequired: false
  },
  artisan: { isArtisan: false, artisanNumber: '' },
  taxes: [],
  taxesFiveNumber: '',
  defaultDocument: '',
  searchParameter: ''
}

// Usar el composable useInitialData para cada sección
const { data: companyCreationData, updateFields: updateCompanyCreation } = useInitialData(
  "companyCreation",
  companyCreationInitial,
  { autoSave: true }
)

const { updateFields: updateBranchAndPOS } = useInitialData(
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
// Eliminada la variable successMessage
const rucIsValid = ref(false) // Variable para controlar la validez del RUC

// Estado para el modal de empresa existente
const showExistingCompanyModal = ref(false)
const existingCompany = ref({
  ruc: "",
  legalname: "",
  typePlan: "",
  frequencyType: ""
})

// Estado para el toggle "Sin RUC"
const sinRucActive = ref(false)
const toast = useToast();

// Definir los eventos que este componente puede emitir
const emit = defineEmits(["ruc-searched", "ruc-not-found", "ruc-valid-for-continue"])

// --- FUNCIÓN PARA RESETEAR EL STEP DE BÚSQUEDA DE RUC ---
function resetRucStep() {
  // Limpiar input y flags
  rucValue.value = "";
  isFocused.value = false;
  isLoading.value = false;
  validationError.value = "";
  rucIsValid.value = false;
  sinRucActive.value = false;
  showExistingCompanyModal.value = false;
  existingCompany.value = {
    ruc: "",
    legalname: "",
    typePlan: "",
    frequencyType: ""
  };
  // Limpiar datos de companyCreation y otros relacionados
  updateCompanyCreation({ ...companyCreationInitial });
  updateBranchAndPOS({ ...branchAndPOSInitial });
  updateCompanyConfig({ ...companyConfigInitial });
  // Limpiar flag global de validación en el store
  wizardStore.updateWizardState({ rucValidated: false, sinRucActive: false });
}

// Llamar a resetRucStep al montar el componente (cada vez que se entra a este paso)
onMounted(() => {
  resetRucStep();
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

// Actualizar el store con los datos del SRI
const updateStoreWithSRIData = (data: any) => {
  if (sinRucActive.value) {
    // Solo guardar el RUC si está activo el modo Sin RUC
    updateCompanyCreation({ ruc: data.ruc });
    // No actualizar branchAndPOS ni companyConfig
    console.log("Solo se guardó el RUC en modo Sin RUC:", { ruc: data.ruc });
    return;
  }

  // Tomar la primera sucursal del array branches
  const firstBranch = data.branches && data.branches.length > 0 ? data.branches[0] : { idBranch: '', commercialName: '', address: '' };

  // Actualizar los datos de companyCreation con todos los campos relevantes
  updateCompanyCreation({
    ruc: data.ruc,
    legalName: data.legalName,
    domain: data.ruc,
    address: firstBranch.address || '',
    phone: '',
    businessEmail: '',
    status: data.status,
    regimeRUC: data.regimeRUC,
    isAgent: data.isAgent,
    accountingRequired: data.accountingRequired,
    categoryRUC: data.categoryRUC,
    branches: data.branches || []
  });

  // Actualizar los datos de branchAndPOS solo con la primera sucursal
  updateBranchAndPOS({
    branch: {
      idBranch: firstBranch.idBranch || '',
      commercialName: firstBranch.commercialName || '',
      address: firstBranch.address || '',
      phone: '',
      email: '',
      isTouristEstablishment: false,
      delayedDispatch: false,
      logo: { url: '', fileName: '' }
    },
    pointOfSale: { idPos: '', name: '' }
  });

  // Actualizar los datos de companyConfig
  updateCompanyConfig({
    regimeRUC: data.regimeRUC,
    categoryRUC: data.categoryRUC,
    taxAgent: {
      ...companyConfigData.value.taxAgent,
      isAgent: data.isAgent,
      accountingRequired: data.accountingRequired,
    },
    artisan: { isArtisan: false, artisanNumber: '' },
    taxes: [],
    taxesFiveNumber: '',
    defaultDocument: '',
    searchParameter: ''
  });

  console.log("Datos actualizados en el store desde searchRUC:", {
    companyCreation: {
      ruc: data.ruc,
      legalName: data.legalName,
      status: data.status,
      regimeRUC: data.regimeRUC,
      isAgent: data.isAgent,
      accountingRequired: data.accountingRequired,
      categoryRUC: data.categoryRUC,
      branches: data.branches
    },
    branchAndPOS: {
      branch: firstBranch
    },
    companyConfig: {
      regimeRUC: data.regimeRUC,
      categoryRUC: data.categoryRUC,
      taxAgent: {
        isAgent: data.isAgent,
        accountingRequired: data.accountingRequired,
      },
    }
  });
}

const searchRuc = async () => {
  // Limpiar mensajes previos
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

    // Consultar empresas existentes desde el endpoint
    const existingCompanyData = await checkExistingCompany(rucValue.value)

    if (existingCompanyData) {
      console.log("Empresa ya existente:", existingCompanyData)
      existingCompany.value = {
        ruc: existingCompanyData.ruc,
        legalname: existingCompanyData.legalname,
        typePlan: existingCompanyData.typePlan,
        frequencyType: existingCompanyData.frequencyType
      }
      showExistingCompanyModal.value = true
      isLoading.value = false
      return
    }

    // Si el toggle Sin RUC está activo
    if (sinRucActive.value) {
      // Guardar el RUC en el store aunque sea modo Sin RUC
      updateCompanyCreation({ ruc: rucValue.value });
      rucIsValid.value = true;
      emit("ruc-valid-for-continue", rucValue.value);
      emit("step-valid", true); // <-- Emitir evento para activar el botón siguiente
      isLoading.value = false;
      return;
    }

    // Si no existe, buscar el RUC en la base de datos simulada del SRI
    const foundRuc = await findRucInDatabase(rucValue.value)
    if (foundRuc) {
      console.log("RUC encontrado:", foundRuc)

      // Verificar si el RUC está ACTIVO
      if (foundRuc.status === "ACTIVO") {
        // Marcar como RUC válido solo si está ACTIVO
        rucIsValid.value = true
        emit("step-valid", true); // <-- Emitir evento para activar el botón siguiente
      } else {
        // Si el RUC existe pero no está ACTIVO, no lo consideramos válido
        rucIsValid.value = false
        emit("step-valid", false);
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
      emit("step-valid", false);
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

const toggleSinRuc = () => {
  sinRucActive.value = !sinRucActive.value;
  // Guardar el flag en el store para que esté disponible en el paso 2
  wizardStore.updateWizardState({ sinRucActive: sinRucActive.value });
  if (sinRucActive.value) {
    toast.success('Modo "Sin RUC" activado.');
  } else {
    toast.info('Modo "Sin RUC" desactivado.');
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

.validation-success {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 0 4px;
  color: #22c55e;
  background: #e7f9ef;
  border-radius: 6px;
  font-size: 0.85rem;
}

.validation-success-icon {
  font-size: 16px;
  color: #22c55e;
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

/* NUEVOS ESTILOS PARA EL TOGGLE "SIN RUC" */
.toggle-sin-ruc {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #0054e9;
  background: #fff;
  color: #222;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.toggle-sin-ruc.active {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
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