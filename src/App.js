import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


function App() {
  const [TodayWeatherData, setTodayWeatherData] = useState({});
  const [IncrementForecast, setIncrementForecast] = useState({});
  const [searchLocation, setSearchLocation] = useState('London');
  const [toggleHourly, setToggleHourly] = useState(true);
  const [toggleWeekly, setToggleWeekly] = useState(false);
  const forecast = IncrementForecast.list || [];


  useEffect(() => {
    // Gets The API Data For Today
    const fetchTodayWeatherData = () => {
      const TodayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`;

      // axios request to fetch and set the data
      axios.get(TodayWeatherAPI).then((replyData) => {setTodayWeatherData(replyData.data);}).catch((APIError) => {});
    };

    // Gets The API Data In a 3H Increment
    const fetchIncrementForecast = () => {
      const IncrementForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${searchLocation}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`;

      // axios request to fetch and set the dataa
      axios.get(IncrementForecastAPI).then((replyData) => {setIncrementForecast(replyData.data);}).catch((APIError) => {});
    };

    // fetches data for london on initial load (searchLocation usestate default is set to london)
    fetchTodayWeatherData();
    fetchIncrementForecast();
  }, [searchLocation]); // uses the searchLocation variable to detect a change and refetch data



  const selectorWheel = (onHourlyForecast) => {
    setToggleHourly(onHourlyForecast);
    setToggleWeekly(!onHourlyForecast);
  };



  const carouselResponsiveness = {
    desktopOrLaptop: {breakpoint: { max: 3000, min: 600 },items: 6},
    phone: {breakpoint: { max: 600, min: 0 },items: 4}
  };


  const daily = (forecast) => {
    return forecast.filter(entry => new Date(entry.dt * 1000).getHours() === 0);
  };

  const groupedForecast = daily(forecast);

  const getWeatherImage = (weatherData) => {
    // Your logic to determine the image link based on the weather data
    const weatherCondition = weatherData ? weatherData.toLowerCase() : 'unknown';
    
    // Your weather condition to image filename mapping
    const weatherImages = {
      rain: 'https://www.svgrepo.com/show/276659/rain.svg',
      clear: 'https://www.svgrepo.com/show/29731/sunny.svg',
      clouds: 'https://www.svgrepo.com/show/276635/cloudy-cloud.svg',
      unknown: 'https://www.svgrepo.com/show/502423/weather.svg',
    };

    return weatherImages[weatherCondition];
  };




  return (
    <div className="App">

      <div className='menu-bar'>

        <div id = 'menu-button'>
          <i class='bx bx-menu'></i>
        </div>

        <div id = 'search-bar'> 
          <input id='search-field' value = {searchLocation} onChange={event => setSearchLocation(event.target.value)}  type='text'/>
        </div>
      </div>


      <div className="container">
        <div className='top'>
          <div className='location' align = 'center'>
            <p id = 'bold'>{TodayWeatherData.name}</p>
          </div>
          <div className='temp' align = 'center'>
            {TodayWeatherData.main ? <p id = 'slim'>{TodayWeatherData.main.temp.toFixed()}°</p> : null}
          </div>
          <div className='description' align = 'center'>
            {TodayWeatherData.weather ? <p>{TodayWeatherData.weather[0].description}</p> : null}
          </div>
        </div>

        <div className='threehourly-daily' align = 'center'>
          <button id = 'hourly-weekly-toggle' style={{ textDecoration: toggleHourly ? 'underline' : 'none' }} onClick={() => selectorWheel(true)}>3-Hour Forecast</button>
          <button id = 'hourly-weekly-toggle' style={{ textDecoration: toggleWeekly ? 'underline' : 'none' }} onClick={() => selectorWheel(false)}>Daily Forecast</button>

          {toggleHourly ?
            <Carousel removeArrowOnDeviceType={["phone"]} swipeable={true} responsive={carouselResponsiveness}>
              {forecast.map((entry, index) => (
              <div key={index} id='weather-box-small'>
                <p id='time-small'>{new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <img id='img-small' src = {getWeatherImage(entry.weather[0].main)} alt='Weather Icon' />
                <p id='rain-small'>{entry.weather ? `${entry.weather[0].main}` : null}</p>
                <p id='temp-small'>{entry.main ? entry.main.temp.toFixed() : null}°</p>
              </div>
              ))}
            </Carousel>
           : null}

          {toggleWeekly ?

            <Carousel removeArrowOnDeviceType={["phone"]} swipeable={true} responsive={carouselResponsiveness}>
            {groupedForecast.map((entry2, index) => (
            <div key={index} id='weather-box-small'>
              <p id='time-small'>{new Date(entry2.dt * 1000).toLocaleDateString('en-GB', { weekday: 'short' })}</p>
              <img id='img-small' src={getWeatherImage(entry2.weather[0].main)} alt='Weather Icon' />
              <p id='rain-small'>{entry2.weather ? `${entry2.weather[0].main}` : null}</p>
              <p id='temp-small'>{entry2.main ? entry2.main.temp.toFixed() : null}°</p>
            </div>
            ))}
            </Carousel>
          
          : null}


        </div>
        <div className='bottom'>
            <div className='visibility'>
              {TodayWeatherData.visibility ? <p>{TodayWeatherData.visibility/1000} km</p> : null}
              <p id = 'bold'>Visibility</p>
            </div>
            <div className='Humidity'>
              {TodayWeatherData.main ? <p>{TodayWeatherData.main.humidity}%</p> : null}
              <p id = 'bold'>Humidity</p>
            </div>
            <div className='wind'>
              {TodayWeatherData.wind ? <p>{TodayWeatherData.wind.speed.toFixed()} Mph</p> : null}
              <p id = 'bold'>Wind Speed</p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
