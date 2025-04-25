import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

function App() {


  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  
    if (!hasHadBirthdayThisYear) {
      age--;
    }
  
    return age;
  };


  const [data, setData] = useState([]);
  const [metric, setMetric] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/bloods_historic.csv`)
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true });
        const formatted = parsed.data.map(row => ({
          ...row,
          date: row.date,
          ...Object.fromEntries(
            Object.entries(row).filter(([key, val]) => key !== 'Date').map(([k, v]) => [k, parseFloat(v)])
          )
        }));
        setData(formatted);
      });
  }, []);

  // Get columns 4 to 10 (0-based index), skipping 'date'
  const metrics = data.length > 0
    ? Object.keys(data[0])
        .filter(key => key !== 'Date')
        .slice(2, 9) // index 3 to 9 inclusive, which corresponds to columns 4 to 10
    : [];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        🩸 Blood Test Tracker 🩸
      </h2>
      <h3 style={{ textAlign: 'center', marginBottom: '70px' }}>
        Nicolás Santos, Current Age: {calculateAge('1993-11-04')}
      </h3>

      {metrics.length > 0 && (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '100px' }}>
          <select onChange={e => setMetric(e.target.value)} value={metric}>
            <option value="">Select a test</option>
            {metrics.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

          {metric && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="Date"
                  angle={-45}
                  textAnchor="end" 
                  interval={0}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Legend />
                <Line type="monotone" dataKey={metric} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}

export default App;
