'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!startTime || !endTime) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setFlights([]);
    
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime, endTime }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFlights(data.flights);
      } else {
        setError(data.error || 'Failed to fetch flights');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // SVG Icons
  const PlaneIcon = () => (
    <svg xmlns="http://www.000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3 3-3-1-2 1 4 4 4 4 1-2-1-3 3-3 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>What's My Standby</h1>
        <p className={styles.subtitle}>
          Enter your standby window below. We'll automatically adjust for the 1-hour check-in rule and find all eligible Air Arabia flights departing from Sharjah.
        </p>
      </div>

      <div className={`glass-panel ${styles.searchCard}`}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Standby Start Time</label>
            <input 
              type="time" 
              id="startTime" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="endTime">Standby End Time</label>
            <input 
              type="time" 
              id="endTime" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              required
            />
          </div>
        </div>

        <button 
          className={`${styles.searchButton} ${loading ? styles.searching : ''}`}
          onClick={handleSearch}
          disabled={!startTime || !endTime || loading}
        >
          {loading ? (
            <>
              <div className={styles.spinner}></div>
              Scanning Destinations...
            </>
          ) : (
            <>
              <PlaneIcon />
              Find Eligible Flights
            </>
          )}
        </button>
      </div>

      {hasSearched && !loading && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2>Available Flights</h2>
            <span className={styles.resultsCount}>{flights.length} flights found</span>
          </div>

          {error && (
            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {!error && flights.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary-dark)', padding: '40px' }} className="glass-panel">
              <PlaneIcon style={{ width: '48px', height: '48px', opacity: 0.5, marginBottom: '16px' }} />
              <h3>No flights found</h3>
              <p>Try adjusting your standby window. Remember, flights must depart at least 1 hour after your standby starts.</p>
            </div>
          )}

          {flights.length > 0 && (
            <div className={styles.flightsGrid}>
              {flights.map((flight, idx) => (
                <div key={idx} className={`glass-panel ${styles.flightCard}`}>
                  <div className={styles.flightHeader}>
                    <div>
                      <div className={styles.flightNumber}>{flight.flightNumber}</div>
                      <div className={styles.flightStatus}>{flight.status}</div>
                    </div>
                  </div>
                  
                  <div className={styles.flightRoute}>
                    <div className={styles.airport}>
                      <span className={styles.airportCode}>SHJ</span>
                      <span className={styles.airportName}>Sharjah</span>
                    </div>
                    <div className={styles.routeArrow}>✈</div>
                    <div className={styles.airport}>
                      <span className={styles.airportCode}>{flight.destination}</span>
                    </div>
                  </div>

                  <div className={styles.flightTime}>
                    <ClockIcon />
                    Departure: {flight.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
