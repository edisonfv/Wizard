import type { WizardInterface } from "@/types/wizardTypes"

// Estado inicial del wizard
export const initialState = (): WizardInterface => ({
  wizardState: {
    type: "",
    currentStep: "",
    currentSubStep: 0,
  },
  formData: {
    createUser: {
      name: "",
      email: "",
      base64: "",
      rol: {
        id: "9de79ed8-b4f0-48bb-ab5d-6caca8a454ed",
        name: "Administrador",
        is_main: true,
        description: null
      }
    },
    consultant: {
      sellerId: "",
      sellerName: "",
    },
    companyCreation: {
      ruc: "",
      legalName: "",
      domain: "",
      address: "",
      phone: "",
      businessEmail: "",
    },
    salesData: {
      // Datos generales de la venta
      plan: "",
      billingFrequency: "",
      paymentMethod: "",
      
      // Datos comunes a todos los métodos de pago
      payment: {
        amount: 0,
        date: "",
        
        // Datos específicos por método de pago
        transferData: {
          financialInstitution: "",
          proofPayment: "",
        },
        datafastData: {
          typeCard: "",
          numberLote: "",
        }
      }
    },
    companyConfig: {
      defaultDocument:"",
      searchParameter: "",
      regimeRUC: "",
      categoryRUC: "",
      taxAgent: {
        isAgent: false,
        accountingRequired: false,
      },
      artisan: {
        isArtisan: false,
        artisanNumber: "",
      },
      taxes: [],
      taxesFiveNumber: "",
    },
    branchAndPOS: {
      branch: {
        idBranch: "",
        name: "",
        commercialName: "",
        address: "",
        phone: "",
        email: "",
        isTouristEstablishment: false,
        delayedDispatch: false,
        logo: {
          url: "",
          fileName: "",
        },
      },
      pointOfSale: {
        idPos: "",
        name: "",
      },
    },
  },
})
