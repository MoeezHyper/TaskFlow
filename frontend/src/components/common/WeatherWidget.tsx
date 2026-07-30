import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Search,
  RefreshCw,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { weatherCache } from '@/services/cacheService';
import { searchCities, type CityOption } from '@/data/cities';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  cached?: boolean;
}

export const WeatherWidget: React.FC = () => {
  const [cityInput, setCityInput] = useState<string>('Islamabad');
  const [activeCity, setActiveCity] = useState<string>('Islamabad');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Dropdown Autocomplete States & Refs
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const matchingCities = useMemo(() => {
    return searchCities(cityInput);
  }, [cityInput]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

  const fetchWeather = async (targetCity: string, bypassClientCache: boolean = false) => {
    const queryCity = targetCity.trim();
    if (!queryCity) return;

    setError(null);

    // 1. Check client cache first if not bypassing
    if (!bypassClientCache) {
      const cached = weatherCache.get(queryCity);
      if (cached) {
        setWeather(cached);
        setActiveCity(cached.city);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);

    try {
      const url = `${apiBaseUrl}/weather?city=${encodeURIComponent(queryCity)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      setWeather(data);
      setActiveCity(data.city);
      
      // Save to client cache
      weatherCache.set(data.city, data);
    } catch (err: any) {
      setError(err.message || 'Error loading weather');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load only
  useEffect(() => {
    fetchWeather(activeCity);
  }, []);

  const handleSelectCity = (city: CityOption) => {
    setCityInput(city.name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    fetchWeather(city.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || matchingCities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < matchingCities.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : matchingCities.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = matchingCities[highlightedIndex];
      if (selected) {
        handleSelectCity(selected);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (cityInput.trim()) {
      // Force refresh on explicit user submit
      fetchWeather(cityInput, true);
    }
  };

  const getWeatherIcon = (condition: string, size: string = 'w-8 h-8') => {
    switch (condition.toLowerCase()) {
      case 'thunderstorm':
        return <CloudLightning className={`${size} text-amber-400 animate-pulse`} />;
      case 'drizzle':
      case 'rain':
        return <CloudRain className={`${size} text-blue-400`} />;
      case 'snow':
        return <CloudSnow className={`${size} text-cyan-200`} />;
      case 'clouds':
      case 'mist':
      case 'fog':
      case 'haze':
        return <Cloud className={`${size} text-slate-300`} />;
      case 'clear':
      default:
        return <Sun className={`${size} text-amber-400 animate-spin-slow`} />;
    }
  };

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  return (
    <div className="relative z-40 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl mb-6 shadow-xl transition-all">
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!isCollapsed ? 'mb-4' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Weather
              </h2>
              <p className="text-xs text-slate-400">
                Powered by OpenWeather
              </p>
            </div>

            {/* In Collapsed State: Display Mini Temperature & Condition Badge */}
            {isCollapsed && weather && (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-800">
                {getWeatherIcon(weather.condition, 'w-5 h-5')}
                <span className="text-sm font-bold text-slate-100">
                  {displayTemp(weather.temp)}°{unit}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline capitalize">
                  • {weather.city}, {weather.country} ({weather.description})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setUnit('C')}
              className={`px-2 py-1 rounded-md transition-all ${unit === 'C' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-2 py-1 rounded-md transition-all ${unit === 'F' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              °F
            </button>
          </div>

          {/* Search Form with Debounced Input & City Autocomplete Dropdown */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
            <div ref={searchContainerRef} className="relative z-50">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setShowDropdown(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => {
                  if (matchingCities.length > 0) setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="City..."
                className="w-32 sm:w-44 bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />

              {/* City Suggestions Dropdown Menu */}
              {showDropdown && matchingCities.length > 0 && (
                <div className="absolute top-full right-0 mt-1.5 w-52 sm:w-60 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden py-1 z-[100] animate-in fade-in duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800/80">
                    Suggested Cities
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {matchingCities.map((city, idx) => (
                      <button
                        key={`${city.name}-${city.country}-${idx}`}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          highlightedIndex === idx
                            ? 'bg-indigo-600/30 text-white font-medium border-l-2 border-indigo-500'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 font-medium truncate">
                          <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                          {city.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2 font-normal flex-shrink-0">
                          {city.country}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              title="Force Refresh Weather Data"
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </form>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Weather Widget' : 'Collapse Weather Widget'}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all ml-1"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error state */}
      {!isCollapsed && error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchWeather('London', true)}
            className="underline hover:text-white ml-2"
          >
            Reset
          </button>
        </div>
      )}

      {/* Weather Content Grid (Shown when Expanded) */}
      {!isCollapsed && weather && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              {getWeatherIcon(weather.condition)}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-100">
                  {displayTemp(weather.temp)}°{unit}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium capitalize">
                {weather.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Location</p>
              <p className="text-sm font-semibold text-slate-200">
                {weather.city}, {weather.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Humidity</p>
              <p className="text-sm font-semibold text-slate-200">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Wind Speed</p>
              <p className="text-sm font-semibold text-slate-200">{weather.windSpeed} m/s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

