const cityData = {
  "cities": [
    {
      "rank": 1,
      "name": "Tokyo",
      "country": "Japan"
    },
    {
      "rank": 2,
      "name": "Delhi",
      "country": "India"
    },
    {
      "rank": 3,
      "name": "Shanghai",
      "country": "China"
    },
    {
      "rank": 4,
      "name": "São Paulo",
      "country": "Brazil"
    },
    {
      "rank": 5,
      "name": "Mumbai",
      "country": "India"
    },
    {
      "rank": 6,
      "name": "Beijing",
      "country": "China"
    },
    {
      "rank": 7,
      "name": "Karachi",
      "country": "Pakistan"
    },
    {
      "rank": 8,
      "name": "Istanbul",
      "country": "Turkey"
    },
    {
      "rank": 9,
      "name": "Dhaka",
      "country": "Bangladesh"
    },
    {
      "rank": 10,
      "name": "Moscow",
      "country": "Russia"
    },
    {
      "rank": 11,
      "name": "Cairo",
      "country": "Egypt"
    },
    {
      "rank": 12,
      "name": "Bangkok",
      "country": "Thailand"
    },
    {
      "rank": 13,
      "name": "Buenos Aires",
      "country": "Argentina"
    },
    {
      "rank": 14,
      "name": "Mexico City",
      "country": "Mexico"
    },
    {
      "rank": 15,
      "name": "Kuala Lumpur",
      "country": "Malaysia"
    },
    {
      "rank": 16,
      "name": "Lagos",
      "country": "Nigeria"
    },
    {
      "rank": 17,
      "name": "Rio de Janeiro",
      "country": "Brazil"
    },
    {
      "rank": 18,
      "name": "Tianjin",
      "country": "China"
    },
    {
      "rank": 19,
      "name": "Kinshasa",
      "country": "Democratic Republic of the Congo"
    },
    {
      "rank": 20,
      "name": "Guangzhou",
      "country": "China"
    }
  ]
}

const API_key = "82005d27a116c2880c8f0fcb866998a0";
const searchBtn = document.getElementById("search-btn");
const inputField = document.getElementById("city-input");
const cityWeatherIcon = document.getElementById("city-weather-icon");
const cityTemp = document.getElementById("city-temp");
const cityDesc = document.getElementById("city-desc");
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");
const cardContainer = document.getElementById("card-container");
const loaderContainer = document.getElementById("loader-container");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const inputDropdown=document.getElementById('city-dropdown');

cardContainer.style.display = "none";
errorContainer.style.display = "none";
document.body.style.backgroundSize = "cover";

// To get current location
const getCityName = async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const weatherData = await getWeatherDataFromLocation(latitude, longitude);
  displayWeatherDetails(weatherData);
};

// if navigator failed to fetch location
const failedToGetLocation = async (error) => {
  console.log("Error getting user location:", error);
  errorMessage.innerText = "Permission Blocked";
  toggleContainer(false, false, true);
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCityName, failedToGetLocation);
}

const getWeatherDataFromLocation = async (latitude, longitude) => {
  const API_URL_Coordinates = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`;
  const data = await fetchData(API_URL_Coordinates);
  const weatherDetails = await data.json();
  const iconId = weatherDetails.weather[0].icon;
  const tempInCelcius = Math.floor(weatherDetails.main.temp - 273.15);
  const description = weatherDetails.weather[0].description;
  const city = weatherDetails.name;
  const country = weatherDetails.sys.country;
  const weatherType = weatherDetails.weather[0].main;
  return { description, tempInCelcius, city, country, iconId, weatherType };
};

const inputCityName = async (cityname) => {
  const API_URL_CityName = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${API_key}`;
  toggleContainer(true, false, false);
  const data = await fetchData(API_URL_CityName);
  if (data) {
    const jsonData = await data?.json();
    if (jsonData.length > 0) {
      const lat = jsonData[0]?.lat;
      const lon = jsonData[0]?.lon;
      const locationData = await getWeatherDataFromLocation(lat, lon);
      displayWeatherDetails(locationData);
    } else {
      errorMessage.innerText = "Invalid City";
      document.body.style.backgroundImage = "url(/assets/Default.jpg)";
      toggleContainer(false, false, true);
    }
  } else {
    return null;
  }
};

const fetchData = async (url) => {
  const response = await fetch(url);
  if (response.status !== 200) {
    errorMessage.innerText = "Invalid City";
    document.body.style.backgroundImage = "url(/assets/Default.jpg)";
    toggleContainer(false, false, true);
    return null;
  }
  return response;
};

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  } else if (inputField.value == "" && e.keyCode === 32) {
    e.preventDefault();
    return;
  }
});

const displayWeatherDetails = async (weatherDetails) => {
  toggleContainer(false, true, false);
  const { tempInCelcius, description, city, country, iconId, weatherType } = weatherDetails;
  cityTemp.innerText = tempInCelcius + "° ";
  cityDesc.innerText = description;
  cityName.innerText = city;
  countryName.innerText = country;
  cityWeatherIcon.setAttribute("src", `./assets/${iconId}.png`);
  document.body.style.backgroundImage = `url(/assets/${weatherType}.jpg)`;
};

const toggleContainer = (showLoader, showCard, showError) => {
  loaderContainer.style.display = showLoader ? "inline-block" : "none";
  cardContainer.style.display = showCard ? "inline-block" : "none";
  errorContainer.style.display = showError ? "inline-block" : "none";
};


const filterCities = (cityname) => {
  const filteredCities = cityData.cities.filter(city =>
    city.name.toLowerCase().includes(cityname.toLowerCase())
  );
  return filteredCities;
};


const autoCompleteInput = (cities) => {
  inputDropdown.innerHTML = '';
  if (cities.length === 0) {
    inputDropdown.classList.remove("show");
    return;
  }
  
  cities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city.name;
    listItem.classList.add('dropdown-item');
    inputDropdown.appendChild(listItem);
  });
};

inputField.addEventListener("input", (e) => {
  const input = inputField.value.trim();
  if (input.length === 0) {
    inputDropdown.innerHTML = "";
    inputDropdown.classList.remove("show");
    return;
  }
  inputDropdown.classList.add("show");
  const filteredCities = filterCities(input);
  autoCompleteInput(filteredCities);
  
  if (e.key === "Enter") {
    search();
  }
});

const search=()=> {
  const inputValue = inputField.value.trim();
  if (!inputValue) {
    errorMessage.innerText = "Please Enter cityname";
    toggleContainer(false, false, true);
    return;
  }
  inputCityName(inputValue);
  inputField.value = "";
  inputDropdown.classList.remove("show");
}

searchBtn.addEventListener("click", search);

inputDropdown.addEventListener('click', (event) => {
  if (event.target && event.target.nodeName == 'LI') {
      inputField.value = event.target.textContent;
      inputDropdown.innerHTML = '';
      inputDropdown.classList.remove("show");
      inputCityName(inputField.value);
      inputField.value = "";
  }
});
