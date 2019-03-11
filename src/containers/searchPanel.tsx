import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  fetchHistorical,
  removeSearchError,
} from '../redux/modules/stockSearch'
import { SymbolHistoryRequest, SearchPanelData } from '../types'
import { DailyChart } from '../components/DailyChart'
import { SearchControls } from '../components/SearchControls'

const searchSubmit = (
  e: any,
  historySearch: (requestOptions: SymbolHistoryRequest) => void,
  ticker: string,
  setTicker: (ticker: string) => void,
) => {
  e.preventDefault()
  setTicker('')
  historySearch({ symbol: ticker })
}

const SearchPanel = (props: SearchPanelData) => {
  const {
    clearFormErrors,
    historicalData,
    historySearch,
    loading,
    error,
    symbol,
  } = props

  return (
    <div className="SearchPanel">
      <SearchControls
        clearFormErrors={clearFormErrors}
        error={error}
        historySearch={historySearch}
        loading={loading}
        symbol={symbol}
      />
      {historicalData && <DailyChart symbol={symbol} data={historicalData} />}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  const {
    stockSearchPanel: {
      currentSearch: { symbol, historicalData },
      loading,
      error,
    },
  } = state
  return { error, historicalData, loading, symbol }
}

const mapDispatchToProps = (dispatch: any) => ({
  historySearch: (requestOptions: SymbolHistoryRequest) =>
    dispatch(fetchHistorical(requestOptions)),
  clearFormErrors: () => dispatch(removeSearchError()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPanel)
