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
      id: "",
      name: "",
      phone: "",
      email: "",
      
    },
    billingData: {
      documentType: "cedula",
      documentNumber: "",
      name:"",
      phone:"",
      email: "",
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
      status: "", // Nuevo campo
      regimeRUC: "", // Nuevo campo
      isAgent: false, // Nuevo campo
      accountingRequired: false, // Nuevo campo
      categoryRUC: "", // Nuevo campo
      branches: [], // Nuevo campo: array de sucursales
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
          numberLote: ""
        },
        datafastData: {
          typeCard: "",
          proofPayment: "",
          numberLote: ""
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
