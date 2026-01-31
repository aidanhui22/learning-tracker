import React, { useEffect, useState } from 'react';

const EntriesComponent = (() => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch('/api/entries');
                const data = await result.json();
                setEntries(data);
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchData();
    }, [])
    
    return (
        <div>
            {entries.map(entry => (
                <p key={entry.id}>{entry.id} {entry.learned} {entry.reinforced} {entry.tomorrow}</p>
            ))}
        </div>

    );
}); 

export default EntriesComponent;