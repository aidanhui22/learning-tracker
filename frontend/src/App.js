import FormComponent from './EntryForm';
import DisplayEntryComponent from './EntryDisplay';
import { useEffect, useState } from 'react';

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
    <header> Learning Tracker! Current Streak: {streak}
      <div>
        <FormComponent 
          refetchData={fetchData}
          refetchStreak={fetchStreak}
        /> 
      </div>
      <div>
        <DisplayEntryComponent 
          entries={entries}
          refetchData={fetchData}
          refetchStreak={fetchStreak}
        />
      </div>
    </header>
  );
}

export default App;
