import FormComponent from './EntryForm';
import DisplayEntryComponent from './EntryDisplay';
import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [entries, setEntries] = useState([]);

  async function fetchData() {
      try {
          const result = await fetch('/api/entries');
          const data = await result.json();
          setEntries(data);
      } catch (err) {
          console.log(err.message);
      }
  }

  const [streak, setStreak] = useState(0);

    async function fetchStreak() {
        try {
            const result = await fetch('/api/entries/streak');
            const data = await result.json();
            setStreak(data);
        } catch (err) {
            console.log(err.message);
        }
    } 

  useEffect(() => {
    fetchData();
    fetchStreak();
  }, [])

  return (
    <div>
      <div className='Header-container'>
        <header className='Header'> Learning Tracker! Current Streak: {streak} 
        </header>
      </div>
      <div className='Container'>
        <div className='Left-container'>
          <FormComponent
            refetchData={fetchData}
            refetchStreak={fetchStreak}
          /> 
        </div>
        <div className='Right-container'>
          <DisplayEntryComponent 
            entries={entries}
            refetchData={fetchData}
            refetchStreak={fetchStreak}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
