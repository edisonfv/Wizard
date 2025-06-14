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
                v-model="data.cedula"
                label="Cédula"
                icon="mdi:card-account-details"
                placeholder="Cédula"
                required
                @input="handleCedulaInput"
                @validation="(isValid) => handleValidation('cedula', isValid)"
              />

              <!-- Nombres -->
              <FormField
                v-model="nombres"
                label="Nombres"
                icon="mdi:account"
                placeholder="Nombres"
                required
                @input="handleNameInput"
                @validation="(isValid) => handleValidation('firstName', isValid)"
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
          <!-- Mostrar formulario de facturación si el email es válido -->
          <div v-if="validationState.email && data.email">
            <BillDataForm ref="billDataFormRef" />
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
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

// Valores iniciales para el formulario
const initialValues = {
  name: "",
  email: "",
  base64: "",
  cedula: "",
  rol: {
    id: "9de79ed8-b4f0-48bb-ab5d-6caca8a454ed",
    name: "Administrador",
    is_main: true,
    description: null
  }
};

// Usar el composable useInitialData para manejar los datos
const { data, updateField } = useInitialData(
  "createUser",
  initialValues,
  {
    autoSave: true,
    debug: true // Activar debug para ver los logs
  }
);

// Variables locales para nombres y apellidos
const nombres = ref("");
const apellidos = ref("");
const billDataFormRef = ref<any>(null);
const billSectionParent = ref<HTMLElement | null>(null);

// Definir un tipo para las claves de validación
type ValidationKey = 'firstName' | 'lastName' | 'email' | 'rol' | 'cedula';

// Estado para validación de campos con tipo explícito
const validationState = ref<Record<ValidationKey, boolean>>({
  firstName: true,
  lastName: true,
  email: true,
  rol: true,
  cedula: true
});

// Función para manejar eventos de validación con tipos correctos
const handleValidation = (field: ValidationKey, isValid: boolean) => {
  validationState.value[field] = isValid;
};

// Función para actualizar el nombre completo
const updateFullName = () => {
  // Concatenar nombres y apellidos con un espacio entre ellos
  const fullName = `${nombres.value} ${apellidos.value}`.trim();
  
  // Actualizar el campo name en el objeto data
  updateField('name', fullName);
  
  console.log("Nombre completo actualizado:", fullName);
};

// Manejadores de eventos para los inputs con validación
const handleNameInput = (event: Event) => {
  nombres.value = allowOnlyLetters(event);
  // Actualizar el nombre completo después de cambiar el nombre
  nextTick(() => {
    updateFullName();
  });
};

const handleLastInput = (event: Event) => {
  apellidos.value = allowOnlyLetters(event);
  // Actualizar el nombre completo después de cambiar el apellido
  nextTick(() => {
    updateFullName();
  });
};

const handleEmailInput = (event: Event) => {
  // Usar la función de validación en tiempo real
  const result = validateEmailInRealTime(event);
  updateField('email', result.value);
  handleValidation('email', result.isValid);
};

const handleCedulaInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  const cedulaValue = target?.value ?? '';
  updateField('cedula', cedulaValue);
  handleValidation('cedula', cedulaValue.length > 0);
};

// Función de validación para el email que devuelve un objeto con value e isValid
const validateEmailInput = (event: Event) => {
  return validateEmailInRealTime(event);
};

// Inicializar nombres y apellidos si ya existe un nombre completo
onMounted(() => {
  const initializeNames = () => {
    if (data.value.name) {
      const nameParts = data.value.name.split(' ');
      if (nameParts.length > 1) {
        // El último elemento es el apellido, el resto son nombres
        apellidos.value = nameParts.pop() || '';
        nombres.value = nameParts.join(' ');
      } else if (nameParts.length === 1) {
        nombres.value = nameParts[0];
      }
      
      console.log("Inicializado con:", {
        nombreCompleto: data.value.name,
        nombres: nombres.value,
        apellidos: apellidos.value
      });
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

// Observar cambios en nombres y apellidos para actualizar el nombre completo
watch([nombres, apellidos], () => {
  if (nombres.value || apellidos.value) {
    updateFullName();
  }
}, { immediate: true });

watch(
  () => validationState.value.email && data.value.email,
  (showBillData) => {
    if (showBillData) {
      nextTick(() => {
        // Scroll al formulario de facturación
        const el = billDataFormRef.value?.billDataRef;
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
);
</script>

<style scoped>
/* Los estilos se mantienen igual */
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

/* Estilos para la tarjeta principal */
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

/* Contenedor de sección con estilos comunes */
.section-container {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Contenedor del encabezado */
.header-container {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
}

/* Título de sección */
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

/* Subtítulo de sección */
.section-subtitle {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
  margin-top: 0;
  margin-bottom: 0;
}

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
    gap: 16px;
  }
}

/* Estilos para el contenido */
.wizard-content {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}
</style>