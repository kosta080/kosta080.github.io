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

  const [slider1, setSlider1] = useState(5);
  const [slider2, setSlider2] = useState(5);
  const [slider3, setSlider3] = useState(5);
  const [slider4, setSlider4] = useState(5);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper function to calculate hue based on slider value (0-10)
  // 0 = Red (0°), 5 = Orange (30°), 10 = Green (120°)
  const getSliderHue = (value) => {
    // Interpolate from red (0°) to orange (30°) to green (120°)
    if (value <= 5) {
      // Red to Orange: 0° to 30°
      return (value / 5) * 30;
    } else {
      // Orange to Green: 30° to 120°
      return 30 + ((value - 5) / 5) * 90;
    }
  };

  // Helper function to get slider style with dynamic hue
  const getSliderStyle = (value) => {
    const hue = getSliderHue(value);
    return {
      '--slider-hue': `${hue}`
    };
  };

  // Fetch initial counter and slider values
  useEffect(() => {
    fetchCounter();
    fetchSliderValues();
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

  // Function to fetch slider values from database
  const fetchSliderValues = async () => {
    try {
      // Fetch val0, val1, val3, and val4 from the counters table
      const [val0Result, val1Result, val3Result, val4Result] = await Promise.all([
        supabase
          .from('counters')
          .select('value')
          .eq('namespace', COUNTER_CONFIG.namespace)
          .eq('key', 'val0')
          .single(),
        supabase
          .from('counters')
          .select('value')
          .eq('namespace', COUNTER_CONFIG.namespace)
          .eq('key', 'val1')
          .single(),
        supabase
          .from('counters')
          .select('value')
          .eq('namespace', COUNTER_CONFIG.namespace)
          .eq('key', 'val3')
          .single(),
        supabase
          .from('counters')
          .select('value')
          .eq('namespace', COUNTER_CONFIG.namespace)
          .eq('key', 'val4')
          .single()
      ]);

      // Update slider values if data exists, otherwise keep defaults
      if (val0Result.data && !val0Result.error) {
        setSlider1(val0Result.data.value);
      }
      if (val1Result.data && !val1Result.error) {
        setSlider2(val1Result.data.value);
      }
      if (val3Result.data && !val3Result.error) {
        setSlider3(val3Result.data.value);
      }
      if (val4Result.data && !val4Result.error) {
        setSlider4(val4Result.data.value);
      }
    } catch (err) {
      console.error('Error fetching slider values:', err);
      // Keep default values if fetch fails
    }
  };

  // Function to save slider values to database
  const saveSliderValues = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      
      // Option 1: Use the set_counter function (more secure)
      // Uncomment this after creating the set_counter function in Supabase
      /*
      const updates = [
        supabase.rpc('set_counter', {
          ns: COUNTER_CONFIG.namespace,
          k: 'val0',
          v: slider1
        }),
        supabase.rpc('set_counter', {
          ns: COUNTER_CONFIG.namespace,
          k: 'val1',
          v: slider2
        })
      ];
      */

      // Option 2: Use direct upsert (requires table permissions)
      const updates = [
        supabase.from('counters').upsert({ namespace: COUNTER_CONFIG.namespace, key: 'val0', value: slider1 }),
        supabase.from('counters').upsert({ namespace: COUNTER_CONFIG.namespace, key: 'val1', value: slider2 }),
        supabase.from('counters').upsert({ namespace: COUNTER_CONFIG.namespace, key: 'val3', value: slider3 }),
        supabase.from('counters').upsert({ namespace: COUNTER_CONFIG.namespace, key: 'val4', value: slider4 }),
      ];

      const results = await Promise.all(updates);
      
      // Check for errors in any of the updates
      const hasError = results.some(result => result.error);
      if (hasError) {
        console.error('Error saving slider values:', results);
        setSaveError('Failed to save slider values');
      } else {
        console.log('Slider values saved successfully');
        // Show success message briefly
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error:', err);
      setSaveError('Failed to save slider values');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Counter App</h1>
        <div className="counter-container">
          <p className="counter-value">Count: {count}</p>
          <button onClick={incrementCounter} disabled={loading} className="increment-btn" >
            {loading ? 'Incrementing...' : 'Increment'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="sliders-container">
                      <div className="slider-group">
             <label htmlFor="slider1">⚡ Энергия {slider1}</label>
             <input id="slider1" type="range" min="0" max="10" value={slider1} onChange={(e) => setSlider1(parseInt(e.target.value))} className="slider" style={getSliderStyle(slider1)} />
            </div>
            
            <div className="slider-group">
             <label htmlFor="slider2">💚 Самочувствие / здоровье {slider2}</label>
             <input id="slider2" type="range" min="0" max="10" value={slider2} onChange={(e) => setSlider2(parseInt(e.target.value))} className="slider" style={getSliderStyle(slider2)} />
           </div>

           <div className="slider-group">
             <label htmlFor="slider3">😴 Качество сна {slider3}</label>
             <input id="slider3" type="range" min="0" max="10" value={slider3} onChange={(e) => setSlider3(parseInt(e.target.value))} className="slider" style={getSliderStyle(slider3)} />
           </div>

           <div className="slider-group">
             <label htmlFor="slider4">💕 Половое влечение {slider4}</label>
             <input id="slider4" type="range" min="0" max="10" value={slider4} onChange={(e) => setSlider4(parseInt(e.target.value))} className="slider" style={getSliderStyle(slider4)} />
           </div>

          
        </div>
        
        <div className="save-container">
          <button onClick={saveSliderValues} disabled={saving} className="save-btn" >
            {saving ? 'Saving...' : 'Save Slider Values'}
          </button>
          <div className="save-message-container">
            {saveError && <p className="save-error-message">{saveError}</p>}
            {saveSuccess && <p className="save-success-message">Slider values saved successfully!</p>}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;