<template>
  <ion-modal :is-open="isOpen" class="login-modal" :backdropDismiss="false">
    <div class="modal-container">
      <!-- Header con gradiente azul -->
      <div class="modal-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <ion-icon :icon="personOutline" class="header-icon"></ion-icon>
          </div>
          <h2 class="header-title">Iniciar Sesión</h2>
        </div>
      </div>

      <!-- Contenido del modal -->
      <div class="modal-content">
        <form @submit.prevent="handleLogin">
          <!-- Campo de usuario -->
          <div class="input-group">
            <label class="input-label">Usuario</label>
            <div class="input-wrapper">
              <ion-icon :icon="personOutline" class="input-icon"></ion-icon>
              <input
                v-model="username"
                type="text"
                placeholder="Ingrese su usuario"
                class="custom-input"
                :class="{ 'error': errors.username }"
                @input="clearError('username')"
                autocomplete="username"
              />
            </div>
            <div v-if="errors.username" class="error-message">
              {{ errors.username }}
            </div>
          </div>

          <!-- Campo de contraseña -->
          <div class="input-group">
            <label class="input-label">Contraseña</label>
            <div class="input-wrapper">
              <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingrese su contraseña"
                class="custom-input"
                :class="{ 'error': errors.password }"
                @input="clearError('password')"
                autocomplete="current-password"
              />
              <button 
                type="button"
                @click="togglePasswordVisibility"
                class="password-toggle"
              >
                <ion-icon 
                  :icon="showPassword ? eyeOffOutline : eyeOutline" 
                  class="toggle-icon"
                ></ion-icon>
              </button>
            </div>
            <div v-if="errors.password" class="error-message">
              {{ errors.password }}
            </div>
          </div>

          <!-- Mensaje de error general -->
          <div v-if="loginError" class="general-error">
            <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
            {{ loginError }}
          </div>

          <!-- Botones de acción -->
          <div class="button-group">
            <ion-button
              expand="block"
              color="danger"
              class="action-button cancel-button"
              @click="handleCancel"
              type="button"
              :disabled="isLoading"
            >
              <ion-icon :icon="closeOutline" slot="start"></ion-icon>
              CANCELAR
            </ion-button>

            <ion-button
              expand="block"
              color="primary"
              class="action-button login-button"
              type="submit"
              :disabled="isLoading || !isFormValid"
            >
              <ion-spinner v-if="isLoading" name="crescent" class="spinner"></ion-spinner>
              <ion-icon v-else :icon="logInOutline" slot="start"></ion-icon>
              <span v-if="!isLoading">INGRESAR</span>
            </ion-button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="info-section">
          <div class="divider">
            <span class="divider-text">Información del sistema</span>
          </div>
          <div class="system-info">
            <div class="info-item">
              <ion-icon :icon="businessOutline" class="info-icon"></ion-icon>
              <span>Sistema de gestión empresarial</span>
            </div>
            <div class="info-item">
              <ion-icon :icon="shieldCheckmarkOutline" class="info-icon"></ion-icon>
              <span>Acceso seguro y protegido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ion-modal>

  <!-- Modal de éxito -->
  <ion-modal :is-open="showSuccessModal" class="success-modal" :backdropDismiss="false">
    <div class="success-container">
      <div class="success-content">
        <div class="success-icon-container">
          <ion-icon :icon="checkmarkCircleOutline" class="success-icon"></ion-icon>
        </div>
        <h2 class="success-title">¡Bienvenido!</h2>
        <p class="success-message">Inicio de sesión exitoso</p>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IonModal, IonButton, IonIcon, IonSpinner } from '@ionic/vue'
import { 
  personOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  logInOutline,
  closeOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  businessOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons'

// Props
const props = defineProps<{
  isOpen: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', userData: any): void
}>()

// Estado reactivo
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const showSuccessModal = ref(false)

// Errores de validación
const errors = ref({
  username: '',
  password: ''
})

// Datos hardcoded para el login (como solicitado)
const validCredentials = [
  { username: 'admin', password: 'admin123', role: 'Administrador', name: 'Administrador del Sistema' },
  { username: 'supervisor', password: 'super123', role: 'Supervisor', name: 'Supervisor de Ventas' },
  { username: 'operador', password: 'oper123', role: 'Operador', name: 'Operador de Caja' },
  { username: 'demo', password: 'demo123', role: 'Demo', name: 'Usuario Demo' }
]

// Computed properties
const isFormValid = computed(() => {
  return username.value.trim() !== '' && 
         password.value.trim() !== '' && 
         !errors.value.username && 
         !errors.value.password
})

// Métodos
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const clearError = (field: 'username' | 'password') => {
  errors.value[field] = ''
  loginError.value = ''
}

const validateForm = () => {
  let isValid = true
  
  // Validar usuario
  if (!username.value.trim()) {
    errors.value.username = 'El usuario es requerido'
    isValid = false
  } else if (username.value.trim().length < 3) {
    errors.value.username = 'El usuario debe tener al menos 3 caracteres'
    isValid = false
  }
  
  // Validar contraseña
  if (!password.value.trim()) {
    errors.value.password = 'La contraseña es requerida'
    isValid = false
  } else if (password.value.trim().length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  // Limpiar errores previos
  errors.value = { username: '', password: '' }
  loginError.value = ''
  
  // Validar formulario
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Buscar credenciales válidas
    const user = validCredentials.find(
      cred => cred.username === username.value.trim() && 
              cred.password === password.value.trim()
    )
    
    if (user) {
      // Login exitoso
      showSuccessModal.value = true
      
      // Cerrar modal de éxito después de 2 segundos y emitir evento
      setTimeout(() => {
        showSuccessModal.value = false
        emit('success', {
          username: user.username,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString()
        })
        resetForm()
      }, 2000)
    } else {
      // Credenciales incorrectas
      loginError.value = 'Usuario o contraseña incorrectos'
      
      // Vibración si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(300)
      }
    }
  } catch (error) {
    loginError.value = 'Error de conexión. Intente nuevamente.'
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  username.value = ''
  password.value = ''
  showPassword.value = false
  errors.value = { username: '', password: '' }
  loginError.value = ''
  isLoading.value = false
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<style scoped>
/* Modal principal */
.login-modal::part(content) {
  --width: 90%;
  --max-width: 420px;
  --height: auto;
  --border-radius: 16px;
  --box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

/* Header */
.modal-header {
  background: linear-gradient(135deg, #1a56db 0%, #4F46E5 100%);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(45deg);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.header-icon {
  font-size: 1.5rem;
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Contenido */
.modal-content {
  padding: 2rem 1.5rem 1.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.25rem;
  color: #6B7280;
  z-index: 1;
}

.custom-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-size: 1rem;
  background: #F9FAFB;
  transition: all 0.2s ease;
  outline: none;
}

.custom-input:focus {
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.custom-input.error {
  border-color: #EF4444;
  background: #FEF2F2;
}

.custom-input::placeholder {
  color: #9CA3AF;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.password-toggle:hover {
  background: #F3F4F6;
}

.toggle-icon {
  font-size: 1.25rem;
  color: #6B7280;
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.general-error {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #DC2626;
  font-size: 0.875rem;
  animation: shake 0.5s ease-in-out;
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Botones */
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  margin: 0;
  --border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.025em;
  height: 3rem;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.cancel-button {
  --background: #F3F4F6;
  --color: #374151;
  --background-hover: #E5E7EB;
  --background-activated: #E5E7EB;
}

.login-button {
  --background: linear-gradient(135deg, #4F46E5 0%, #1a56db 100%);
  --background-hover: linear-gradient(135deg, #4338CA 0%, #1e40af 100%);
  --background-activated: linear-gradient(135deg, #4338CA 0%, #1e40af 100%);
}

.action-button:disabled {
  opacity: 0.6;
  --box-shadow: none;
}

.spinner {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

/* Sección de información */
.info-section {
  border-top: 1px solid #E5E7EB;
  padding-top: 1.5rem;
}

.divider {
  text-align: center;
  margin-bottom: 1rem;
}

.divider-text {
  background: white;
  color: #6B7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 1rem;
  position: relative;
}

.divider-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -100px;
  right: calc(100% + 1rem);
  height: 1px;
  background: #E5E7EB;
}

.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -100px;
  left: calc(100% + 1rem);
  height: 1px;
  background: #E5E7EB;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.info-icon {
  font-size: 1.125rem;
  color: #4F46E5;
}

/* Modal de éxito */
.success-modal::part(content) {
  --width: 90%;
  --max-width: 320px;
  --height: auto;
  --border-radius: 20px;
  --box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.success-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon-container {
  background: #D1FAE5;
  border-radius: 50%;
  padding: 1rem;
  margin-bottom: 1rem;
}

.success-icon {
  font-size: 3rem;
  color: #059669;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #065F46;
  margin: 0 0 0.5rem 0;
}

.success-message {
  font-size: 1rem;
  color: #6B7280;
  margin: 0;
}

/* Animaciones */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive */
@media (min-width: 768px) {
  .login-modal::part(content) {
    --max-width: 480px;
  }
  
  .header-title {
    font-size: 1.75rem;
  }
  
  .custom-input {
    font-size: 1.0625rem;
  }
  
  .action-button {
    font-size: 1rem;
  }
}
</style>