export interface Action {
  type: string
  payload?: any
  error?: string
}

export interface SymbolHistoryRequest {
  symbol: string
}

export interface SearchPanelData {
  symbol: string
  historicalData: any
  loading: boolean
  error?: string | null
  historySearch: (requestOptions: SymbolHistoryRequest) => void
  clearFormErrors: () => void
}

export interface DailyStockPriceDetails {
  symbol: string
  timestamp: string
  tradingDay: string
  open: number
  low: number
  close: number
  volume: number
  openInterest: number | null
}

export interface StockHistoryResponse {
  status: { code: number; message: string }
  results: DailyStockPriceDetails[] | null
}
