<template>
  <form @submit.prevent class="form-container">
    <!-- RUC y Razón social en la misma fila -->
    <div class="form-row">
      <!-- RUC -->
      <FormField
        v-model="data.ruc"
        label="RUC"
        icon="mdi:file-document-outline"
        placeholder="Número de RUC"
        required
        readonly
        disabled
        @validation="(isValid) => handleValidation('ruc', isValid)"
      />
      
      <!-- Razón social -->
      <FormField
        v-model="data.legalName"
        label="Razón social"
        icon="mdi:domain"
        placeholder="Razón social de la empresa"
        required
        readonly
        disabled
        @validation="(isValid) => handleValidation('legalName', isValid)"
      />
    </div>

  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import { 
} from "@/utils/input-controls";

// Valores iniciales para el formulario
const initialValues = {
  ruc: '',
  name: '',
  legalName: '',
  address: '',
  phone: '',
  businessEmail: ''
};

// Usar el composable useInitialData para manejar los datos
const { data } = useInitialData(
  "companyCreation",
  initialValues,
  {
    autoSave: true,
    debug: false
  }
);

// Definir un tipo para las claves de validación
type ValidationKey = 'ruc' | 'name' | 'legalName' | 'address' | 'phone' | 'businessEmail';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  ruc: true,
  name: true,
  legalName: true,
  address: true,
  phone: true,
  businessEmail: true
});

// Función para manejar eventos de validación con tipos correctos
const handleValidation = (field: ValidationKey, isValid: boolean) => {
  validationState.value[field] = isValid;
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
  gap: 6px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 6px;
  }
}
</style>