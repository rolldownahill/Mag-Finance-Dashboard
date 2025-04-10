import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './App.css';
import { useStocks } from './stockContext'; // Custom context hook

function App() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const { stocks, addStock, removeStock } = useStocks();

  const isMobile = useMediaQuery('(max-width:600px)');
  const API_KEY = 'your_real_api_key_here'; // Replace with your actual API key

  const fetchStockPrice = useCallback(async (symbol) => {
    try {
      if (symbol.toUpperCase() === 'IBM') {
        const res = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = await res.json();
        const price = data['Global Quote']?.['05. price'];
        return price ? Number(price) : 69;
      }
      return 69; // Fallback price for all other symbols
    } catch (err) {
      console.error('API fetch failed:', err);
      return 69;
    }
  }, [API_KEY]);

  useEffect(() => {
    console.log('📈 Stocks updated:', stocks);
  }, [stocks]);

  const handleAddStock = async () => {
    if (!stockSymbol || !quantity || !purchasePrice) {
      alert('Please fill in all fields!');
      return;
    }

    const symbolUpper = stockSymbol.toUpperCase();
    const alreadyExists = stocks.some(stock => stock.stockSymbol === symbolUpper);

    if (alreadyExists) {
      alert(`${symbolUpper} is already in your list!`);
      return;
    }

    const currentPrice = await fetchStockPrice(symbolUpper);

    const newStock = {
      stockSymbol: symbolUpper,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      currentPrice,
    };

    addStock(newStock);
    setStockSymbol('');
    setQuantity('');
    setPurchasePrice('');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
            padding: '20px 10px',
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
          Welcome, Pepe
        </Typography>
        <div className="profile-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="https://pbs.twimg.com/media/Fa2VAd0akAMUBZ0?format=png&name=medium"
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <List>
          {['Home', 'Account', 'Dashboard'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="content">
        {/* Banner */}
        <div className="welcome-banner">
          <img
            src="https://hips.hearstapps.com/hmg-prod/images/maxresdefault-1588953454.jpg?crop=0.889xw:1.00xh;0.0901xw,0&resize=1200:*"
            alt="Welcome Banner"
            className="banner-img"
          />
        </div>

        <div className="header">
          <h1>Finance Dashboard</h1>
        </div>

        <Stack
          className="interactiveFields"
          direction={isMobile ? 'column' : 'row'}
          spacing={1} // Reduced spacing
          alignItems="center"
          justifyContent="flex-start"
          sx={{ flexWrap: 'wrap', marginBottom: '20px' }}
        >
          <TextField
            label="Stock Symbol"
            variant="outlined"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            size="small"
          />
          <TextField
            label="Quantity"
            type="number"
            inputProps={{ min: 0 }}
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            size="small"
          />
          <TextField
            label="Purchase Price"
            type="number"
            inputProps={{ min: 0 }}
            variant="outlined"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddStock}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Stock
          </Button>
        </Stack>

        <div className="stockList">
          <h1>Stock List</h1>
          <div className="stock-scroll">
            {stocks.length === 0 ? (
              <p>No stocks added yet.</p>
            ) : (
              stocks.map((stock, index) => {
                const profitLoss =
                  (Number(stock.currentPrice) - Number(stock.purchasePrice)) *
                  Number(stock.quantity);
                return (
                  <Card key={index} sx={{ maxWidth: 400, margin: '10px 0' }}>
                    <CardContent>
                      <Typography variant="body1">
                        <strong>Symbol:</strong> {stock.stockSymbol}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Quantity:</strong> {stock.quantity}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Purchase Price:</strong> ${stock.purchasePrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Current Price:</strong> ${stock.currentPrice.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'bold',
                          color: profitLoss >= 0 ? 'green' : 'red',
                        }}
                      >
                        <strong>Profit/Loss:</strong> {profitLoss >= 0 ? '+' : '-'}
                        ${Math.abs(profitLoss).toFixed(2)}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeStock(stock.stockSymbol)}
                        sx={{ marginTop: '10px' }}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



