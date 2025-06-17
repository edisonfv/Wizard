<template>
  <div class="info-field">
    <div class="info-label">
      <b>Agente de retención:</b> 
      <div class="info-value">
        <template v-if="editable">
          <select :value="props.formData.taxAgent?.isAgent === undefined ? '' : String(props.formData.taxAgent.isAgent)" @change="onInput" class="editable-input">
            <option value="">No especificado</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </template>
        <template v-else>
          <span v-if="props.formData.taxAgent && typeof props.formData.taxAgent.isAgent === 'boolean'">
            {{ props.formData.taxAgent.isAgent ? 'Sí' : 'No' }}
          </span>
          <span v-else>&nbsp;</span>
        </template>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update']);

const onInput = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  emit('update', 'taxAgent', { ...props.formData.taxAgent, isAgent: val === '' ? undefined : val === 'true' });
};
</script>
    
<style scoped>
.info-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.info-field:hover {
  background-color: #f3f4f6;
}

.info-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  padding: 0.25rem 0.25rem;
}

.editable-input {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.875rem;
  color: #222;
  background: #fff;
}
</style>