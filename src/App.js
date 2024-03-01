import React, {useState} from 'react'
import axios from 'axios'

function App() {
  const[data, setData] = useState({})
  const[location, setLocation] = useState('')
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`
  const searchLocation = (event) => {
    if (event.key === 'Enter'){
      axios.get(url).then((response) => {
        setData(response.data)
      })
      setLocation('')
    }
  }

  return (
    <div className="App">
      <div className='search'>
        <input
        value = {location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type='text'/>
      </div>
      <div className="container">
        <div className='top'>
          <div className='location' align = 'center'>
            <p id = 'bold'>{data.name}</p>
          </div>
          <div className='temp' align = 'center'>
            {data.main ? <p id = 'slim'>{data.main.temp.toFixed()}°</p> : null}
          </div>
          <div className='description' align = 'center'>
            {data.weather ? <p>{data.weather[0].description}</p> : null}
          </div>
        </div>
        <div className='3hourly'>
          
        </div>
        <div className='bottom'>
            <div className='visibility'>
              {data.visibility ? <p>{data.visibility}mi</p> : null}
              <p id = 'bold'>Visibility</p>
            </div>
            <div className='Humidity'>
              {data.main ? <p>{data.main.humidity}%</p> : null}
              <p id = 'bold'>Humidity</p>
            </div>
            <div className='wind'>
              {data.wind ? <p>{data.wind.speed} Mph</p> : null}
              <p id = 'bold'>Wind Speed</p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
