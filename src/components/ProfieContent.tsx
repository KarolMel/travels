import '../DashboardStyles.css';
import { useAuth } from '../context/AuthContext';

{/* New code START */}

import React from 'react';
import { Box } from '@mui/material';
import { Modal } from '@mui/material';
import { useState, useEffect } from 'react';
import { set } from 'date-fns';


const style = {
  alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-around',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}


interface City {
    id?: string;
    name: string;
    population: number;
}

{/* New code END */}

function ProfileContent() {

    {/* New code START */}
    

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [cities, setCities] = useState<City[]>([]);
   // const [population, setPopulation] = useState(0);
    const [cityInput, setCityInput] = useState('');
    const [populationInput, setPopulationInput] = useState(0);

    const [clickedCity, setClickedCity] = useState<City | null>(null);

    const [updateCityInput, setUpdateCityInput] = useState('');
    const [updatePopulationInput, setUpdatePopulationInput] = useState(0);


    

function fetchCities() {
    fetch('http://localhost:5000/cities')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: City[]) => {
            setCities(data);
        //   setPopulation(data.population);
        })
        .catch(err => console.error('Fetch error:', err));
}

    useEffect(() => {
        fetchCities();
    }, []);


    function addCity() {
        fetch('http://localhost:5000/cities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: cityInput, population: populationInput})
        })
        .then(response => response.json())
        .then(() => fetchCities())
    }



    const clickOnCity = (city: City) => {
        console.log(city.id);
        setClickedCity(city);
    }

    const clickOnPopulation = (city: City) => {
        console.log(city.population);
    }


    function updateCity() {
        if(!clickedCity) return;
        fetch(`http://localhost:5000/cities/${clickedCity.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: updateCityInput, population: updatePopulationInput, id: clickedCity.id})
        })
        .then(response => response.json())
        .then(() => fetchCities())
    }


    {/* New code END */}

    const { user } = useAuth();

    return(
    <>
        <div className="profile-window">
            <div className='avatar'><img src='../src/assets/user.png'/></div>
            <h2 style={{fontSize: '42px'}}>{ user?.username }</h2>

            {/* New code START */}

            <input onChange={(e) => setCityInput(e.target.value)} value={cityInput} type='text' placeholder='Skriv in din favorit stad'/>
            <input onChange={(e) => setPopulationInput(Number(e.target.value))} value={populationInput} type='number' placeholder='Skriv in befolkning'/>

            <button style={{margin: 0}} onClick={addCity}>Lägg till stad</button>
            <button onClick={handleOpen}>Kolla dina favorita städer</button> 


            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stad</th>
                                    <th>Befolkning</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cities.map((city: City) => (
                                    <tr key={city.id}>
                                        <td onClick={() => {clickOnCity(city)}} style={{cursor: 'pointer'}}>{city.name}</td>
                                        <td onClick={() => {clickOnPopulation(city)}} style={{cursor: 'pointer'}} >{city.population}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{height: '400px', width: '500px',display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center'}}>
                            <h2>Klicka på staden som du vill ändra information om</h2>
                            <p style={{fontSize: '30px', fontWeight: 'bold'}}>{clickedCity?.name}</p>
                            <input onChange={(e) => setUpdateCityInput(e.target.value)} type='text' placeholder='Skriv in ny stad'/>
                            <input onChange={(e) => setUpdatePopulationInput(Number(e.target.value))} type='number'  placeholder='Skriv in ny befolkning'/>
                            <button onClick={updateCity}>Uppdatera</button>
                        </div>
                </Box>
            </Modal>

            {/* New code END */}

        </div>
    </>
    )
}

export default ProfileContent;