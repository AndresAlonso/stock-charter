import { mergeMap, map, catchError } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { Action, SymbolHistoryRequest } from '../../types'
import { API_KEY } from '../../configuration'

// Global constants
const BASE_HISTORY_URL =
  'https://marketdata.websol.barchart.com/getHistory.json'

// action types
const FETCH_HISTORICAL = 'FETCH_HISTORICAL'
const FETCH_HISTORICAL_FULFILLED = 'FETCH_HISTORICAL_FULFILLED'
const FETCH_HISTORICAL_REJECTED = 'FETCH_HISTORICAL_REJECTED'

// action creators
export const fetchHistorical = (
  historyRequestOptions: SymbolHistoryRequest,
) => ({
  type: FETCH_HISTORICAL,
  payload: historyRequestOptions,
})

const fetchHistoricalFulfilled = (historyResponse: any) => ({
  type: FETCH_HISTORICAL_FULFILLED,
  payload: historyResponse,
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
        map((historyResponse: any) =>
          fetchHistoricalFulfilled({
            symbol: payload,
            historicalData: historyResponse.response,
          }),
        ),
        catchError((error: any) =>
          of({
            type: FETCH_HISTORICAL_REJECTED,
            payload: error.xhr.response,
            error: true,
          }),
        ),
      ),
    ),
  )

const initialState = {
  loading: false,
  currentSearch: { symbol: '', historicalData: {} },
  searchHistory: [],
}

export default (state: any = initialState, action: Action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_HISTORICAL:
      return { ...state, loading: true }
    case FETCH_HISTORICAL_FULFILLED:
      return { ...state, currentSearch: payload, loading: false }
    case FETCH_HISTORICAL_REJECTED:
      return { ...state, loading: false }
    default:
      return state
  }
}
