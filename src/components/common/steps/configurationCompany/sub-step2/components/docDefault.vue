<template>
  <span class="block text-left text-gray-700">Elige el tipo de documento que deseas emitir por defecto al vender</span>
  <div class="py-2 bg-white rounded-xl">    
    <!-- Grid mejorado con SelectableCard -->
    <div class="w-full">
      <ion-grid class="w-full mx-auto document-grid">
        <ion-row class="ion-justify-content-center">
          <ion-col
            size="6"
            size-md="6"
            v-for="opcion in opcionesDocumento"
            :key="opcion.value"
            class="pb-2.5"
          >
            <!-- Usando el componente SelectableCard con ancho completo -->
            <SelectableCard
              v-model="selectedDocumentType"
              :value="opcion.value"
              :label="opcion.label"
              :icon="getIconForDocumentType(opcion.value)"
              height="120px"
              class="w-full"
              @update:modelValue="seleccionarDocumento"
            />
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { IonGrid, IonRow, IonCol } from '@ionic/vue';
import SelectableCard from "@/components/ui/selectableCard.vue";

interface DocumentoOpcion {
  label: string;
  value: string;
}

// Definir props para recibir datos del componente padre
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

// Definir eventos para comunicarse con el componente padre
const emit = defineEmits(['update']);

// Opciones de documentos disponibles
const opcionesDocumento = ref<DocumentoOpcion[]>([
  { label: 'Facturas electrónicas', value: 'facturas' },
  { label: 'Recibos', value: 'recibos' }
]);

// Estado local para el tipo de documento seleccionado
const selectedDocumentType = ref(props.formData.defaultDocument || 'facturas');

// Sincronizar el estado local con los props cuando cambian
watch(() => props.formData.defaultDocument, (newValue) => {
  if (newValue && newValue !== selectedDocumentType.value) {
    selectedDocumentType.value = newValue;
  }
});

// Inicializar el componente
onMounted(() => {
  // Asegurarse de que el estado local esté sincronizado con los props
  selectedDocumentType.value = props.formData.defaultDocument || 'facturas';
});

// Función para seleccionar un documento
const seleccionarDocumento = (value: string) => {
  // Actualizar el estado local
  selectedDocumentType.value = value;
  
  // Emitir evento al componente padre
  emit('update', 'root', { defaultDocument: value });
  
  console.log('Documento seleccionado:', value);
};

// Función para obtener el icono según el tipo de documento
const getIconForDocumentType = (documentType: string): string => {
  switch (documentType) {
    case 'facturas':
      return 'mdi:file-document-outline';
    case 'recibos':
      return 'mdi:receipt-text-outline';
    default:
      return 'mdi:file-outline';
  }
};
</script>

<style scoped>
/* Configuración del grid de Ionic con CSS estándar */
.document-grid {
  --ion-grid-padding: 0;
  --ion-grid-column-padding: 8px;
  width: 100%;
}

/* Asegurar que el contenido de las tarjetas esté centrado */
:deep(.selectable-card-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  width: 100%;
}

/* Hacer los iconos más pequeños */
:deep(.selectable-card svg),
:deep(.selectable-card i),
:deep(.selectable-card .icon) {
  font-size: 3rem !important;
  width: 3rem !important;
  height: 3rem !important;
}
</style>