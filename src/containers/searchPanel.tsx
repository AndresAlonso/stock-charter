import React, { useState } from 'react'
import { connect } from 'react-redux'
import { fetchHistorical } from '../redux/modules/stockSearch'
import { SymbolHistoryRequest, SearchPanelData } from '../types'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

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
  const [ticker, setTicker] = useState('')
  const { historicalData, historySearch, loading } = props
  const { results: searchResults } = historicalData

  return (
    <div className="SearchPanel">
      <form
        onSubmit={e => searchSubmit(e, historySearch, ticker, setTicker)}
        className="SearchPanel__inputs"
      >
        <input
          className="SearchPanel__textInput"
          type="text"
          placeholder="Enter Symbol..."
          value={ticker}
          onChange={e => setTicker(e.target.value)}
        />
        <input
          className="SearchPanel__submit"
          type="submit"
          value={loading ? 'Seaching' : 'Search'}
          disabled={loading}
        />
      </form>
      {searchResults && (
        <div>
          <div className="SearchPanel__chartLabel">{`${
            searchResults[0].symbol
          }`}</div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart className="SearchPanel__chart" data={searchResults}>
              <Line type="monotone" dataKey="close" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="tradingDay" />
              <YAxis domain={['dataMin - 5', 'dataMax - 5']} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  const {
    stockSearchPanel: {
      currentSearch: { symbol, historicalData },
      loading,
    },
  } = state
  return { symbol, historicalData, loading }
}

const mapDispatchToProps = (dispatch: any) => ({
  historySearch: (requestOptions: SymbolHistoryRequest) =>
    dispatch(fetchHistorical(requestOptions)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPanel)
