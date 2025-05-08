import { computed } from 'vue'
import { useWizardStore } from '@/stores/wizardStore'

export function useWizardValidation() {
  // Obtenemos la instancia del store
  const wizardStore = useWizardStore()

  // Verifica si el botón "Anterior" debe estar deshabilitado
  const shouldDisablePreviousButton = computed(() => {
    // Obtener el estado actual del wizard
    const wizardState = wizardStore.getCurrentWizardState
    const currentStepKey = wizardState.currentStep
    const currentSubStep = wizardState.currentSubStep

    // Deshabilitar si estamos en el primer paso y primer subpaso
    if (
      (currentStepKey === 'data-sales' && currentSubStep === 1) || 
      currentStepKey === 'personal-info'
    ) {
      return true
    }

    return false
  })

  // Verifica si el botón "Siguiente" debe estar deshabilitado
  const shouldDisableNextButton = computed(() => {
    // Obtener el estado actual del wizard
    const wizardState = wizardStore.getCurrentWizardState
    const currentStepKey = wizardState.currentStep
    const currentSubStep = wizardState.currentSubStep

    // Validaciones específicas por paso y subpaso
    switch (currentStepKey) {
      case 'data-sales':
        return validateDataSalesStep(currentSubStep)
      
      case 'personal-info':
        return validatePersonalInfoStep()
      
      case 'config-company':
        return validateConfigCompanyStep(currentSubStep)
      
      case 'create-company':
        return validateCreateCompanyStep(currentSubStep)
      
      default:
        return false
    }
  })

  /**
   * Valida el paso de datos de venta según el subpaso
   */
  const validateDataSalesStep = (subStep: number): boolean => {
    // Obtener los datos relevantes del store
    const salesData = wizardStore.getStepData('salesData')
    const consultantData = wizardStore.getStepData('consultant')

    // Subpaso 1 (indexConfigCompanySS1) - Validación de RUC
    if (subStep === 1) {
      return !wizardStore.getCurrentWizardState.rucValidated
    }
    
    // Subpaso 2 (indexSalesDataSS1) - Selección de plan
    if (subStep === 2) {
      return !salesData?.plan || !salesData?.billingFrequency
    }
    
    // Subpaso 3 (indexSalesDataSS2) - Datos de pago
    if (subStep === 3) {
      // 1. Verificar si se ha seleccionado un vendedor
      const hasSelectedSeller = consultantData?.sellerId ? true : false
      
      // 2. Verificar si se ha seleccionado un método de pago
      const hasSelectedPaymentMethod = salesData?.paymentMethod ? true : false
      
      // Si no hay método de pago seleccionado, el botón debe estar deshabilitado
      if (!hasSelectedPaymentMethod) {
        return true
      }

      // 3. Verificar campos comunes de pago
      const paymentData = salesData?.payment || {}
      const hasAmount = paymentData.amount > 0
      const hasDate = !!paymentData.date

      if (!hasAmount || !hasDate || !hasSelectedSeller) {
        return true
      }
      
      // 4. Verificar campos específicos según el método de pago
      const paymentMethod = salesData?.paymentMethod
      
      if (paymentMethod === 'transferencia') {
        const transferData = paymentData.transferData || {}
        return !transferData.financialInstitution || !transferData.proofPayment
      } 
      else if (paymentMethod === 'datafast-voucher') {
        const datafastData = paymentData.datafastData || {}
        return !datafastData.typeCard || !datafastData.numberLote
      }
      
      return true // Por defecto, deshabilitar para métodos de pago no reconocidos
    }

    return false // Para otros subpasos no definidos
  }
  

  /**
   * Valida el paso de información personal
   */
  const validatePersonalInfoStep = (): boolean => {
    const createUser = wizardStore.getStepData('createUser')

    // Verificar si existe el objeto createUser
    if (!createUser) {
      return true
    }

    // Verificar campos requeridos
    return !createUser.name || !createUser.email || !createUser.rol?.name
  }

  /**
   * Valida el paso de configuración de la empresa según el subpaso
   */
  const validateConfigCompanyStep = (subStep: number): boolean => {
    // Subpaso 1 (indexConfigCompanySS1) - Validación de RUC
    if (subStep === 1) {
      return !wizardStore.getCurrentWizardState.rucValidated
    }
    
    // Subpaso 2 (indexConfiCompanySS2) - Configuraciones adicionales
    if (subStep === 2) {
      const companyConfig = wizardStore.getStepData('companyConfig')
      
      if (!companyConfig) return false
      
      // Verificar si es artesano y tiene número de artesano
      const isArtisanInvalid = companyConfig.artisan?.isArtisan === true && 
                              (!companyConfig.artisan?.artisanNumber || 
                               companyConfig.artisan?.artisanNumber.trim() === '')
      
      // Verificar si tiene impuesto del 5% y código correspondiente
      const hasFivePercentTax = companyConfig.taxes && 
                               Array.isArray(companyConfig.taxes) && 
                               companyConfig.taxes.includes('5')
      
      const isTaxesFiveInvalid = hasFivePercentTax && 
                                (!companyConfig.taxesFiveNumber || 
                                 companyConfig.taxesFiveNumber.trim() === '')
      
      return isArtisanInvalid || isTaxesFiveInvalid
    }
    
    return false
  }

  /**
   * Valida el paso de creación de la empresa según el subpaso
   */
  const validateCreateCompanyStep = (subStep: number): boolean => {
    // Subpaso 1 (indexCreateCompanySS1) - Datos básicos de la empresa
    if (subStep === 1) {
      const companyCreation = wizardStore.getStepData('companyCreation')
      const branchAndPOS = wizardStore.getStepData('branchAndPOS')

      // Verificar si los datos existen
      if (!companyCreation || !branchAndPOS) {
        return true
      }

      // Verificar datos de la matriz
      const hasBranchData = branchAndPOS.branch && 
                           branchAndPOS.branch.commercialName && 
                           branchAndPOS.branch.name && 
                           branchAndPOS.branch.address && 
                           branchAndPOS.branch.phone && 
                           branchAndPOS.branch.email

      // Verificar datos del punto de emisión
      const hasPOSData = branchAndPOS.pointOfSale && 
                        branchAndPOS.pointOfSale.idPos && 
                        branchAndPOS.pointOfSale.name

      return !(hasBranchData && hasPOSData)
    }
    
    // Subpaso 2 (indexCreateCompanySS2) - Logo de la empresa
    // No hay validaciones obligatorias para el logo
    if (subStep === 2) {
      return false
    }
    
    return false
  }

  return {
    shouldDisablePreviousButton,
    shouldDisableNextButton
  }
}