import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Navbar from './Navbar';


function App() {

  const [TodayWeatherData, setTodayWeatherData] = useState({});
  const [IncrementForecast, setIncrementForecast] = useState({});
  const [searchLocation, setSearchLocation] = useState('London');
  const [toggleHourly, setToggleHourly] = useState(true);
  const [toggleWeekly, setToggleWeekly] = useState(false);
  const forecast = IncrementForecast.list || [];

  // New variables
  const [latitude, setLatitude] = useState(51.5081);
  const [longitude, setLongitude] = useState(-0.1281);   // Trafalger Square
  const [submittedCoordinates, setSubmittedCoordinate] = useState(false);
  const [submittedCity, setSubmittedCity] = useState(false);
  const [routeName, setRouteName] = useState('hydepark');
  
  const routes = {
    // A list of routes are stored here along with their latitude and longitude so an API call can be made using these values
    hydepark: [51.5073, -0.1694, "Hyde Park"],
    regentspark: [51.5278, -0.1536, "Regents Park"]
  };

  let bookmarkedLocations = [];

  useEffect(() => {
    // This method gets the API data for a city
    // Gets The API Data For Today
    const fetchTodayWeatherData = () => {
      const TodayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`;
      // check if location = a specific route name then assign specific lat and lon to a variable?

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
    goBack()
    goBack()
    setSubmittedCity(false) /* Reset so the user can enter another city later on */
    hideRouteName(true) // Get rid of the previous route name under the city name
  }, [submittedCity]); // uses the searchLocation variable to detect a change and refetch data


  useEffect(() => {  
    // Fuhou added
    // This method gets the API data for a location using the coordinates inputted by the user
    // Gets The API Data For Today
    const fetchTodayWeatherData = () => {
      const TodayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`;   // Using inputted long and lat

      // axios request to fetch and set the data
      axios.get(TodayWeatherAPI).then((replyData) => {setTodayWeatherData(replyData.data);}).catch((APIError) => {});
    };

    // Gets The API Data In a 3H Increment
    const fetchIncrementForecast = () => {
      const IncrementForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=f18ca94485028011fe69b9a7fae0bed9`;
      // Uses the inputted long and lat

      // axios request to fetch and set the dataa
      axios.get(IncrementForecastAPI).then((replyData) => {setIncrementForecast(replyData.data);}).catch((APIError) => {});
    };

    // fetches data for london on initial load (searchLocation usestate default is set to london)
    fetchTodayWeatherData();
    fetchIncrementForecast();
    goBack();
    goBack(); // Return to first screen
    setSubmittedCoordinate(false);

  }, [submittedCoordinates]); // When the submittedCoordinates button is clicked it is detected and an API call is made to fetch the data



  const selectorWheel = (onHourlyForecast) => {
    setToggleHourly(onHourlyForecast);
    setToggleWeekly(!onHourlyForecast);
  };


  const carouselResponsiveness = {   // Key value pairs
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

    return weatherImages[weatherCondition];   // Return an image depending on the weather data given
  };


  const getRoute = (rName) => {
    const routeName = rName.toString().toLowerCase().replace(/\s/g, '');   // Remove spaces from the user inputted name and make it lower case so it can be matched to a variable name
    var text = document.getElementById("routeText");

    if (routeName in routes){
      // Gives the longitude and latitude variables new values
      setLatitude(routes[routeName][0]);
      setLongitude(routes[routeName][1]);
      text.innerText = "Enter the name of a Route";

      var routeText = document.getElementById("routeName");
      routeText.innerText = routes[routeName][2]; // Unhide the text on the first screen and set it to the route name selected
      hideRouteName(false); // Unhide the route name

      setSubmittedCoordinate(true); // To make a new API call and return to the first screen to display the new forecast
    }
    else{
      text.innerText = "That route does not exist. Please enter another: ";
    }
  };

  const hideRouteName = (bool) => {
    var routeText = document.getElementById("routeName");

    if (bool == false){  // Unhide the name of the route below the city name
      routeText.style.setProperty("display", "block");
    }
    else{
      routeText.style.setProperty("display", "none");
    }
  }
  

  const switchPage = (page) => {
    // Fuhou added
    // When a button to switch a page is clicked, it passes a string to this function and then the string is checked below to display the correct screen
    // E.g "search" displays the search screen
    

    var firstScreen = document.getElementById("firstScreen");  // First screen
    var searchScreen = document.getElementById("searchOptions");  // The screen with the 3 options to search
    var coordinates = document.getElementById("searchCoordinates");  // A new screen to let the user search using coordinates
    var cityScreen = document.getElementById("searchCity");  // The screen where user enters a city name
    var routeScreen = document.getElementById("searchRoute"); // Screen to get to choose a route

    if (page == "search"){
      // If the first screen is being displayed hide it and show the search screen
      firstScreen.style.setProperty("display", "none"); // Hide
      searchScreen.style.setProperty("display", "block");  // Show
    }
    else if (page == "coordinates"){
      // Hide the screen with search options and display the coordinates screen
      searchScreen.style.setProperty("display", "none");
      coordinates.style.setProperty("display", "block");
    }
    else if (page == "cities"){
      // Hide the search screen and display the screen to enter a city name
      searchScreen.style.setProperty("display", "none");
      cityScreen.style.setProperty("display", "block");
    }
    else if (page == "routes"){
      // Hide the search screen and display the screen to enter a city name
      searchScreen.style.setProperty("display", "none");
      routeScreen.style.setProperty("display", "block");
    }
  };


  const goBack = () => {
    // Fuhou added
    var firstScreen = document.getElementById("firstScreen")  // First screen
    var searchScreen = document.getElementById("searchOptions")  // The screen with the 3 options to search
    var coordinates = document.getElementById("searchCoordinates")  // A new screen to let the user search using coordinates
    var cityScreen = document.getElementById("searchCity")  // The screen where user enters a city name
    var routeScreen = document.getElementById("searchRoute") // Screen to get to choose a route

    if(getComputedStyle(searchScreen).display == "block"){  // Check if the search screen is currently being displayed
      // Go back to the first screen from the search screen
      searchScreen.style.setProperty("display", "none");  // In the index.css file the display property of searchScreen is 'none' until the searchIcon is clicked on and it becomes 'block' to display the screen
      firstScreen.style.setProperty("display", "block");
    }
    else if(getComputedStyle(coordinates).display == "block"){  // Check if the coordinates screen is currently being displayed
      // Go back to the search screen from the coordinates screen
      coordinates.style.setProperty("display", "none");
      searchScreen.style.setProperty("display", "block");
    }
    else if(getComputedStyle(cityScreen).display == "block"){  // Check if the coordinates screen is currently being displayed
      // Go back to the search screen from the coordinates screen
      cityScreen.style.setProperty("display", "none");
      searchScreen.style.setProperty("display", "block");
    }
    else if(getComputedStyle(routeScreen).display == "block"){  // Check if the coordinates screen is currently being displayed
      // Go back to the search screen from the route screen
      routeScreen.style.setProperty("display", "none");
      searchScreen.style.setProperty("display", "block");
    }
  }

  const sendCoordinates = () => {
    // This runs after the user enters their coordinates
    setSubmittedCoordinate(true);
    hideRouteName(true);
  }

  const bookmark = () => {
    var whiteBookmark = document.getElementById("whiteBookmark");  // First screen
    var blackBookmark = document.getElementById("blackBookmark");

    if (!bookmarkedLocations.includes(TodayWeatherData.name)){
      // If the location has not been bookmarked turn the icon to black and save it to the array
      bookmarkedLocations.push(TodayWeatherData.name);
      whiteBookmark.style.setProperty("display", "none");  // Hide white bookmark image
      blackBookmark.style.setProperty("display", "block");  // Display black bookmark image
      console.log("Bookmarked", bookmarkedLocations); // For testing in chrome console
    }
    else{
      // If it has been bookmarked, remove it from the array and turn the icon to white again
      const index = bookmarkedLocations.indexOf(TodayWeatherData.name);  // Get the index of the element you want to remove
      bookmarkedLocations.splice(index, 1); // Remove 1 item
      blackBookmark.style.setProperty("display", "none");
      whiteBookmark.style.setProperty("display", "block");
      console.log("Removed", bookmarkedLocations);  // For testing in chrome console
    }
    console.log("Current bookmarks: ", bookmarkedLocations);   // For testing in chrome console
    return bookmarkedLocations; 
  }


  return ( 
    
    <div className="App">
      <div id="firstScreen"> 
        <div className='menu-bar'>

          <Navbar />


          <div id="bookmarkContainer">
            <button class="bookmark" id='whiteBookmark' onClick={() => bookmark()}> <img id="wb" src="white bookmark.png"/> </button>
            {/* The bookmark will be white and when clicked on the location gets bookmarked and the icon becomes black */}
            <button class="bookmark" id='blackBookmark' onClick={() => bookmark()}> <img id="bb" src="black bookmark.png"/> </button>
            
          </div>

          <div id = 'search-bar'>
            <button id="searchImage" onClick={() => switchPage("search")}> <img id='searchIcon' src="search-icon.png"/> </button>
          </div>

          
          
        </div>


        <div className="container">
          <div className='top'>
            <div className='location' align = 'center'>
              <p class='bold' id="locationText">{TodayWeatherData.name}</p>
              <p id="routeName"> Temp </p>  {/* The value will be changed to whatever route the user enters */}
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
                <p class = 'bold'>Visibility</p>
              </div>
              <div className='Humidity'>
                {TodayWeatherData.main ? <p>{TodayWeatherData.main.humidity}%</p> : null}
                <p class = 'bold'>Humidity</p>
              </div>
              <div className='wind'>
                {TodayWeatherData.wind ? <p>{TodayWeatherData.wind.speed.toFixed()} Mph</p> : null}
                <p class = 'bold'>Wind Speed</p>
              </div>
            </div>
        </div>
      </div>

      {/* This is the search screen that appears when the user clicks on the search icon from the first screen */}
      {/* Fuhou's html below */}
      <div id="searchOptions"> 
        <div id="backButton"> 
          <button id="backIcon" onClick={() => goBack()}> <img src="back-icon.png"/> </button>
          {/* This calls the goBack function to go back to the previous page when u click on it */}
        </div>

        <div id="textContainer">
          <p> Search for a City or Route </p>
          <p> or </p>
          <p> Enter the Coordinates of your location </p>
        </div>

        <div id="buttonContainer">
          <button type="button" class="searchButtons" id="cities" onClick={() => switchPage("cities")}> Cities </button>
          <button type="button" class="searchButtons" id="routes" onClick={() => switchPage("routes")}> Routes </button>
          <button type="button" class="searchButtons" id="coordinates" onClick={() => switchPage("coordinates")}> Coordinates </button>
          {/* This switches to the correct page by sending the switchPage function a string */}
        </div>
      </div>

      {/* This is the coordinates screen to let the user enter a latitude and longitude */}
      <div id="searchCoordinates">
        <div id="backButton"> 
          <button id="backIcon" onClick={() => goBack()}> <img src="back-icon.png"/> </button>
        </div>

        <div id="coordinateTextContainer"> 
          <p> Enter the Latitude and Longitude </p>
        </div>

        <div id="latitudeContainer">
          <p> Latitude </p>
          <input id='latitudeInput' value = {latitude} onChange={event => setLatitude(event.target.value)} type='number'/>
          {/* This sets the latitude variable to whatever value you inputted using onChange */}
        </div>

        <div id="longitudeContainer">
          <p> Longitude </p>
          <input id='longitudeInput' value = {longitude} onChange={event => setLongitude(event.target.value)} type='number'/>
        </div>

        <div id="submitCoButton">
          <button id="submitCoordinates" onClick={() => sendCoordinates()}> Enter </button>
        </div>
     
      </div>

      {/* This is the city screen that lets the user enter the name of a city or location */}
      <div id="searchCity">
        <div id="backButton"> 
          <button id="backIcon" onClick={() => goBack()}> <img src="back-icon.png"/> </button>
        </div>

        <div id="cityContainer">
          <p> Enter the name of the City or Location </p>
          <input id='search-field' value = {searchLocation} onChange={event => setSearchLocation(event.target.value)}  type='text'/>
          <button id="submitCity" onClick={() => setSubmittedCity(true)}> Enter </button>
        </div>

      </div >

      <div id="searchRoute"> 
        <div id="backButton"> 
          <button id="backIcon" onClick={() => goBack()}> <img src="back-icon.png"/> </button>
        </div>

        <div id="routeContainer">
          <p id="routeText"> Enter the name of a Route </p>
          <input id='search-field' value = {routeName} onChange={event => setRouteName(event.target.value)} type='text'/>
          {/* Store the inputted name in routeName and then pass it to the getRoute function */}
          <button id="submitCity" onClick={() => getRoute(routeName)}> Enter </button>

        </div>

      </div>

    </div>
  );
}

export default App;
