import FormComponent from './EntryForm';
import EntriesComponent from './EntryDisplay';

function App() {
  return (
    <header> Learning Tracker! 
      <div>
        <FormComponent></FormComponent> 
      </div>
      <div>
        List of entries
        <EntriesComponent></EntriesComponent>
      </div>
    </header>
  );
}

export default App;
