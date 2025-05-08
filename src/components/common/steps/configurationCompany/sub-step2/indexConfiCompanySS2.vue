// src/components/common/steps/configurationCompany/sub-step2/indexConfiCompanySS2.vue
<template>
  <ion-card class="shadow-lg rounded-xl overflow-hidden">
    <ion-card-content>
      <!-- Contenedor principal con dos columnas generales -->
      <div class="flex flex-col lg:flex-row gap-3">
        <!-- Columna 1 - Información y configuración principal (60%) -->
        <div class="flex flex-col gap-2 lg:w-[55%]">
          <!-- Sección 1: Datos informativos -->
          <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
            <h3 class="font-medium text-lg mb-3 flex items-center text-black">
              <b>Datos informativos <span class="text-blue-700 pl-1">*</span></b>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <regimeRUC :form-data="formData" />
              <categoryRUC :form-data="formData" />
              <agentRUC :form-data="formData" />
            </div>
          </div>

          <!-- Sección 2: Contabilidad -->
          <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
            <accountingRUC :form-data="formData" @update="updateFormData" />
          </div>

          <!-- Sección 3: Artesano -->
          <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
            <artisanRUC :form-data="formData" @update="updateFormData" />
          </div>

          <!-- Sección 4: Despacho y Turismo -->
          <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
            <dispatch_touris :form-data="formData" @update="updateFormData" />
          </div>
        </div>

        <!-- Columna 2 - Configuraciones adicionales (40%) -->
        <div class="flex flex-col gap-2 lg:w-[45%]">
          <!-- Sección 1: Preferencias de Operación (título general) -->
          <!-- Grid de 2 columnas para las dos secciones independientes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Columna para docDefault -->
            <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
              <docDefault :form-data="formData" @update="updateFormData" />
            </div>

            <!-- Columna para parameterSearch -->
            <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
              <parameterSearch :form-data="formData" @update="updateFormData" />
            </div>
          </div>

          <!-- Sección 2: Impuestos -->
          <div class="bg-[#f0f7ff] rounded-xl p-3 shadow-sm border border-gray-100">
            <taxesRUC :form-data="formData" @update="updateFormData" />
          </div>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { IonCard, IonCardContent } from "@ionic/vue";
import regimeRUC from "./components/regimeRUC.vue";
import categoryRUC from "./components/categoryRUC.vue";
import agentRUC from "./components/agentRUC.vue";
import accountingRUC from "./components/accountingRUC.vue";
import artisanRUC from "./components/artisanRUC.vue";
import docDefault from "./components/docDefault.vue";
import parameterSearch from "./components/parameterSearch.vue";
import taxesRUC from "./components/taxesRUC.vue";
import dispatch_touris from "./components/dispatch-tourist.vue";
import { useWizardStore } from "@/stores/wizardStore";

// Obtener la instancia del store
const wizardStore = useWizardStore();

// Definir un tipo para el objeto formData que incluya todas las propiedades necesarias
interface FormDataType {
  defaultDocument: string;
  searchParameter: string;
  regimeRUC: string;
  categoryRUC: string;
  taxAgent: {
    isAgent: boolean;
    accountingRequired: boolean;
  };
  artisan: {
    isArtisan: boolean;
    artisanNumber: string;
  };
  taxes: string[];
  taxesFiveNumber: string;
  branch: {
    delayedDispatch: boolean;
    isTouristEstablishment: boolean;
    [key: string]: any; // Para otras propiedades de branch
  };
  [key: string]: any; // Para permitir acceso dinámico a otras propiedades
}

// Estado local para el formulario completo con valores por defecto
const formData = ref<FormDataType>({
  defaultDocument: "facturas", // Valor por defecto para documento
  searchParameter: "nombre",   // Valor por defecto para parámetro de búsqueda
  regimeRUC: "",
  categoryRUC: "",
  taxAgent: {
    isAgent: false,
    accountingRequired: false
  },
  artisan: {
    isArtisan: false,
    artisanNumber: ""
  },
  taxes: ["15"],              // Valor por defecto para impuestos (15%)
  taxesFiveNumber: "",
  branch: {
    delayedDispatch: false,
    isTouristEstablishment: false
  }
});

// Función tipada para actualizar el estado local del formulario
const updateFormData = (section: string, data: Record<string, any>) => {
  if (section === "root") {
    // Actualizar propiedades de nivel raíz
    Object.keys(data).forEach(key => {
      // Usamos una aserción de tipo para indicar a TypeScript que esta operación es segura
      (formData.value as any)[key] = data[key];
    });
  } else if (section in formData.value) {
    // Actualizar secciones anidadas
    // Usamos una aserción de tipo para indicar a TypeScript que esta operación es segura
    const sectionData = (formData.value as any)[section];
    (formData.value as any)[section] = { ...sectionData, ...data };
  }
  
  // Guardar en el store inmediatamente después de cada actualización
  saveFormToStore();
  
  console.log("Estado local actualizado:", JSON.parse(JSON.stringify(formData.value)));
};

// Cargar datos iniciales desde el store y aplicar valores por defecto
onMounted(() => {
  const companyConfig = wizardStore.getStepData("companyConfig") || {};
  const branchData = wizardStore.getStepData("branchAndPOS") || {};
  
  // Aplicar valores por defecto si no existen en el store
  if (!companyConfig.defaultDocument) {
    formData.value.defaultDocument = "facturas"; // Valor por defecto
  } else {
    formData.value.defaultDocument = companyConfig.defaultDocument;
  }
  
  if (!companyConfig.searchParameter) {
    formData.value.searchParameter = "nombre"; // Valor por defecto
  } else {
    formData.value.searchParameter = companyConfig.searchParameter;
  }
  
  if (!companyConfig.taxes || !Array.isArray(companyConfig.taxes) || companyConfig.taxes.length === 0) {
    formData.value.taxes = ["15"]; // Valor por defecto
  } else {
    formData.value.taxes = [...companyConfig.taxes];
  }
  
  // Actualizar el resto de propiedades desde el store
  if (companyConfig.regimeRUC) formData.value.regimeRUC = companyConfig.regimeRUC;
  if (companyConfig.categoryRUC) formData.value.categoryRUC = companyConfig.categoryRUC;
  
  // Actualizar propiedades anidadas
  if (companyConfig.taxAgent) {
    formData.value.taxAgent = { ...formData.value.taxAgent, ...companyConfig.taxAgent };
  }
  
  if (companyConfig.artisan) {
    formData.value.artisan = { ...formData.value.artisan, ...companyConfig.artisan };
  }
  
  if (companyConfig.taxesFiveNumber) {
    formData.value.taxesFiveNumber = companyConfig.taxesFiveNumber;
  }
  
  // Cargar datos de la sucursal
  if (branchData && branchData.branch) {
    formData.value.branch = {
      ...formData.value.branch,
      delayedDispatch: branchData.branch.delayedDispatch || false,
      isTouristEstablishment: branchData.branch.isTouristEstablishment || false
    };
  }
  
  // Guardar los valores por defecto en el store inmediatamente después de cargar
  saveFormToStore();
  
  console.log("Datos iniciales cargados:", JSON.parse(JSON.stringify(formData.value)));
});

// Guardar datos en el store cuando se haga clic en "Siguiente"
// Este watch se activará cuando cambie el paso actual en el wizard
watch(() => wizardStore.getCurrentWizardState.currentStep, (newStep, oldStep) => {
  // Solo guardar si estamos saliendo del paso actual
  if (oldStep === "config-company" && newStep !== "config-company") {
    saveFormToStore();
    // Forzar una actualización completa después de un pequeño retraso
    setTimeout(() => {
      saveFormToStore();
    }, 100);
  }
});

// También guardar cuando cambie el subpaso
watch(() => wizardStore.getCurrentWizardState.currentSubStep, (newSubStep, oldSubStep) => {
  // Si estamos en el paso config-company y cambiamos de subpaso
  if (wizardStore.getCurrentWizardState.currentStep === "config-company" && newSubStep !== oldSubStep) {
    saveFormToStore();
    // Forzar una actualización completa después de un pequeño retraso
    setTimeout(() => {
      saveFormToStore();
    }, 100);
  }
});

// Función para guardar todos los datos en el store
const saveFormToStore = () => {
  // Obtener los datos actuales de companyConfig del store
  const existingCompanyConfig = wizardStore.getStepData("companyConfig") || {};
  
  // Crear una copia profunda de los datos para evitar problemas de referencia
  const companyConfigData = {
    ...existingCompanyConfig, // Mantener los datos existentes
    defaultDocument: formData.value.defaultDocument,
    searchParameter: formData.value.searchParameter,
    regimeRUC: formData.value.regimeRUC,
    categoryRUC: formData.value.categoryRUC,
    taxAgent: JSON.parse(JSON.stringify(formData.value.taxAgent)),
    artisan: JSON.parse(JSON.stringify(formData.value.artisan)),
    taxes: [...formData.value.taxes],
    taxesFiveNumber: formData.value.taxesFiveNumber
  };
  
  // Guardar datos en companyConfig
  wizardStore.updateFormSection("companyConfig", companyConfigData);
  
  // Obtener los datos actuales de branchAndPOS del store
  const existingBranchData = wizardStore.getStepData("branchAndPOS") || {};
  const existingBranch = existingBranchData.branch || {};
  
  // Crear una copia profunda de los datos de branch
  const branchData = {
    ...existingBranchData, // Mantener los datos existentes
    branch: {
      ...existingBranch, // Mantener los datos existentes de branch
      delayedDispatch: formData.value.branch.delayedDispatch,
      isTouristEstablishment: formData.value.branch.isTouristEstablishment
    }
  };
  
  // Guardar datos en branchAndPOS
  wizardStore.updateFormSection("branchAndPOS", branchData);
  
  // Usar nextTick para asegurarnos de que los cambios se han aplicado
  nextTick(() => {
    console.log("Datos guardados en el store (copia profunda):", {
      companyConfig: JSON.parse(JSON.stringify(wizardStore.getStepData("companyConfig"))),
      branchAndPOS: JSON.parse(JSON.stringify(wizardStore.getStepData("branchAndPOS")))
    });
  });
};
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia */
:deep(ion-card) {
  margin: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>