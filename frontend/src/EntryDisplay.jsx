const DisplayEntryComponent = (({ entries, refetchData, refetchStreak }) => {
    const current = entries;
    const DeleteEntry = (async (id) => {
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
        const result = await fetch(`/api/entries/${id}`, requestOptions);
        if (!result.ok) {
            console.log('Error');
        } else {
            refetchData();
            refetchStreak();
        }
        } catch (err) {
            console.log(err.message);
        }
    });
    
    return (
        <div>
            {current.length > 0 &&
                <p>List of entries</p> 
            }
            {current.length === 0 &&
                <p>No entries!</p>}
            {current.map(entry => (
                <p style={{}} key={entry.id}>
                    {entry.id} <button onClick={() => {
                        DeleteEntry(entry.id);
                    }}>
                        Delete
                    </button>
                    <p>New: {entry.learned}</p>
                    <p>Reinforced: {entry.reinforced}</p>
                    <p>Tomorrow: {entry.tomorrow}</p> 
                </p>
            ))}
        </div>
    );
}); 

export default DisplayEntryComponent;