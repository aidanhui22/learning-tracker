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

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <header> Learning Tracker! 
      <div>
        <FormComponent 
          onEntryAdded={fetchData()}
        /> 
      </div>
      <div>
        <DisplayEntryComponent 
          entries={entries}
          onDelete={fetchData}
        />
      </div>
    </header>
  );
}

export default App;
