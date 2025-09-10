import '../DashboardStyles.css';
import { useState, useEffect } from 'react';

function Weather({ title }: { title: string }) {
    const [apiKey] = useState<string>('50d9edb672a8792cd1aeb65e98706006');
    const [temperature, setTemperature] = useState<string>('');
    const [weatherDescription, setWeatherDescription] = useState<string>('');
    const [humidity, setHumidity] = useState<string>('');
    const [feelsLike, setFeelsLike] = useState<string>('');
    const [error, setError] = useState<string>('');

    function fetchWeather() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${title}&appid=${apiKey}&units=metric`)
            .then((response) => response.json())
            .then(data => {
                if (data.cod !== 200) {
                    setError('Vädret hittades inte');
                    setTemperature('');
                    setWeatherDescription('');
                    setHumidity('');
                    setFeelsLike('');
                } else {
                    setWeatherDescription(data.weather[0].description);
                    setTemperature(data.main.temp);
                    setFeelsLike(data.main.feels_like);
                    setHumidity(data.main.humidity);
                    setError('');
                }
            })
    }

    useEffect(() => {
        if (title) {
            fetchWeather();
        }
    }, [title]);

    if (!title) {
        return <div className="weather">Resmål saknas</div>;
    }

    return (
        <div className="weather">
            <h2>Vädret i {title}</h2>
            {error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <div className='weather-info'>
                    <span className='weather-details'><img src='../src/assets/icons/thermometer.png'/>Temperatur {temperature}°C</span>
                    <span className='weather-details'><span style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}><img style={{width: '33px', height: '33px'}} src='../src/assets/icons/thermometer.png'/> <img style={{width: '40px', height: '40px'}} src='../src/assets/icons/boy.png'/></span> Känns som {feelsLike}°C</span>
                    <span className='weather-details'><img src='../src/assets/icons/notebook.png'/>beskrivning {weatherDescription}</span>
                    <span className='weather-details'><img src='../src/assets/icons/humidity.png'/> Fuktighet {humidity}%</span>
                    
                </div>
            )}
        </div>
    );
}

export default Weather;