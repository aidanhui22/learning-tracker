import React, { useState } from 'react';

const FormComponent = ({ onEntryAdded }) => {
    const [newLearn, setNewLearn] = useState('');
    const [reinforceLearn, setReinforce] = useState('');
    const [tomorrowLearn, setTomorrow] = useState('');

    const handleNew = (event) => {
        setNewLearn(event.target.value);
    };
    const handleReinforce = (event) => {
        setReinforce(event.target.value);
    };
    const handleTomorrow = (event) => {
        setTomorrow(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const currDate = new Date().toISOString().split('T')[0];
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    entry_date: currDate, 
                    learned: newLearn, 
                    reinforced: reinforceLearn, 
                    tomorrow: tomorrowLearn })
            };
            const response = await fetch('/api/entries', requestOptions);
            if (!response.ok) {
                console.log('Error');
            } else {
                onEntryAdded();
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                New:
                <input onChange={handleNew} />
            </label>
            <label>
                Reinforced:
                <input onChange={handleReinforce} />
            </label>
            <label>
                Tomorrow:
                <input onChange={handleTomorrow} />
            </label>
            <button 
                type='submit'
                disabled={newLearn.length < 3 && reinforceLearn.length < 3 && 
                tomorrowLearn.length < 3}
                >Submit</button>
        </form>
    );
};

export default FormComponent;