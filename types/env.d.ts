/* eslint-disable prettier/prettier */
interface ImportMetaEnv {
    readonly VITE_LOCAL_API_URL: string
    readonly VITE_TRANSACTION_LOCATION_API_URL: string
    readonly VITE_INVENTORY_API_URL: string
    readonly VITE_SUPPLIER_PRODUCT_API_URL: string
    readonly VITE_ACCOUNT_API_URL: string
    readonly VITE_REPORTS_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }