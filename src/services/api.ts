import axios from "axios"

// Interfaz para los vendedores
export interface Vendedor {
  id: number
  nombre: string
}

// Interfaz para los planes
export interface Plan {
  label: string
  value: string
  precioMensual: string
  precioAnual: string
  caracteristicas?: string[]
}

// Interfaz para las empresas existentes según company-exist.json
export interface CompanyExist {
  ruc: string
  legalname: string
  typePlan: string
  frequencyType: string
}

// Interfaz para los datos de RUC (search-ruc.json)
export interface BranchRuc {
  idBranch: string
  commercialName: string
  address: string
}

export interface RucData {
  ruc: string
  legalName: string
  status: string
  regimeRUC: string
  isAgent: boolean
  accountingRequired: boolean
  categoryRUC: string
  branches: BranchRuc[]
}

// Servicio simplificado con tipos
export const wizardService = {
  // Obtener lista de vendedores
  getVendedores: async (): Promise<Vendedor[]> => {
    const response = await axios.get("/wizard/sallers.json")
    return response.data.data // Retorna el array de vendedores desde la clave 'data'
  },

  // Obtener lista de planes
  getPlanes: async (): Promise<Plan[]> => {
    const response = await axios.get("/wizard/plans.json")
    return response.data
  },

  // Obtener lista de empresas existentes
  getCompanyExist: async (): Promise<CompanyExist[]> => {
    const response = await axios.get("/wizard/company-exist.json")
    return response.data.data 
  },

  // Obtener base de datos de RUCs simulados
  getRucDataBase: async (): Promise<RucData[]> => {
    const response = await axios.get("/wizard/search-ruc.json")
    return response.data.data
  },

}
