import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, COUNTER_CONFIG } from './config';
import './App.css';

// Create Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial counter value
  useEffect(() => {
    fetchCounter();
  }, []);

  // Function to get counter value using the get_counter function
  const fetchCounter = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_counter', {
        ns: COUNTER_CONFIG.namespace,
        k: COUNTER_CONFIG.key
      });

      if (error) {
        console.error('Error fetching counter:', error);
        setError('Failed to fetch counter value');
      } else {
        setCount(data || 0);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch counter value');
    } finally {
      setLoading(false);
    }
  };

  // Function to increment counter using the increment_counter function
  const incrementCounter = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('increment_counter', {
        ns: COUNTER_CONFIG.namespace,
        k: COUNTER_CONFIG.key
      });

      if (error) {
        console.error('Error incrementing counter:', error);
        setError('Failed to increment counter');
      } else {
        setCount(data || 0);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to increment counter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Counter App</h1>
        <div className="counter-container">
          <p className="counter-value">Count: {count}</p>
          <button 
            onClick={incrementCounter}
            disabled={loading}
            className="increment-btn"
          >
            {loading ? 'Incrementing...' : 'Increment'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;