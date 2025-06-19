<template>
  <form @submit.prevent class="form-container">
    <!-- Título para datos de la matriz -->
    <h4 class="subsection-title">Datos de la Matriz</h4>

    <!-- Menú seleccionable de sucursales -->
    <div class="select-branch-menu">
      <label for="branchMenu" class="select-label">Selecciona una sucursal:</label>
      <select id="branchMenu" v-model="selectedBranch" class="branch-select">
        <option disabled value="">-- Seleccione una opción --</option>
        <option v-for="branch in branchOptions" :key="branch.idBranch" :value="`${branch.idBranch} - ${branch.commercialName}`">
          {{ branch.idBranch }} - {{ branch.commercialName }}
        </option>
      </select>
    </div>

    <!-- Nombre Comercial y Código de Sucursal en la misma fila -->
    <div class="form-row">
      <!-- Nombre Comercial -->
      <FormField
        v-model="data.branch.commercialName"
        label="Nombre Comercial"
        icon="mdi:store-marker"
        placeholder="Nombre comercial"
        required
        @validation="(isValid) => handleValidation('commercialName', isValid)"
      />

      <!-- Código de Sucursal -->
      <FormField
        v-model="data.branch.idBranch"
        label="Código de la Matriz"
        icon="mdi:barcode"
        placeholder="Código de la matriz"
        required
        @validation="(isValid) => handleValidation('idBranch', isValid)"
      />
    </div>

    <!-- Nombre de tu Sucursal (AUXILIAR) -->
    <FormField
      v-model="data.branch.nameAux"
      label="Nombre"
      icon="mdi:home-city"
      placeholder="Nombre"
      required
      @validation="(isValid) => handleValidation('name', isValid)"
    />

    <!-- Nombre de la Matriz (solo lectura, el que se guarda en el lead) -->
    <FormField
      v-model="data.branch.name"
      label="Nombre de la Matriz"
      icon="mdi:home-city"
      placeholder="Nombre a guardar"
      required
      @validation="(isValid) => handleValidation('nameToSave', isValid)"
    />

    <!-- Dirección de la Sucursal -->
    <FormField
      v-model="data.branch.address"
      label="Dirección"
      icon="mdi:map-marker"
      placeholder="Dirección"
      required
      @validation="(isValid) => handleValidation('address', isValid)"
    />

    <!-- Teléfono de la sucursal -->
    <FormField
      v-model="data.branch.phone"
      label="Teléfono"
      icon="mdi:phone"
      placeholder="Número de telefono"
      required
      @input="handlePhoneInput"
      @validation="(isValid) => handleValidation('phone', isValid)"
    />

    <!-- Correo de la Sucursal -->
    <FormField
      v-model="data.branch.email"
      label="Email"
      icon="mdi:email"
      placeholder="Email"
      required
      @input="handleEmailInput"
      @validation="(isValid) => handleValidation('email', isValid)"
      :validator="validateEmailInput"
      errorMessage="Por favor, ingrese un correo electrónico válido"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import { 
  formatPhoneNumber,
  validateEmailInRealTime
} from "@/utils/input-controls";
import { useWizardStore } from "@/stores/wizardStore";
import { wizardService } from "@/services/api";
import { storeToRefs } from 'pinia';

// Valores iniciales para el formulario
const initialValues = {
  branch: {
    commercialName: '',
    idBranch: '',
    name: '', // Este es el que se guarda en el lead
    nameAux: '', // Auxiliar para el input editable
    address: '',
    phone: '',
    email: '',
    delayedDispatch: false,
    isTouristEstablishment: false
  }
};

// Usar el composable useInitialData para manejar los datos
const { data } = useInitialData(
  "branchAndPOS",
  initialValues,
  {
    autoSave: true,
    debug: false,
    nestedFields: {
      branch: ["commercialName", "idBranch", "name", "address", "phone", "email", "delayedDispatch", "isTouristEstablishment"]
    }
  }
);

// Definir un tipo para las claves de validación
type ValidationKey = 'commercialName' | 'idBranch' | 'name' | 'nameToSave' | 'address' | 'phone' | 'email';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  commercialName: true,
  idBranch: true,
  name: true,
  nameToSave: true,
  address: true,
  phone: true,
  email: true
});

// Función para manejar eventos de validación con tipos correctos
const handleValidation = (field: ValidationKey, isValid: boolean) => {
  validationState.value[field] = isValid;
};

// Manejadores de eventos para los inputs con validación
const handlePhoneInput = (event: Event) => {
  data.value.branch.phone = formatPhoneNumber(event);
};

// Manejador para la validación de email en tiempo real
const handleEmailInput = (event: Event) => {
  // Usar la función de validación en tiempo real
  const result = validateEmailInRealTime(event);
  data.value.branch.email = result.value;
  // Actualizar el estado de validación
  handleValidation('email', result.isValid);
};
// Función de validación para el email que devuelve un objeto con value e isValid
const validateEmailInput = (event: Event) => {
  return validateEmailInRealTime(event);
};

const wizardStore = useWizardStore();
//const sinRucActive = wizardStore.wizardState?.sinRucActive || false;

const selectedBranch = ref("");

// Lista reactiva de sucursales
const branchOptions = ref<{ idBranch: string; commercialName: string }[]>([]);

// Obtener el RUC desde el store global (companyCreation)
const { formData } = storeToRefs(wizardStore);

// Función para cargar sucursales según el RUC
const loadBranchesByRuc = async (ruc: string) => {
  if (!ruc) {
    branchOptions.value = [];
    return;
  }
  const rucList = await wizardService.getRucDataBase();
  const found = rucList.find((item) => item.ruc === ruc);
  if (found && found.branches) {
    branchOptions.value = found.branches.map((b: any) => ({
      idBranch: b.idBranch,
      commercialName: b.commercialName
    }));
  } else {
    branchOptions.value = [];
  }
};

// Observar cambios en el RUC global para recargar sucursales
watch(
  () => formData.value.companyCreation.ruc,
  (newRuc) => {
    loadBranchesByRuc(newRuc);
    selectedBranch.value = "";
  },
  { immediate: true }
);

// Watch para actualizar el nombre de la matriz automáticamente
watch([
  () => data.value.branch.idBranch,
  () => data.value.branch.nameAux
], ([codigo, nombreAux]) => {
  if (codigo && nombreAux) {
    data.value.branch.name = `${codigo} - ${nombreAux}`;
  } else if (codigo) {
    data.value.branch.name = `${codigo}`;
  } else if (nombreAux) {
    data.value.branch.name = `${nombreAux}`;
  } else {
    data.value.branch.name = '';
  }
});

// Actualiza los campos de código y nombre comercial al seleccionar una sucursal del menú desplegable
watch(selectedBranch, (val) => {
  if (val) {
    const [codigo, ...nombreArr] = val.split(' - ');
    data.value.branch.idBranch = codigo || '';
    data.value.branch.commercialName = nombreArr.join(' - ') || '';
  } else {
    data.value.branch.idBranch = '';
    data.value.branch.commercialName = '';
  }
});
</script>

<style scoped>
/* Contenedor del formulario */
.form-container {
  width: 100%;
}

/* Título de subsección */
.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 0;
}

/* Fila de formulario para elementos en línea */
.form-row {
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
}

/* Estilos para el menú seleccionable de sucursales */
.select-branch-menu {
  margin-bottom: 16px;
}
.select-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  display: block;
}
.branch-select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 1rem;
  color: #222;
  background: #fff;
}
.branch-select option[disabled][value=""] {
  color: #bdbdbd !important;
  /* Más opaco, simula placeholder */
}
.branch-select:invalid {
  color: #bdbdbd;
}
.branch-select {
  color: #222;
}
</style>