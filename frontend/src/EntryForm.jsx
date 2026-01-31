import React, { useState } from 'react';

const FormComponent = () => {
    const [newLearn, setNewLearn] = useState('');
    const [reinforceLearn, setReinforce] = useState('');
    const [tomorrowLearn, setTomorrow] = useState('');

    const handleNew = (event) => {
        console.log('Entering new: ', event.target.value);
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
            <button type='submit'>Submit</button>
        </form>
    );
};

export default FormComponent;