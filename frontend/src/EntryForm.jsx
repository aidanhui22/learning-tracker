import React, { useState } from 'react';

const FormComponent = ({ refetchData , refetchStreak }) => {
    const [newLearn, setNewLearn] = useState('');
    const [reinforceLearn, setReinforce] = useState('');
    const [tomorrowLearn, setTomorrow] = useState('');

    const handleNew = (event) => {
        setNewLearn(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };
    const handleReinforce = (event) => {
        setReinforce(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
    };
    const handleTomorrow = (event) => {
        setTomorrow(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 'px';
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
                refetchData();
                refetchStreak();
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='Form'>
            <label style={{padding:'2%'}}>
                <p>New:</p>
                <textarea className='Input-size' onChange={handleNew} />
            </label>
            <label style={{padding:'2%'}}>
                <p>Reinforced:</p>
                <textarea className='Input-size' onChange={handleReinforce} />
            </label>
            <label style={{padding:'2%'}}>
                <p>Tomorrow:</p>
                <textarea className='Input-size' onChange={handleTomorrow} />
            </label>
            <button 
                className='Submit-button'
                type='submit'
                disabled={newLearn.length < 3 && reinforceLearn.length < 3 && 
                tomorrowLearn.length < 3}
                >Submit</button>
        </form>
    );
};

export default FormComponent;