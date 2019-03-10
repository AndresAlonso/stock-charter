import React, { useState } from 'react'
import { SymbolHistoryRequest } from '../types'

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

export const SearchControls = ({
  clearFormErrors,
  error,
  historySearch,
  loading,
}: any) => {
  const [ticker, setTicker] = useState('')
  return (
    <form
      onSubmit={e => searchSubmit(e, historySearch, ticker, setTicker)}
      className="SP__controls"
    >
      <div className="SP__inputs__error">{error}</div>
      <section className="SP__inputs__searchBar">
        <input
          className={`SP__inputs__textInput${
            error ? ' SP__inputs__textInput__error' : ''
          }`}
          type="text"
          placeholder="Enter Symbol..."
          value={ticker}
          onChange={e => {
            setTicker(e.target.value)
            if (error) clearFormErrors()
          }}
        />
        <input
          type="submit"
          value={loading ? 'Seaching' : 'Search'}
          disabled={loading}
        />
      </section>
    </form>
  )
}
