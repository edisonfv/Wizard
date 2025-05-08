// Interfaces para el estado del wizard
export interface WizardState {
  type: string
  currentStep: string
  currentSubStep: number
  rucValidated?: boolean // Nueva propiedad para controlar la validación del RUC
}

// Interfaces para la información personal
export interface createUser {
  name: string
  email: string
  base64: string
  rol:{
    id: string
    name: string
    is_main: boolean
    description: null
  }
}

// Interfaces para el consultor/vendedor
export interface Consultant {
  sellerId: string
  sellerName: string
}

// Interfaces para la creación de la empresa
export interface CompanyCreation {
  ruc: string
  legalName: string
  domain: string
  address: string
  phone: string
  businessEmail: string
}

// Interfaces para datos de venta
export interface SalesData {
  plan: string,
  billingFrequency: string,
  paymentMethod: string,
  
  // Datos comunes a todos los métodos de pago
  payment: {
    amount: number,
    date: string,
    
    // Datos específicos por método de pago
    transferData: {
      financialInstitution: string,
      proofPayment: string,
    },
    datafastData: {
      typeCard: string,
      numberLote: string,
    }
  }
}

// Interfaces para configuración de la empresa
export interface CompanyConfig {
  defaultDocument: string
  searchParameter: string
  regimeRUC: string
  categoryRUC: string
  taxAgent: {
    isAgent: boolean
    accountingRequired: boolean
  }
  artisan: {
    isArtisan: boolean
    artisanNumber: string
  }
  taxes: string[]
  taxesFiveNumber: string
}

// Interfaces para sucursal y punto de venta
export interface BranchAndPOS {
  branch: {
    idBranch: string
    name: string
    commercialName: string
    address: string
    phone: string
    email: string
    isTouristEstablishment: boolean
    delayedDispatch: boolean
    logo: {
      url: string
      fileName: string
    }
  }
  pointOfSale: {
    idPos: string
    name: string
  }
}

// Interfaz para los datos del formulario
export interface FormData {
  createUser: createUser
  consultant: Consultant
  companyCreation: CompanyCreation
  salesData: SalesData
  companyConfig: CompanyConfig
  branchAndPOS: BranchAndPOS
  [key: string]: any // Índice de firma para permitir acceso dinámico
}

// Interfaz principal del wizard
export interface WizardInterface {
  wizardState: WizardState
  formData: FormData
}