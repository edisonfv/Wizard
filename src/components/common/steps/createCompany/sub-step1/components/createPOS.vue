<template>
  <form @submit.prevent class="form-container">
    <!-- Nombre del Punto de Venta -->
    <FormField
      v-model="data.pointOfSale.name"
      label="Nombre del Punto de Emisión"
      icon="mdi:store"
      placeholder="Nombre del punto de Emisión"
      required
      @validation="(isValid) => handleValidation('name', isValid)"
    />

    <!-- Código del Punto de Venta -->
    <FormField
      v-model="data.pointOfSale.idPos"
      label="Código del Punto de Emisión"
      icon="mdi:barcode"
      placeholder="Código del punto de Emisión"
      required
      :readonly="!sinRucActive"
      :disabled="!sinRucActive"
      @validation="(isValid) => handleValidation('idPos', isValid)"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import { useWizardStore } from "@/stores/wizardStore";

// Valores iniciales para el formulario
const initialValues = {
  pointOfSale: {
    idPos: '',
    name: ''
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
      pointOfSale: ["idPos", "name"]
    }
  }
);

// Definir un tipo para las claves de validación
type ValidationKey = 'name' | 'idPos';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  name: true,
  idPos: true
});

// Función para manejar eventos de validación con tipos correctos
const handleValidation = (field: ValidationKey, isValid: boolean) => {
  validationState.value[field] = isValid;
};

// Asegurar que el valor '010' se establezca al montar el componente
onMounted(() => {
  if (!data.value.pointOfSale.idPos) {
    data.value.pointOfSale.idPos = '';
  }
});

const wizardStore = useWizardStore();
const sinRucActive = wizardStore.wizardState?.sinRucActive || false;
</script>

<style scoped>
/* Contenedor del formulario */
.form-container {
  width: 100%;
}
</style>