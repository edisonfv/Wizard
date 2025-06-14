<template>
  <form class="w-full" @submit.prevent>
    <!-- Fila con Fecha y Valor a Pagar en columnas separadas -->
    <div class="flex flex-col md:flex-row md:gap-4">
      <!-- Input Fecha -->
      <div class="relative flex flex-col  my-1.5 w-full md:w-1/2">
        <label for="date" class="text-gray-700 font-medium mb-1">
          Fecha <span class="required">*</span>
        </label>
        <div class="relative w-full">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon icon="mdi:calendar" width="20" height="20" />
          </div>
          <input
            id="date"
            type="date"
            v-model="data.payment.date"
            required
            class="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none transition-all duration-300 hover:border-blue-400"
            :class="{
              'bg-primary-50 border-primary ': data.payment.date,
              'border-blue-500 border-2 shadow-md': focusedField === 'date'
            }"
            @focus="setFocus('date')"
            @blur="clearFocus"
          />
        </div>
      </div>

      <!-- Input Valor a Pagar -->
      <div class="relative flex flex-col  my-1.5 w-full md:w-1/2">
        <label for="amount" class="text-gray-700 font-medium mb-1">
          Valor pagado <span class="required">*</span>
        </label>
        <div class="relative w-full">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon icon="mdi:currency-usd" width="20" height="20" />
          </div>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="Valor a pagar"
            v-model.number="data.payment.amount"
            required
            @input="handleAmountInput"
            class="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none transition-all duration-300 hover:border-blue-400 no-spinner"
            :class="{
              'bg-primary-50 border-primary ': data.payment.amount > 0,
              'border-blue-500 border-2 shadow-md': focusedField === 'amount'
            }"
            @focus="setFocus('amount')"
            @blur="clearFocus"
          />
        </div>
      </div>
    </div>

    <!-- Tipo de tarjeta -->
    <div class="relative flex flex-col  my-1.5 w-full">
      <label for="typeCard" class="text-gray-700 font-medium mb-1">
        Tipo de tarjeta <span class="required">*</span>
      </label>
      <div class="relative w-full">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon icon="famicons:card-outline" width="20" height="20" />
        </div>
        <input
          id="typeCard"
          type="text"
          placeholder="Ej.: Visa"
          v-model="data.payment.datafastData.typeCard"
          required
          @input="handleTypeCardInput"
          class="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none transition-all duration-300 hover:border-blue-400"
          :class="{
            'bg-primary-50 border-primary ': data.payment.datafastData.typeCard.length > 0,
            'border-blue-500 border-2 shadow-md': focusedField === 'typeCard'
          }"
          @focus="setFocus('typeCard')"
          @blur="clearFocus"
        />
      </div>
    </div>

    <!-- Input Comprobante de Pago -->
    <div class="relative flex flex-col  my-2.5 w-full">
      <label for="proofPayment" class="text-gray-700 font-medium mb-1">
        Comprobante de pago <span class="required">*</span>
      </label>
      <div class="relative w-full">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon icon="f7:number" width="20" height="20" />
        </div>
        <input
          id="proofPayment"
          type="text"
          placeholder="Ingresa el número de comprobante"
          v-model="data.payment.datafastData.proofPayment"
          required
          @input="handleProofPaymentInput"
          class="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none transition-all duration-300 hover:border-blue-400"
          :class="{
            'bg-primary-50 border-primary ': data.payment.datafastData.proofPayment && data.payment.datafastData.proofPayment.length > 0,
            'border-blue-500 border-2 shadow-md': focusedField === 'proofPayment'
          }"
          @focus="setFocus('proofPayment')"
          @blur="clearFocus"
        />
      </div>
    </div>

    <!-- Input del lote -->
    <div class="relative flex flex-col  my-2.5 w-full">
      <label for="numberLote" class="text-gray-700 font-medium mb-1">
        Número de Lote <span class="required">*</span>
      </label>
      <div class="relative w-full">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon icon="f7:number" width="20" height="20" />
        </div>
        <input
          id="numberLote"
          type="text"
          placeholder="Ingresa el número de lote"
          v-model="data.payment.datafastData.numberLote"
          required
          @input="handleNumberLoteInput"
          class="w-full p-3 pl-12 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none transition-all duration-300 hover:border-blue-400"
          :class="{
            'bg-primary-50 border-primary ': data.payment.datafastData.numberLote.length > 0,
            'border-blue-500 border-2 shadow-md': focusedField === 'numberLote'
          }"
          @focus="setFocus('numberLote')"
          @blur="clearFocus"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useInitialData } from "@/composables/useInitialData";
import { 
allowPositiveNumbersWithTwoDecimals, 
allowOnlyLettersSpacesAndNumbers,
allowOnlyNumericCharacters
} from "@/utils/input-controls"; // Importar las funciones de validación

// Variable para controlar el campo enfocado
const focusedField = ref('');

// Funciones para manejar el enfoque
const setFocus = (fieldName: string) => {
  focusedField.value = fieldName;
};

const clearFocus = () => {
  focusedField.value = '';
};

// Formatear la fecha actual en formato YYYY-MM-DD para el input date
const formatCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Valores iniciales para el formulario
const initialValues = {
  payment: {
    date: formatCurrentDate(),
    amount: 0,
    datafastData: {
      typeCard: "",
      numberLote: "",
      proofPayment: ""
    }
  }
};

// Usar el composable useInitialData para manejar los datos
const { data } = useInitialData(
  "salesData",
  initialValues,
  {
    autoSave: true,
    debug: false,
    nestedFields: {
      payment: ["date", "amount", "datafastData"]
    }
  }
);

// Manejadores de eventos para los inputs con validación
const handleAmountInput = (event: Event) => {
const inputValue = allowPositiveNumbersWithTwoDecimals(event);
// Convertir el string a número antes de asignarlo
data.value.payment.amount = inputValue ? parseFloat(inputValue) : 0;
};

const handleTypeCardInput = (event: Event) => {
data.value.payment.datafastData.typeCard = allowOnlyLettersSpacesAndNumbers(event);
};

const handleNumberLoteInput = (event: Event) => {
data.value.payment.datafastData.numberLote = allowOnlyNumericCharacters(event);
};

const handleProofPaymentInput = (event: Event) => {
  data.value.payment.datafastData.proofPayment = allowOnlyNumericCharacters(event);
};

// Asegurar que la fecha current se cargue al montar el componente
onMounted(() => {
  // Si no hay fecha establecida, establecer la fecha actual
  if (!data.value.payment.date) {
    data.value.payment.date = formatCurrentDate();
  }
});
</script>

<style scoped>
:root {
  --primary-color: var(--ion-color-primary);
  --primary-light: rgba(var(--ion-color-primary-rgb), 0.1);
  --primary-lighter: rgba(var(--ion-color-primary-rgb), 0.05);
}

input:focus {
  outline: none;
  border-color: #1a73e8 !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 1px rgba(26, 115, 232, 0.1);
}

.border-blue-500 {
  border-color: rgb(0, 60, 255) !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 1px rgba(26, 115, 232, 0.1);
}

/* Eliminar flechas (spinner) de los inputs numéricos */
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Para Firefox */
.no-spinner {
  -moz-appearance: textfield;
}

.required {
color: var(--ion-color-primary);
}

@media (max-width: 640px) {
  input {
    padding: 0.6rem 1rem 0.6rem 2.5rem !important;
  }
}
</style>