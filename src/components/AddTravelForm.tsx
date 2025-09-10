import '../DashboardStyles.css';
import { useState } from 'react';
import { useTravel } from '../context/TravelContext';

interface Props {
  setTravelFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddTravelForm({ setTravelFormIsVisible }: Props) {
  const [travelName, setTravelName] = useState<string>('');
  const { addTravel } = useTravel(); 

  function closeForm() {
    setTravelFormIsVisible(false);
  }

  function addTravelNameToList() {
    if (travelName.trim()) {
      addTravel(travelName); 
      setTravelName('');
      closeForm();
    }
  }

  return (
    <div className='modal-background'>
      <div className="add-travel-form">
        <h1>Titeln på din resa</h1>
        <button onClick={closeForm} id='close'>X</button>
        <input
          id='travel-input'
          type='text'
          placeholder='Skriv in titeln på din resa'
          value={travelName}
          onChange={(e) => setTravelName(e.target.value)}
        />
        <button onClick={addTravelNameToList} id='add-travel-to-list'>
          Lägg till resan i listan
        </button>
      </div>
    </div>
  );
}

export default AddTravelForm;

