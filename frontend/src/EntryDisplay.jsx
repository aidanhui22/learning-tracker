import { useState } from "react";
import EditForm from "./EditForm";

const DisplayEntryComponent = ({ entries, refetchData, refetchStreak }) => {
  const current = entries;
  const [editingId, setEditingId] = useState(null);

  const DeleteEntry = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/api/entries/${id}`,
        requestOptions,
      );
      if (!result.ok) {
        console.log("Error");
      } else {
        refetchData();
        refetchStreak();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      {current.length === 0 && <p>No entries!</p>}
      {current.map((entry) => (
        <div key={entry.id}>
          {editingId === entry.id ? (
            // Show edit form
            <EditForm
              entryId={entry}
              onSave={() => {
                refetchData();
                setEditingId(null);
              }}
              onCancel={() => {
                setEditingId(null);
              }}
            />
          ) : (
            // Show normal display
            <div>
              <p>New: {entry.learned}</p>
              <p>Reinforced: {entry.reinforced}</p>
              <p>Tomorrow: {entry.tomorrow}</p>
              <button onClick={() => setEditingId(entry.id)}>Edit</button>
              <button onClick={() => DeleteEntry(entry.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayEntryComponent;
