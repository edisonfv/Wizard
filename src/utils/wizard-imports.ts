import { markRaw, defineAsyncComponent } from "vue"
import type { Component } from "vue"

// Función para importar y marcar como raw todos los componentes comunes
export function getWizardComponents(): Record<string, Component> {
  // Componentes comunes
  const indexCreateCompanySS1 = markRaw(
    defineAsyncComponent(() => import("@/components/common/steps/createCompany/sub-step1/indexCreateCompanySS1.vue")),
  )

  const indexSalesDataSS1 = markRaw(
    defineAsyncComponent(() => import("@/components/common/steps/dataSales/sub-step1/indexSalesDataSS1.vue")),
  )


  const indexCreateCompanySS2 = markRaw(
    defineAsyncComponent(() => import("@/components/common/steps/createCompany/sub-step2/indexCreateCompanySS2.vue")),
  )

  const indexConfiCompanySS2 = markRaw(
    defineAsyncComponent(
      () => import("@/components/common/steps/configurationCompany/sub-step2/indexConfiCompanySS2.vue"),
    ),
  )

  const indexConfigCompanySS1 = markRaw(
    defineAsyncComponent(
      () => import("@/components/common/steps/configurationCompany/sub-step1/indexConfigCompanySS1.vue"),
    ),
  )

  const indexSalesDataSS2 = markRaw(
    defineAsyncComponent(() => import("@/components/common/steps/dataSales/sub-step2/indexSalesDataSS2.vue")),
  )

  // Devolvemos todos los componentes en un objeto
  return {
    indexCreateCompanySS1,
    indexSalesDataSS1,
    indexCreateCompanySS2,
    indexConfiCompanySS2,
    indexConfigCompanySS1,
    indexSalesDataSS2,
  }
}

// Función para obtener la configuración base de sub-pasos común a todos los wizards
export function getBaseSubStepsConfig() {
  const components = getWizardComponents()

  return {
    "create-company": [
      { title: "create-company SS1", component: components.indexCreateCompanySS1 },
      { title: "create-company SS2", component: components.indexCreateCompanySS2 },
    ],
    "config-company": [
      // Eliminamos indexConfigCompanySS1 de aquí
      { title: "config-comapny SS2", component: components.indexConfiCompanySS2 },
    ],
  }
}

// Función para obtener la configuración de sub-pasos para el wizard de ventas
export function getVentasSubStepsConfig() {
  const baseConfig = getBaseSubStepsConfig()
  const components = getWizardComponents()

  return {
    ...baseConfig,
    "data-sales": [
      // Añadimos indexConfigCompanySS1 como primer substep en data-sales
      { title: "data-sales SS1", component: components.indexConfigCompanySS1 },
      // Movemos los substeps originales después
      { title: "data-sales SS2", component: components.indexSalesDataSS1 },
      { title: "data-sales SS3", component: components.indexSalesDataSS2 },
    ],
  }
}

// Función para obtener la configuración de sub-pasos para el wizard de soporte
export function getSoporteSubStepsConfig() {
  return getBaseSubStepsConfig()
}

// Función para obtener la configuración de sub-pasos para el wizard de cliente
export function getClienteSubStepsConfig() {
  return getBaseSubStepsConfig()
}

// Función para obtener la configuración de sub-pasos según el tipo de wizard
export function getSubStepsConfigByType(type: string) {
  switch (type) {
    case "sales":
      return getVentasSubStepsConfig()
    case "soporte":
      return getSoporteSubStepsConfig()
    case "cliente":
      return getClienteSubStepsConfig()
    default:
      return getBaseSubStepsConfig()
  }
}