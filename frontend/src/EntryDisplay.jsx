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
                <p>List of entries</p>}
            {current.map(entry => (
                <p key={entry.id}>
                    {entry.id} {entry.learned} {entry.reinforced} {entry.tomorrow} 
                    <button onClick={() => {
                        DeleteEntry(entry.id);
                    }}>
                        Delete
                    </button>
                </p>
            ))}
        </div>
    );
}); 

export default DisplayEntryComponent;