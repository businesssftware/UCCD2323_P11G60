

// Function to update all weather data on the dashboard
function updateWeatherData(data) {
    document.getElementById('currentTemp').textContent = `${data.temperature.toFixed(1)}°C`;
    document.getElementById('minTemp').textContent = `${data.minTemp.toFixed(1)}°C`;
    document.getElementById('maxTemp').textContent = `${data.maxTemp.toFixed(1)}°C`;
    updateTemperatureIndicator(data.temperature, data.minTemp, data.maxTemp);
    document.getElementById('humidityValue').textContent = data.humidity;
    updateGauge('humidityGauge', data.humidity);
    document.getElementById('windSpeedValue').textContent = data.windSpeed.toFixed(2);
    updateGauge('windSpeedGauge', data.windSpeed, 20);
    document.getElementById('windDirectionValue').textContent = data.windDirection;
    updateWindDirection(data.windDirection);
    document.getElementById('weatherDescription').textContent = data.weatherCondition;
    document.getElementById('weatherIcon').textContent = getWeatherIcon(data.weatherCondition);
    document.getElementById('sunriseTime').textContent = new Date(data.sunrise * 1000).toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: data.timezone || 'Europe/Madrid'
    });
    document.getElementById('sunsetTime').textContent = new Date(data.sunset * 1000).toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: data.timezone || 'Europe/Madrid'
    });
    document.getElementById('rainChance').textContent = `${data.rainChance}%`;
    if (document.getElementById('locationSmall')) {
        document.getElementById('locationSmall').textContent = data.location;
    }

    const suggestions = generateSuggestions(data);
    updateSuggestions(suggestions);
}




// Function to generate dynamic activity suggestions based on weather data
function generateSuggestions(data) {
    const suggestions = [];
    const temp = data.temperature;
    const rainChance = data.rainChance || 0;
    const windSpeed = data.windSpeed;
    const condition = data.weatherCondition.toLowerCase();

    if (temp > 30 && rainChance < 20 && condition.includes('clear')) {
        suggestions.push('🏊 Go for a swim or light jog – stay hydrated.');
        suggestions.push('🧘 Outdoor yoga in the shade.');
        suggestions.push('🌳 Team picnic with light activities.');
    } else if (temp > 20 && temp <= 30 && rainChance < 20 && condition.includes('clear')) {
        suggestions.push('🏃 Run or bike outdoors.');
        suggestions.push('🥾 Go hiking with friends.');
        suggestions.push('🧘 Yoga or picnic outdoors.');
    } else if (temp > 10 && temp <= 20 && rainChance < 30) {
        suggestions.push('🚶 Brisk walk in the park.');
        suggestions.push('⚽ Outdoor team-building games.');
        suggestions.push('🚴 Cycle to work.');
    } else if (temp <= 10 || rainChance >= 30 || condition.includes('rain') || condition.includes('snow')) {
        suggestions.push('🏋 Indoor workout.');
        suggestions.push('🛌 Focus on recovery & stretching.');
        suggestions.push('📖 Indoor wellness activities.');
    } else {
        suggestions.push('🧘Mix indoor & outdoor activities.');
        suggestions.push('😜Short walk with wind monitoring.');
    }

    if (windSpeed > 10) {
        suggestions.push('Avoid high-wind activities, do indoor strength training.');
    }
    if (data.humidity > 80) {
        suggestions.push('Stay hydrated during activities.');
    }
    if (temp > 30) {
        suggestions.push('Drink water often & avoid overexertion.');
    }

    return suggestions.slice(0, 5);
}

// Function to update the suggestions list in the DOM
function updateSuggestions(suggestions) {
    const list = document.getElementById('suggestionList');
    if (!list) return;

    list.innerHTML = ''; // Clear existing suggestions
    suggestions.forEach((suggestion, index) => {
        const li = document.createElement('li');
        li.className = 'suggestion-item fade-in';
        li.textContent = suggestion;
        li.style.animationDelay = `${index * 0.1}s`;
        list.appendChild(li);
    });
}

// Function to update the time display (adjusted for +08 timezone)
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Shanghai' // Adjust for +08 timezone
    });
    document.getElementById('currentTime').textContent = timeString;
}

// Function to update gauge displays
function updateGauge(gaugeId, value, maxValue = 100) {
    const gauge = document.getElementById(gaugeId);
    const circumference = 314; // 2 * π * 50
    const offset = circumference - (value / maxValue) * circumference;
    gauge.style.strokeDashoffset = offset;
}

// Function to update wind direction arrow
function updateWindDirection(degrees) {
    const arrow = document.getElementById('windDirectionArrow');
    arrow.style.transform = `translate(-50%, -100%) rotate(${degrees}deg)`;
}

// Function to update temperature indicator position
function updateTemperatureIndicator(temp, minTemp, maxTemp) {
    const indicator = document.getElementById('tempIndicator');
    const range = maxTemp - minTemp;
    const position = ((temp - minTemp) / range) * 200;
    const topPosition = 200 - position;
    indicator.style.top = `${Math.max(0, Math.min(200, topPosition))}px`;
}

// Function to map weather condition to icon
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    return '🌤️';
}

//Calling Restful API with jQuery
function fetchWeatherData(lat, lon) {
    const apiKey = '3e08267a6a1d9c62c0195fe25593f4af';



    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    $.getJSON(url, function (apiData) {
        const data = {
            temperature: apiData.main.temp,
            minTemp: apiData.main.temp_min,
            maxTemp: apiData.main.temp_max,
            humidity: apiData.main.humidity,
            windSpeed: apiData.wind.speed,
            windDirection: apiData.wind.deg,
            weatherCondition: apiData.weather[0].description,
            location: apiData.name,
            sunrise: apiData.sys.sunrise,
            sunset: apiData.sys.sunset,
            rainChance: apiData.rain ? (apiData.rain['1h'] || 0) * 100 : 0
        };
        updateWeatherData(data);
    }).fail(function () {
        console.error("Error fetching weather data, using fallback data.");

        const sampleApiData = {
            temperature: 2.6,
            minTemp: -0.5,
            maxTemp: 8.6,
            humidity: 87,
            windSpeed: 1.44,
            windDirection: 350,
            weatherCondition: 'clear',
            location: 'Industrial Shields',
            sunrise: Math.floor(Date.now() / 1000) - 3600,
            sunset: Math.floor(Date.now() / 1000) + 3600,
            rainChance: 0
        };
        updateWeatherData(sampleApiData);
    });
}


// Initialize the dashboard
function initDashboard() {
    updateTime();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon);
            },//take the  location latitude and longtitude
            (error) => {
                console.warn("Error get location, default by Kuala Lumpur", error.message);
                fetchWeatherData(3.1390, 101.6869); // fallback → KL
            }
        );
    } else {
        console.warn("Browser does not support geolocation , default by Kuala Lumpur");
        fetchWeatherData(3.1390, 101.6869);
    }//cannot get location or user not allow geolocation get the info 

    // Update time every second
    setInterval(updateTime, 1000);
    setInterval(() => {
        // read location value after interval
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                () => fetchWeatherData(3.1390, 101.6869)
            );
        }
    }, 60000);    // Update weather data every 1 minutes  due to not fetch overload from openweather 

}



// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .option-card, .industry-card, .stat-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '%';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '%';
            }
        };

        updateCounter();
    });
}

// Trigger counter animation when statistics section is visible
const statsSection = document.querySelector('.statistics');
let countersAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}
// Ripple Effect
document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.classList.add("ripple");
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});


window.addEventListener("load", initDashboard);



