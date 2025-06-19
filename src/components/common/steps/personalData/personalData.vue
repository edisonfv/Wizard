<template>
  <div class="w-full flex justify-center">
    <ion-card class="wizard-card main-container">
      <ion-card-content class="wizard-content">
        <div class="section-container" ref="billSectionParent">
          <div class="header-container">
            <h4 class="section-title">Datos Personales</h4>
            <h5 class="section-subtitle">Completa los datos personales del cliente</h5>
          </div>
          <div class="w-full">
            <form @submit.prevent class="form-container">
              <!-- Cédula -->
              <FormField
                v-model="data.id"
                label="Cédula"
                icon="mdi:card-account-details"
                placeholder="Cédula"
                required
                @input="handleIdInput"
                @validation="(isValid) => handleValidation('id', isValid)"
              />

              <!-- Nombres -->
              <FormField
                v-model="nombres"
                label="Nombres"
                icon="mdi:account"
                placeholder="Nombres"
                required
                @input="handleNameInput"
                @validation="(isValid) => handleValidation('name', isValid)"
              />

              <!-- Apellidos -->
              <FormField
                v-model="apellidos"
                label="Apellidos"
                icon="mdi:account-outline"
                placeholder="Apellidos"
                required
                @input="handleLastInput"
                @validation="(isValid) => handleValidation('lastName', isValid)"
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
                errorMessage="Por favor, ingrese un correo electrónico válido"
              />
            </form>
          </div>
          <div v-if="validationState.email && data.email" style="position:relative;">
            <BillDataForm ref="billDataFormRef" @validation="handleBillValidation" />
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, nextTick, onMounted } from 'vue';
import autoAnimate from '@formkit/auto-animate';
import {
  IonCard,
  IonCardContent,
} from '@ionic/vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import {
  allowOnlyLetters,
  validateEmailInRealTime,
} from "@/utils/input-controls";
import BillDataForm from './billData.vue';

const initialValues = {
  id: "",
  name: "",
  phone: "",
  email: "",
};

const { data, updateField } = useInitialData(
  "createUser",
  initialValues,
  {
    autoSave: true,
    debug: false // Desactivar logs innecesarios
  }
);

const nombres = ref("");
const apellidos = ref("");
const billDataFormRef = ref<any>(null);
const billSectionParent = ref<HTMLElement | null>(null);

type ValidationKey = 'id' | 'name' | 'lastName' | 'phone' | 'email';
const validationState = ref<Record<ValidationKey, boolean>>({
  id: false,
  name: false,
  lastName: false,
  phone: false,
  email: false
});

const isPersonalValid = computed(() => Object.values(validationState.value).every(Boolean));
const isBillValid = ref(false);

const emit = defineEmits(['step-valid']);
const emitStepValid = () => {
  emit('step-valid', isPersonalValid.value && isBillValid.value);
};
watch([isPersonalValid, isBillValid], emitStepValid, { immediate: true });

const handleValidation = (field: ValidationKey, isValid: boolean) => {
  validationState.value[field] = isValid;
};

const updateFullName = () => {
  const fullName = `${nombres.value} ${apellidos.value}`.trim();
  updateField('name', fullName);
  data.value.name = fullName;
};

const handleNameInput = (event: Event) => {
  nombres.value = allowOnlyLetters(event);
  nextTick(() => {
    updateFullName();
    handleValidation('name', nombres.value.length > 0);
  });
};

const handleLastInput = (event: Event) => {
  apellidos.value = allowOnlyLetters(event);
  nextTick(() => {
    updateFullName();
    handleValidation('lastName', apellidos.value.length > 0);
  });
};

const handleEmailInput = (event: Event) => {
  const result = validateEmailInRealTime(event);
  updateField('email', result.value);
  handleValidation('email', result.isValid);
};

const handleIdInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const idValue = target?.value ?? '';
  updateField('id', idValue);
  handleValidation('id', idValue.length > 0);
};

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const phoneValue = target?.value ?? '';
  updateField('phone', phoneValue);
  handleValidation('phone', phoneValue.length > 0);
};


const handleBillValidation = (val: boolean) => {
  isBillValid.value = val;
};

onMounted(() => {
  const initializeNames = () => {
    if (data.value.name) {
      const nameParts = data.value.name.split(' ');
      if (nameParts.length > 1) {
        apellidos.value = nameParts.pop() || '';
        nombres.value = nameParts.join(' ');
      } else if (nameParts.length === 1) {
        nombres.value = nameParts[0];
      }
    }
  };
  initializeNames();
  if (billSectionParent.value) {
    autoAnimate(billSectionParent.value, {
      duration: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
    });
  }
});

watch([nombres, apellidos], () => {
  if (nombres.value || apellidos.value) {
    nextTick(() => {
      updateFullName();
    });
  }
}, { immediate: false });
</script>

<style scoped>
.main-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (min-width: 768px) {
  .main-container {
    max-width: 768px;
  }
}

.wizard-card {
  width: 100%;
  margin: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.wizard-content {
  padding: 10px;
}

.section-container {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.header-container {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
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

.form-container {
  width: 100%;
}

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

.wizard-content {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}
</style>