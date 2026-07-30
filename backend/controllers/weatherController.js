export const getWeather = async (req, res, next) => {
  try {
    const city = (req.query.city || 'Islamabad').toString().trim();
    if (!city) {
      return res.status(400).json({ error: 'City query parameter is required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'OpenWeather API key is missing on the server. Please set OPENWEATHER_API_KEY in backend/.env',
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: `City "${city}" not found` });
      }
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid or unactivated OpenWeather API key' });
      }
      return res.status(response.status).json({ error: 'Failed to fetch live weather data from OpenWeather API' });
    }

    const data = await response.json();
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0]?.main || 'Clear',
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '01d',
    };

    return res.json(weatherData);
  } catch (error) {
    next(error);
  }
};
