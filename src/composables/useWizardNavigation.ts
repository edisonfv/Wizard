import { ref, computed } from "vue"
import type { Component } from "vue"

// Definición de tipos unificados
export interface WizardStep {
  label: string
  key: string
  description?: string
}

export interface SubStep {
  title: string
  component: Component
}

export interface WizardStepsConfig {
  [type: string]: WizardStep[]
}

export interface WizardSubStepsConfig {
  [stepKey: string]: SubStep[]
}

/**
 * Composable unificado para la navegación del wizard
 * Combina la funcionalidad de useWizardProgress y useWizardSubSteps
 * 
 * @param type Tipo de wizard (sales, soporte, cliente, general)
 * @param subStepsConfig Configuración de sub-pasos
 * @returns Funciones y estados para la navegación del wizard
 */
export function useWizardNavigation(
  type: "sales" | "soporte" | "cliente" | "general",
  subStepsConfig: WizardSubStepsConfig
) {
  // ---- ESTADO COMPARTIDO ----
  
  // Estado reactivo para el paso principal actual
  const currentStep = ref(0)
  
  // Estado reactivo para el índice del sub-paso actual
  const currentSubStepIndex = ref(0)
  
  // ---- LÓGICA DE PASOS PRINCIPALES ----
  
  // Definir los pasos comunes a todos los tipos de wizard
  const commonSteps: WizardStep[] = [
    { label: "Creacion de Usuario", key: "personal-info" },
    { label: "Configuraciones de la Empresa", key: "config-company" },
    { label: "Datos de la Empresa", key: "create-company" },
  ]

  // Configuración centralizada de pasos para cada tipo de wizard
  const wizardStepsConfig: WizardStepsConfig = {
    sales: [{ label: "Datos de venta", key: "data-sales" }, ...commonSteps],
    soporte: [...commonSteps],
    cliente: [...commonSteps],
    general: [...commonSteps],
  }

  // Obtener pasos según el tipo de wizard
  const steps = computed(() => wizardStepsConfig[type] || [])
  
  // Obtener la clave del paso actual
  const currentStepKey = computed(() => {
    return steps.value[currentStep.value]?.key || ""
  })
  
  // ---- LÓGICA DE SUB-PASOS ----
  
  /**
   * Verifica si un paso principal tiene sub-pasos
   * @param stepKey Clave del paso principal
   * @returns true si el paso tiene sub-pasos, false en caso contrario
   */
  const hasSubSteps = (stepKey: string): boolean => {
    return !!subStepsConfig[stepKey] && subStepsConfig[stepKey].length > 0
  }

  /**
   * Obtiene los sub-pasos para un paso principal específico
   * @param stepKey Clave del paso principal
   * @returns Array de sub-pasos o array vacío si no hay sub-pasos
   */
  const getSubSteps = (stepKey: string): SubStep[] => {
    return subStepsConfig[stepKey] || []
  }

  /**
   * Obtiene el número total de sub-pasos para un paso principal
   * @param stepKey Clave del paso principal
   * @returns Número total de sub-pasos
   */
  const getTotalSubSteps = (stepKey: string): number => {
    return getSubSteps(stepKey).length
  }

  /**
   * Obtiene el sub-paso actual para un paso principal
   * @param stepKey Clave del paso principal
   * @returns El sub-paso actual o null si no hay sub-pasos
   */
  const getCurrentSubStep = (stepKey: string): SubStep | null => {
    const subSteps = getSubSteps(stepKey)
    return subSteps[currentSubStepIndex.value] || null
  }
  
  // Computed para verificar si el paso actual tiene sub-pasos
  const hasSubStepsForCurrentStep = computed(() => {
    return hasSubSteps(currentStepKey.value)
  })
  
  // Computed para obtener el sub-paso actual
  const currentSubStep = computed(() => {
    return getCurrentSubStep(currentStepKey.value)
  })
  
  // Computed para obtener el componente del sub-paso actual
  const currentSubStepComponent = computed(() => {
    if (!currentSubStep.value) {
      return null
    }
    return currentSubStep.value.component
  })
  
  // Computed para obtener el número total de sub-pasos para el paso actual
  const totalSubStepsForCurrentStep = computed(() => {
    return getTotalSubSteps(currentStepKey.value)
  })
  
  // Computed para verificar si estamos en el último paso y sub-paso
  const isLastStepAndSubStep = computed(() => {
    return (
      currentStep.value === steps.value.length - 1 && 
      currentSubStepIndex.value === totalSubStepsForCurrentStep.value - 1
    )
  })
  
  // ---- FUNCIONES DE NAVEGACIÓN UNIFICADAS ----
  
  /**
   * Avanza al siguiente paso o sub-paso
   * Si el paso actual tiene sub-pasos, avanza al siguiente sub-paso
   * Si se completan todos los sub-pasos, avanza al siguiente paso principal
   * @returns true si se ha completado el wizard, false en caso contrario
   */
  const next = (): boolean => {
    // Si el paso actual tiene sub-pasos
    if (hasSubStepsForCurrentStep.value) {
      // Intentamos avanzar al siguiente sub-paso
      const completed = nextSubStep(currentStepKey.value)
      
      // Si hemos completado todos los sub-pasos, avanzamos al siguiente paso principal
      if (completed) {
        // Si estamos en el último paso, hemos completado el wizard
        if (currentStep.value === steps.value.length - 1) {
          return true // Wizard completado
        }
        
        nextStep()
      }
      
      return false // Wizard no completado
    }
    
    // Para pasos sin sub-pasos, comportamiento normal
    // Si estamos en el último paso, hemos completado el wizard
    if (currentStep.value === steps.value.length - 1) {
      return true // Wizard completado
    }
    
    nextStep()
    return false // Wizard no completado
  }
  
  /**
   * Retrocede al paso o sub-paso anterior
   * Si el paso actual tiene sub-pasos, retrocede al sub-paso anterior
   * Si estamos en el primer sub-paso, retrocede al paso principal anterior
   * @returns true si se ha retrocedido al paso anterior, false si estamos en el primer paso
   */
  const previous = (): boolean => {
    // Si el paso actual tiene sub-pasos
    if (hasSubStepsForCurrentStep.value) {
      // Intentamos retroceder al sub-paso anterior
      const goToPrevStep = prevSubStep(currentStepKey.value)
      
      // Si estamos en el primer sub-paso, retrocedemos al paso principal anterior
      if (goToPrevStep) {
        // Si estamos en el primer paso, no podemos retroceder más
        if (currentStep.value === 0) {
          return false // No podemos retroceder más
        }
        
        prevStep()
      }
      
      return true // Hemos retrocedido
    }
    
    // Para pasos sin sub-pasos, comportamiento normal
    // Si estamos en el primer paso, no podemos retroceder más
    if (currentStep.value === 0) {
      return false // No podemos retroceder más
    }
    
    prevStep()
    return true // Hemos retrocedido
  }
  
  // ---- FUNCIONES DE NAVEGACIÓN DE PASOS PRINCIPALES ----
  
  /**
   * Avanza al siguiente paso principal
   * Resetea el índice del sub-paso
   */
  const nextStep = () => {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
      resetSubStep() // Resetear el índice del sub-paso al cambiar de paso
    }
  }

  /**
   * Retrocede al paso principal anterior
   * Resetea el índice del sub-paso
   */
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
      resetSubStep() // Resetear el índice del sub-paso al cambiar de paso
    }
  }

  /**
   * Va a un paso principal específico
   * Resetea el índice del sub-paso
   * @param index Índice del paso al que se quiere ir
   */
  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.value.length) {
      currentStep.value = index
      resetSubStep() // Resetear el índice del sub-paso al cambiar de paso
    }
  }
  
  // ---- FUNCIONES DE NAVEGACIÓN DE SUB-PASOS ----
  
  /**
   * Avanza al siguiente sub-paso
   * @param stepKey Clave del paso principal
   * @returns true si se han completado todos los sub-pasos, false en caso contrario
   */
  const nextSubStep = (stepKey: string): boolean => {
    const totalSubSteps = getTotalSubSteps(stepKey)

    // Si hay más sub-pasos, avanzamos al siguiente
    if (currentSubStepIndex.value < totalSubSteps - 1) {
      currentSubStepIndex.value++
      return false // No hemos terminado todos los sub-pasos
    }

    // Hemos terminado todos los sub-pasos, resetear y continuar
    currentSubStepIndex.value = 0
    return true // Indica que hemos completado todos los sub-pasos
  }

  /**
   * Retrocede al sub-paso anterior
   * @param stepKey Clave del paso principal
   * @returns true si se debe ir al paso principal anterior, false en caso contrario
   */
  const prevSubStep = (stepKey: string): boolean => {
    // Si no estamos en el primer sub-paso, retrocedemos
    if (currentSubStepIndex.value > 0) {
      currentSubStepIndex.value--
      return false // No necesitamos ir al paso principal anterior
    }

    // Estamos en el primer sub-paso, debemos ir al paso principal anterior
    return true // Indica que debemos ir al paso principal anterior
  }

  /**
   * Resetea el índice del sub-paso a 0
   */
  const resetSubStep = () => {
    currentSubStepIndex.value = 0
  }
  
  /**
   * Inserta un nuevo sub-paso en una posición específica
   * @param stepKey Clave del paso principal
   * @param position Posición donde insertar el sub-paso
   * @param subStep Sub-paso a insertar
   * @returns true si se ha insertado correctamente, false en caso contrario
   */
  const insertSubStep = (stepKey: string, position: number, subStep: SubStep): boolean => {
    // Verificamos que exista la clave en la configuración
    if (!subStepsConfig[stepKey]) {
      console.error(`No existe el paso principal con clave ${stepKey}`)
      return false
    }

    // Verificamos que el componente del sub-paso no sea null
    if (!subStep.component) {
      console.error("El componente del sub-paso no puede ser null")
      return false
    }

    // Verificamos si la posición es válida
    if (position < 0 || position > subStepsConfig[stepKey].length) {
      console.error(`Posición inválida: ${position}`)
      return false
    }

    // Insertamos el sub-paso en la posición especificada
    subStepsConfig[stepKey].splice(position, 0, subStep)

    console.log(`Sub-paso "${subStep.title}" insertado en posición ${position} en el paso ${stepKey}`)
    return true
  }

  return {
    // Estado
    currentStep,
    currentSubStepIndex,
    steps,
    currentStepKey,
    
    // Computed properties
    hasSubStepsForCurrentStep,
    currentSubStep,
    currentSubStepComponent,
    totalSubStepsForCurrentStep,
    isLastStepAndSubStep,
    
    // Funciones de navegación unificadas
    next,
    previous,
    
    // Funciones de navegación de pasos principales
    nextStep,
    prevStep,
    goToStep,
    
    // Funciones de navegación de sub-pasos
    hasSubSteps,
    getSubSteps,
    getTotalSubSteps,
    getCurrentSubStep,
    nextSubStep,
    prevSubStep,
    resetSubStep,
    insertSubStep,
  }
}