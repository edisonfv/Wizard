import type { WizardInterface } from "@/types/wizardTypes"
import { initialState } from "./state"
import { setNestedProperty, saveWizardState } from "@/utils/wizard-helpers"

export const actions = {
  /**
   * Actualiza solo una sección específica del formData
   * @param section Sección a actualizar
   * @param data Datos a actualizar
   */
  updateFormSection(this: WizardInterface, section: string, data: any) {
    if (this.formData[section]) {
      this.formData[section] = {
        ...this.formData[section],
        ...data,
      }

      // Opcional: guardar en localStorage después de cada actualización
      saveWizardState(this as unknown as Record<string, any>)
    }
  },

  /**
   * Actualiza un campo específico en cualquier nivel de profundidad
   * @param path Ruta del campo a actualizar
   * @param value Valor a establecer
   */
  updateField(this: WizardInterface, path: string, value: any) {
    setNestedProperty(this as unknown as Record<string, any>, path, value)

    // Opcional: guardar en localStorage después de cada actualización
    saveWizardState(this as unknown as Record<string, any>)
  },

  /**
   * Actualiza el estado del wizard (paso actual, etc.)
   * @param data Datos parciales del estado del wizard
   */
  updateWizardState(this: WizardInterface, data: Partial<WizardInterface["wizardState"]>) {
    this.wizardState = {
      ...this.wizardState,
      ...data,
    }

    // Opcional: guardar en localStorage después de cada actualización
    saveWizardState(this as unknown as Record<string, any>)
  },

  /**
   * Carga datos iniciales, útil para cargar desde API o localStorage
   * @param data Datos parciales del wizard
   */
  loadInitialData(this: WizardInterface, data: Partial<WizardInterface>) {
    if (data.wizardState) {
      this.wizardState = {
        ...this.wizardState,
        ...data.wizardState,
      }
    }

    if (data.formData) {
      this.formData = {
        ...this.formData,
        ...data.formData,
      }
    }
  },

  /**
   * Reinicia todo el estado a sus valores iniciales
   */
  resetState(this: WizardInterface) {
    const defaultState = initialState()
    this.wizardState = { ...defaultState.wizardState }
    this.formData = { ...defaultState.formData }

    // Opcional: limpiar localStorage
    localStorage.removeItem("wizardData")
  },

  /**
   * Limpia completamente todo el formData (sin afectar wizardState)
   */
  resetCompanyCreation(this: WizardInterface) {
    const defaultState = initialState();
    this.formData = { ...defaultState.formData };
    saveWizardState(this as unknown as Record<string, any>);
  },
}
