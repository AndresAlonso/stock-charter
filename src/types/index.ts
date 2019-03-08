export interface Action {
  type: string
  payload: any
  error?: string
}

export interface SymbolHistoryRequest {
  symbol: string
}

export interface SearchPanelData {
  symbol: string
  historicalData: any
  historySearch: (requestOptions: SymbolHistoryRequest) => void
  loading: boolean
}
