const slider = document.getElementById("timeSlider");
const app = document.getElementById("app");
const timeLabel = document.getElementById("timeLabel");
const weatherLabel = document.getElementById("weatherLabel");
const locationInput = document.getElementById("locationInput");
const fetchWeatherButton = document.getElementById("fetchWeather");
const locationDisplay = document.getElementById("locationDisplay");

// Initialize variables for sunrise and sunset times and weather forecast data
let sunriseTime = null;
let sunsetTime = null;
let hourlyForecast = [];

// Function to get the current system time in hours and minutes
function getSystemTime() {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
}

// Set the slider's initial value to the current system time
const systemTime = getSystemTime();
slider.value = systemTime;
updateBackground(systemTime);
updateTimeLabel(systemTime);

// Add event listener to slider
slider.addEventListener("input", (e) => {
    const time = parseFloat(e.target.value);
    updateBackground(time);
    updateWeatherBasedOnTime(time); 
    updateTimeLabel(time);
});

// Function to update the time label based on slider value
function updateTimeLabel(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    timeLabel.textContent = `Current Time: ${formattedTime}`;
}

// Function to fetch weather and forecast data from OpenWeatherAPI
function fetchWeather(location) {
    const apiKey = "61515101488d4ede7da7de2247a19572"; // OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&q=${encodeURIComponent(location)}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid location or weather fetch failed");
            }
            return response.json();
        })
        .then(data => {
            const { city, list } = data;
            hourlyForecast = list; // Store hourly forecast data
            const sunrise = new Date(city.sunrise * 1000);
            const sunset = new Date(city.sunset * 1000);
            sunriseTime = sunrise.getHours() + sunrise.getMinutes() / 60;
            sunsetTime = sunset.getHours() + sunset.getMinutes() / 60;
            
            locationDisplay.textContent = `Location: ${city.name}, ${city.country}`;
            updateBackground(systemTime); // Update background when weather is loaded
            updateWeatherBasedOnTime(systemTime); // Initial weather update based on the time
        })
        .catch(() => {
            weatherLabel.textContent = "Unable to fetch weather. Check the location.";
        });
}

// Function to update weather based on time selected via the slider
function updateWeatherBasedOnTime(time) {
    // Find the forecast data for the closest hour (previous or next forecast)
    const closestForecast = findClosestForecast(time);

    if (closestForecast) {
        const { main: { temp }, weather, wind } = closestForecast;
        const condition = weather[0].description; // Weather condition (e.g., clear sky)
        const windSpeed = wind.speed; // Wind speed

        // Update the weather display
        weatherLabel.textContent = `Weather: ${temp}°C, ${condition}, Wind: ${windSpeed} m/s`;
    } else {
        weatherLabel.textContent = "Weather data not available for this time.";
    }
}

// Function to find the closest forecast (either previous or next) based on the selected time
function findClosestForecast(time) {
    const forecastTimes = hourlyForecast.map(f => {
        const forecastTime = new Date(f.dt * 1000);
        return forecastTime.getHours() + forecastTime.getMinutes() / 60; // Convert forecast time to decimal hours
    });

    let closestForecast = null;
    let closestTimeDiff = Infinity;

    hourlyForecast.forEach((forecast, index) => {
        const forecastTime = forecastTimes[index];
        const timeDiff = Math.abs(forecastTime - time);
        if (timeDiff < closestTimeDiff) {
            closestTimeDiff = timeDiff;
            closestForecast = forecast;
        }
    });

    return closestForecast;
}

// Function to update background based on time, weather, sunrise, and sunset
function updateBackground(time) {
    updateBackgroundBasedOnSunriseSunset(time);
}

// Function to update background based on the time of day, including sunrise and sunset logic
function updateBackgroundBasedOnSunriseSunset(time) {
    if (sunriseTime === null || sunsetTime === null) {
        return;
    }

    let backgroundColor;

    // Before sunrise: Soft red (Night)
    if (time < sunriseTime) {
        backgroundColor = "rgb(180, 100, 100)"; // Night: Soft red
    }
    // After sunset: Amber (Evening)
    else if (time >= sunsetTime) {
        backgroundColor = "rgb(255, 220, 180)"; // Evening: Amber
    }
    // Daytime: Neutral white
    else {
        backgroundColor = "rgb(255, 255, 240)"; // Daytime: Neutral white
    }

    app.style.backgroundColor = backgroundColor;
}

// Add event listener to the button to fetch weather
fetchWeatherButton.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        weatherLabel.textContent = "Please enter a location.";
    }
});

// Optional: Fetch weather for a default location if the page loads without a user input
fetchWeather("Eindhoven");
