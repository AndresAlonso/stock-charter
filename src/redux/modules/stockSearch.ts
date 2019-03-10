import { mergeMap, map, catchError } from 'rxjs/operators'
import { ajax, AjaxResponse } from 'rxjs/ajax'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import {
  Action,
  DailyStockPriceDetails,
  SymbolHistoryRequest,
  StockHistoryResponse,
} from '../../types'
import { API_KEY } from '../../configuration'

// Global constants
const BASE_HISTORY_URL =
  'https://marketdata.websol.barchart.com/getHistory.json'

// action types
const FETCH_HISTORICAL = 'FETCH_HISTORICAL'
const FETCH_HISTORICAL_FULFILLED = 'FETCH_HISTORICAL_FULFILLED'
const FETCH_HISTORICAL_REJECTED = 'FETCH_HISTORICAL_REJECTED'
const REMOVE_SEARCH_ERROR = 'REMOVE_SEARCH_ERROR'

// action creators
export const fetchHistorical = (
  historyRequestOptions: SymbolHistoryRequest,
) => ({
  type: FETCH_HISTORICAL,
  payload: historyRequestOptions,
})

export const removeSearchError = () => ({ type: REMOVE_SEARCH_ERROR })

const fetchHistoricalFulfilled = (historyResponse: any) => ({
  type: FETCH_HISTORICAL_FULFILLED,
  payload: historyResponse,
})

const fetchHistoricalRejected = (errorMessage: any) => ({
  type: FETCH_HISTORICAL_REJECTED,
  payload: errorMessage,
  error: true,
})

const formatDate = (date: Date) => {
  const padNum = (num: number) => (num < 10 ? `0${num}` : num)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${date.getFullYear()}${padNum(month)}${padNum(day)}`
}
const stockHistoryFetchUrl = (stockFetchOptions: SymbolHistoryRequest) => {
  const { symbol } = stockFetchOptions
  const date = new Date()

  const end = formatDate(date)

  date.setMonth(date.getMonth() - 1)
  const start = formatDate(date)

  const query = `apikey=${API_KEY}&symbol=${symbol}&type=daily&startDate=${start}&endDate=${end}`

  return `${BASE_HISTORY_URL}?${query}`
}

export const stockSearchEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_HISTORICAL),
    mergeMap(({ payload }) =>
      ajax({
        url: stockHistoryFetchUrl(payload),
        method: 'GET',
        timeout: 10000,
      }).pipe(
        map((ajaxResponse: AjaxResponse) => {
          const response: StockHistoryResponse = ajaxResponse.response
          const { status, results } = response
          const { code, message } = status

          return code === 200
            ? fetchHistoricalFulfilled({
                symbol: payload.symbol,
                historicalData: results,
              })
            : fetchHistoricalRejected(message)
        }),
        catchError((error: any) =>
          of(fetchHistoricalRejected(error.xhr.response)),
        ),
      ),
    ),
  )

const initialState = {
  loading: false,
  error: null,
  currentSearch: { symbol: '', historicalData: null },
}

const removeExtraneousKeys = (historicalData: DailyStockPriceDetails[]) =>
  historicalData.map(({ close, tradingDay }: DailyStockPriceDetails) => ({
    close,
    tradingDay,
  }))

export default (state: any = initialState, action: Action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_HISTORICAL:
      return { ...state, loading: true }
    case FETCH_HISTORICAL_FULFILLED:
      const { symbol, historicalData } = payload
      return {
        ...state,
        currentSearch: {
          symbol,
          historicalData: removeExtraneousKeys(historicalData),
        },
        loading: false,
      }
    case FETCH_HISTORICAL_REJECTED:
      return { ...state, loading: false, error: payload }
    case REMOVE_SEARCH_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}
