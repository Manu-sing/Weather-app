const searchBar = document.querySelector(".search");
const submitBtn = document.querySelector(".lens");
const textArea = document.querySelector(".search")

let city = "";
let cityArray = [];



submitBtn.addEventListener("click", () => {
    city = searchBar.value;
    getWeather();
    searchBar.value = "";
})


textArea.addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
        submitBtn.click();
    }
});

async function getWeather() {
    try {
        const response = await fetch(url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=545f935b620eebe6eab69772d810bf4d`, {mode: "cors"});
        const weatherData = await response.json();
        console.log(weatherData);
        
        const weatherObj = makeWeatherOject(city, weatherData.sys.country, weatherData.weather[0].main, weatherData.weather[0].description, weatherData.main.humidity, weatherData.wind.speed);
        console.log(weatherObj);
        
        const fahrenheit = Math.round(((weatherData.main.temp - 273.15) * 9/5) + 32)
        const celsius = Math.round((fahrenheit - 32) * 5/9);
        weatherObj.temperature.push(fahrenheit + "°F");
        weatherObj.temperature.push(celsius + "°C");

        const feltFahrenheit = Math.round(((weatherData.main.feels_like - 273.15) * 9/5) + 32)
        const feltCelsius = Math.round((feltFahrenheit - 32) * 5/9);
        weatherObj.feelsLike.push(feltFahrenheit + "°F");
        weatherObj.feelsLike.push(feltCelsius + "°C");

        cityArray = [];
        cityArray.push(weatherObj);

        displayWeather();

        
    } catch (error) {
        console.log(error);
    }

    
}

const makeWeatherOject = (city, country, weather, description, humidity, wind) => {
    let temperature = [];
    let feelsLike = [];
    return{city, country, weather, description, temperature, feelsLike, humidity, wind}
}

// display weather object on the page
const displayWeather = () => {
    
    const container = document.querySelector(".container");
    container.textContent = "";

    for(let i = 0; i < cityArray.length; i++ ) {
        
        const cityWeatherContainer = document.createElement("div");
        cityWeatherContainer.classList.add("city-weather-cont");

        const descriptionContainer = document.createElement("div");
        const weatherDescription = document.createElement("p");
        descriptionContainer.appendChild(weatherDescription);

        const titleContainer = document.createElement("div");
        const title = document.createElement("h3");
        titleContainer.appendChild(title);

        const tempAndOthersContainer = document.createElement("div");
        tempAndOthersContainer.classList.add("temp-and-others-cont");
        
        const tempContainer = document.createElement("div");
        tempContainer.classList.add("temp-cont")
        const temperature = document.createElement("p");
        temperature.classList.add("temp");
        const changeTempMetric = document.createElement("button");
        changeTempMetric.classList.add("change-temp-btn");
        tempContainer.appendChild(temperature);
        tempContainer.appendChild(changeTempMetric);

        const othersContainer = document.createElement("div");
        othersContainer.classList.add("others");
        const feltTemp = document.createElement("p");
        const humidity = document.createElement("p");
        const wind = document.createElement("p");
        othersContainer.appendChild(feltTemp);
        othersContainer.appendChild(humidity);
        othersContainer.appendChild(wind);

        tempAndOthersContainer.appendChild(tempContainer);
        tempAndOthersContainer.appendChild(othersContainer);

        title.textContent = city.toUpperCase() + ", " + cityArray[i].country;
        weatherDescription.textContent = cityArray[i].description;
        temperature.textContent = cityArray[i].temperature[0];
        changeTempMetric.textContent = "Celsius";
        feltTemp.textContent = "Feels like: " + cityArray[i].feelsLike[0];
        humidity.textContent = "Humidity: " + cityArray[i].humidity + "%";
        wind.textContent = "Wind: " + cityArray[i].wind + " MPH";


        changeTempMetric.addEventListener("click", () => {
            if (changeTempMetric.textContent == "Celsius") {
                feltTemp.textContent = "Feels like: " + cityArray[i].feelsLike[1];
                temperature.textContent = cityArray[i].temperature[1];
                changeTempMetric.textContent = "Farhenheit";
            } else {
                feltTemp.textContent = "Feels like: " + cityArray[i].feelsLike[0];
                temperature.textContent = cityArray[i].temperature[0];
                changeTempMetric.textContent = "Celsius";
            }
        })
            
        cityWeatherContainer.appendChild(descriptionContainer);
        cityWeatherContainer.appendChild(titleContainer);
        cityWeatherContainer.appendChild(tempAndOthersContainer);
        

        container.appendChild(cityWeatherContainer);

        const backgroundImg = document.createElement("img");
        backgroundImg.classList.add("background-img");

        container.appendChild(backgroundImg);

        getBackground(cityArray[i].weather, backgroundImg);
    }
}

// change background based on the weather

async function getBackground(keyWord, img) {
    try {
    const response = await fetch(url = `https://api.giphy.com/v1/gifs/translate?api_key=9rbKRbOcBrLOaL5Nmwqf7gOLOfcOjXAY&s=${keyWord}`, {mode: "cors"});
    const anythingData = await response.json();
    img.src = anythingData.data.images.original.url;
    } catch (error) {
        alert ("error: " + error);
    }
}