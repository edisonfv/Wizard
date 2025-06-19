<template>
  <div class="bill-form-extension" ref="billDataRef">
    <div class="section-container">
      <div class="header-container">
        <h4 class="section-title">Datos de Facturacion</h4>
        <h5 class="section-subtitle">Completa los datos de facturacion del cliente</h5>
      </div>
      <div class="w-full">
        <form @submit.prevent class="form-container">
          <!-- Selector de tipo de documento y Cédula/RUC -->
          <div class="form-row" style="align-items: flex-end; gap: 8px;">
            <div style="min-width: 110px;">
              <div class="doc-type-menu">
                <button
                  type="button"
                  :class="['doc-type-btn', documentType === 'cedula' ? 'active' : '']"
                  @click="documentType = 'cedula'"
                >
                  Cédula
                </button>
                <button
                  type="button"
                  :class="['doc-type-btn', documentType === 'ruc' ? 'active' : '']"
                  @click="documentType = 'ruc'"
                >
                  RUC
                </button>
              </div>
            </div>
            <div style="flex: 1;">
              <FormField
                v-model="data.documentNumber"
                :label="documentType === 'cedula' ? 'Cédula' : 'RUC'"
                :icon="documentType === 'cedula' ? 'mdi:card-account-details' : 'mdi:domain'"
                :placeholder="documentType === 'cedula' ? 'Cédula' : 'RUC'"
                required
                @input="handleDocumentNumberInput"
                @validation="(isValid) => handleValidation('documentNumber', isValid)"
              />
            </div>
          </div>

          <!-- Nombres -->
          <FormField
            v-model="data.name"
            label="Nombres"
            icon="mdi:account"
            placeholder="Nombres"
            required
            @input="handleNameInput"
            @validation="(isValid) => handleValidation('name', isValid)"
          />

          <!-- Teléfono -->
          <FormField
            v-model="data.phone"
            label="Teléfono"
            icon="mdi:phone"
            placeholder="Teléfono"
            required
            @input="handlePhoneInput"
            @validation="(isValid) => handleValidation('phone', isValid)"
          />

          <!-- Correo Electrónico -->
          <FormField
            v-model="data.email"
            label="Correo Electrónico"
            icon="mdi:email"
            placeholder="Email"
            required
            @input="handleEmailInput"
            @validation="(isValid) => handleValidation('email', isValid)"
            :validator="validateEmailInput"
            errorMessage="Por favor, ingrese un correo electrónico válido"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineExpose, defineEmits, computed } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import { validateEmailInRealTime } from "@/utils/input-controls";

// Valores iniciales para el formulario según state.ts y wizardTypes.ts
const initialValues = {
  documentType: "cedula",
  documentNumber: "",
  name: "",
  phone: "",
  email: "",
};

// Usar el composable useInitialData para manejar los datos
const { data, updateField } = useInitialData(
  "billingData",
  initialValues,
  {
    autoSave: true,
    debug: false
  }
);

// Selector de tipo de documento
const documentType = ref('cedula');

// Estado para validación de campos
// Ajustado a la nueva estructura
const validationState = ref({
  documentNumber: false,
  name: false,
  phone: false,
  email: false
});

const emit = defineEmits(['validation']);
const isFormValid = computed(() => Object.values(validationState.value).every(Boolean));
watch(isFormValid, (val) => emit('validation', val), { immediate: true });

const handleValidation = (field: keyof typeof validationState.value, isValid: boolean) => {
  validationState.value[field] = isValid;
};

const handleDocumentNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const value = target?.value ?? '';
  updateField('documentNumber', value);
  handleValidation('documentNumber', value.length > 0);
};

const handleNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const value = target?.value ?? '';
  updateField('name', value);
  handleValidation('name', value.length > 0);
};

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const value = target?.value ?? '';
  updateField('phone', value);
  handleValidation('phone', value.length > 0);
};

const handleEmailInput = (event: Event) => {
  const result = validateEmailInRealTime(event);
  updateField('email', result.value);
  handleValidation('email', result.isValid);
};

const validateEmailInput = (event: Event) => {
  return validateEmailInRealTime(event);
};

// Mantener el tipo de documento sincronizado con el objeto
watch(documentType, (val) => {
  updateField('documentType', val);
});

// Inicializar el tipo de documento desde el objeto si existe
onMounted(() => {
  if (data.value.documentType) {
    documentType.value = data.value.documentType;
  }
});

const billDataRef = ref<HTMLElement | null>(null);
defineExpose({
  billDataRef,
  data,
  updateField
});
</script>

<style scoped>
.bill-form-extension {
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
  border: none;
}
.section-container {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}
.header-container {
  margin-top: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  margin-bottom: 0.5rem;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}
.section-subtitle {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
  margin-top: 0;
  margin-bottom: 0;
}

/* Fila de formulario para elementos en línea */
.form-row {
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}

/* Estilos para el menú de tipo de documento */
.doc-type-menu {
  display: flex;
  gap: 8px;
  height: 48px;
  align-items: stretch;
}

.doc-type-btn {
  background: #f3f4f6;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 32px;
  font-size: 1.08rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.doc-type-btn:hover:not(.active) {
  background: #e0e7ef;
  color: #2563eb;
  border-color: #2563eb;
}

.doc-type-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
}

@media (max-width: 640px) {
  .doc-type-menu {
    height: 44px;
  }
  .doc-type-btn {
    padding: 0 16px;
    font-size: 1rem;
  }
}
</style>