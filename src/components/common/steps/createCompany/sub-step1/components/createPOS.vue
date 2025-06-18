<template>
  <form @submit.prevent class="form-container">
    <div class="form-row">
      <!-- Código del Punto de Venta -->
      <div class="input-col input-col-1">
        <FormField
          v-model="data.pointOfSale.idPos"
          label="Código"
          icon="mdi:barcode"
          placeholder="Código"
          required

          @validation="(isValid) => handleValidation('idPos', isValid)"
        />
      </div>
      <!-- Nombre del Punto de Venta -->
      <div class="input-col input-col-2">
        <FormField
          v-model="data.pointOfSale.name"
          label="Nombre"
          icon="mdi:store"
          placeholder="Nombre"
          required
          @validation="(isValid) => handleValidation('name', isValid)"
        />
      </div>
    </div>
    <!-- Input de Nombre Final -->
    <div class="full-row">
      <FormField
        v-model="data.pointOfSale.finalName"
        label="Nombre del Punto de Emisión"
        icon="mdi:store"
        placeholder="Nombre a guardar"
        required
        @validation="(isValid) => handleValidation('finalName', isValid)"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
//import { useWizardStore } from "@/stores/wizardStore";

// Valores iniciales para el formulario
const initialValues = {
  pointOfSale: {
    idPos: '',
    name: '',
    finalName: ''
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
      pointOfSale: ["idPos", "name", "finalName"]
    }
  }
);

// Definir un tipo para las claves de validación
type ValidationKey = 'name' | 'idPos' | 'finalName';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  name: true,
  idPos: true,
  finalName: true
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

watch([
  () => data.value.pointOfSale.idPos,
  () => data.value.pointOfSale.name
], ([codigo, nombre]) => {
  if (codigo && nombre) {
    data.value.pointOfSale.finalName = `${codigo} - ${nombre}`;
  } else if (codigo) {
    data.value.pointOfSale.finalName = `${codigo}`;
  } else if (nombre) {
    data.value.pointOfSale.finalName = `${nombre}`;
  } else {
    data.value.pointOfSale.finalName = '';
  }
});

//const wizardStore = useWizardStore();
//const sinRucActive = wizardStore.wizardState?.sinRucActive || false;
</script>

<style scoped>
/* Contenedor del formulario */
.form-container {
  width: 100%;
}
.form-row {
  display: flex;
  gap: 12px;
}
.input-col-1 {
  flex: 1 1 0%;
  min-width: 120px;
  max-width: 180px;
}
.input-col-2 {
  flex: 2 1 0%;
}
.full-row {
  width: 100%;
  margin-top: 10px;
}
@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 6px;
  }
  .input-col-1, .input-col-2 {
    max-width: 100%;
  }
}
</style>