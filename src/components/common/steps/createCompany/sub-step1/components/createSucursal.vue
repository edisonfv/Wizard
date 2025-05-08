<template>
  <form @submit.prevent class="form-container">
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
        readonly
        disabled
        @validation="(isValid) => handleValidation('idBranch', isValid)"
      />
    </div>

    <!-- Nombre de tu Sucursal -->
    <FormField
      v-model="data.branch.name"
      label="Nombre de la Matriz"
      icon="mdi:home-city"
      placeholder="Nombre de la matriz"
      required
      @validation="(isValid) => handleValidation('name', isValid)"
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
      placeholder="+593"
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
import { ref } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import { 
  formatPhoneNumber,
  validateEmailInRealTime
} from "@/utils/input-controls";

// Valores iniciales para el formulario
const initialValues = {
  branch: {
    commercialName: '',
    idBranch: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    // Incluimos campos que pueden existir en otras partes del código
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
type ValidationKey = 'commercialName' | 'idBranch' | 'name' | 'address' | 'phone' | 'email';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  commercialName: true,
  idBranch: true,
  name: true,
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
</script>

<style scoped>
/* Contenedor del formulario */
.form-container {
  width: 100%;
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
</style>