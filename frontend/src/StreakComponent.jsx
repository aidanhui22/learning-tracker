import { useState } from 'react'

const StreakComponent = (() => {
    const [streak, setStreak] = useState('');

    async function FetchStreak() {
        try {
            const result = await fetch('/api/entries/streak');
            const data = result.json();
            setStreak(data);
        } catch (err) {
            console.log(err.message);
        }
    }
});

export default StreakComponent;