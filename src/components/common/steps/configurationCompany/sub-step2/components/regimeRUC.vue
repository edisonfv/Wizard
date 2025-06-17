<template>
  <div class="info-field">
    <div class="info-label">
      <b>Régimen:</b>
      <div class="info-value">
        <template v-if="editable">
          <input type="text" :value="props.formData.regimeRUC" @input="onInput" class="editable-input" placeholder="" />
        </template>
        <template v-else>
          <span v-if="regimeValue !== ''">{{ regimeValue }}</span>
          <span v-else>&nbsp;</span>
        </template>
      </div>
    </div>
  </div>
</template>
    
<script setup lang="ts"> 
import { computed } from 'vue';

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
  emit('update', 'regimeRUC', (e.target as HTMLInputElement).value);
};

const regimeValue = computed(() => {
  if (props.formData && props.formData.regimeRUC !== undefined) {
    return props.formData.regimeRUC;
  }
  return '';
});
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