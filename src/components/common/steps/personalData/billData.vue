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
                v-model="data.cedula"
                :label="documentType === 'cedula' ? 'Cédula' : 'RUC'"
                :icon="documentType === 'cedula' ? 'mdi:card-account-details' : 'mdi:domain'"
                :placeholder="documentType === 'cedula' ? 'Cédula' : 'RUC'"
                required
                @input="handleCedulaInput"
                @validation="(isValid) => handleValidation('cedula', isValid)"
              />
            </div>
          </div>

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

          <!-- Rol -->
          <!-- <FormField
            v-model="data.rol.name"
            label="Rol"
            icon="oui:app-users-roles"
            readonly
            disabled
            @validation="(isValid) => handleValidation('rol', isValid)"
          /> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineExpose } from 'vue';
import FormField from "@/components/ui/FormField.vue";
import { useInitialData } from "@/composables/useInitialData";
import {
  allowOnlyLetters,
  validateEmailInRealTime,
} from "@/utils/input-controls";

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

// Selector de tipo de documento
const documentType = ref('cedula');

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
});

// Observar cambios en nombres y apellidos para actualizar el nombre completo
watch([nombres, apellidos], () => {
  if (nombres.value || apellidos.value) {
    updateFullName();
  }
}, { immediate: true });

const billDataRef = ref<HTMLElement | null>(null);
defineExpose({ billDataRef });
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