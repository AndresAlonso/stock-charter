import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'
import stockSearchPanel, { stockSearchEpic } from './stockSearch'

export const rootEpic = combineEpics(stockSearchEpic)

export const rootReducer = combineReducers({
  stockSearchPanel,
})
