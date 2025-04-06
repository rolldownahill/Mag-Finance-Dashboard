import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Create the context
const stockContext = createContext();

// 2. Create a provider component
export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([]);

  // 3. Memoized function to add a stock
  const addStock = useCallback((stock) => {
    setStocks((prevStocks) => [...prevStocks, stock]);
  }, []);

  // 4. Memoized function to remove a stock
  const removeStock = useCallback((symbol) => {
    setStocks((prevStocks) => prevStocks.filter(stock => stock.stockSymbol !== symbol));
  }, []);

  return (
    <stockContext.Provider value={{ stocks, addStock, removeStock }}>
      {children}
    </stockContext.Provider>
  );
}

// 5. Custom hook to use context in other components
export function useStocks() {
  return useContext(stockContext);
}
