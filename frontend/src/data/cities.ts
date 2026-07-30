export interface CityOption {
  name: string;
  country: string;
  region?: string;
}

export const POPULAR_CITIES: CityOption[] = [
  // Pakistan
  { name: 'Islamabad', country: 'Pakistan' },
  { name: 'Karachi', country: 'Pakistan' },
  { name: 'Lahore', country: 'Pakistan' },
  { name: 'Rawalpindi', country: 'Pakistan' },
  { name: 'Peshawar', country: 'Pakistan' },
  { name: 'Quetta', country: 'Pakistan' },
  { name: 'Multan', country: 'Pakistan' },
  { name: 'Faisalabad', country: 'Pakistan' },
  { name: 'Sialkot', country: 'Pakistan' },
  { name: 'Gujranwala', country: 'Pakistan' },
  { name: 'Hyderabad', country: 'Pakistan' },
  { name: 'Abbottabad', country: 'Pakistan' },
  { name: 'Murree', country: 'Pakistan' },
  { name: 'Skardu', country: 'Pakistan' },
  { name: 'Gilgit', country: 'Pakistan' },

  // Turkey & Middle East
  { name: 'Istanbul', country: 'Turkey' },
  { name: 'Ankara', country: 'Turkey' },
  { name: 'Izmir', country: 'Turkey' },
  { name: 'Iskenderun', country: 'Turkey' },
  { name: 'Isfahan', country: 'Iran' },
  { name: 'Tehran', country: 'Iran' },
  { name: 'Dubai', country: 'United Arab Emirates' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates' },
  { name: 'Doha', country: 'Qatar' },
  { name: 'Riyadh', country: 'Saudi Arabia' },
  { name: 'Jeddah', country: 'Saudi Arabia' },
  { name: 'Mecca', country: 'Saudi Arabia' },
  { name: 'Medina', country: 'Saudi Arabia' },
  { name: 'Muscat', country: 'Oman' },

  // Europe
  { name: 'London', country: 'United Kingdom' },
  { name: 'Paris', country: 'France' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Munich', country: 'Germany' },
  { name: 'Frankfurt', country: 'Germany' },
  { name: 'Rome', country: 'Italy' },
  { name: 'Milan', country: 'Italy' },
  { name: 'Madrid', country: 'Spain' },
  { name: 'Barcelona', country: 'Spain' },
  { name: 'Amsterdam', country: 'Netherlands' },
  { name: 'Brussels', country: 'Belgium' },
  { name: 'Vienna', country: 'Austria' },
  { name: 'Innsbruck', country: 'Austria' },
  { name: 'Zurich', country: 'Switzerland' },
  { name: 'Geneva', country: 'Switzerland' },
  { name: 'Stockholm', country: 'Sweden' },
  { name: 'Oslo', country: 'Norway' },
  { name: 'Copenhagen', country: 'Denmark' },
  { name: 'Helsinki', country: 'Finland' },
  { name: 'Dublin', country: 'Ireland' },
  { name: 'Prague', country: 'Czech Republic' },
  { name: 'Budapest', country: 'Hungary' },
  { name: 'Warsaw', country: 'Poland' },
  { name: 'Athens', country: 'Greece' },
  { name: 'Istanbul', country: 'Turkey' },
  { name: 'Moscow', country: 'Russia' },

  // Americas
  { name: 'New York', country: 'United States' },
  { name: 'Los Angeles', country: 'United States' },
  { name: 'Chicago', country: 'United States' },
  { name: 'San Francisco', country: 'United States' },
  { name: 'Washington D.C.', country: 'United States' },
  { name: 'Miami', country: 'United States' },
  { name: 'Seattle', country: 'United States' },
  { name: 'Houston', country: 'United States' },
  { name: 'Dallas', country: 'United States' },
  { name: 'Boston', country: 'United States' },
  { name: 'Toronto', country: 'Canada' },
  { name: 'Vancouver', country: 'Canada' },
  { name: 'Montreal', country: 'Canada' },
  { name: 'Mexico City', country: 'Mexico' },
  { name: 'Sao Paulo', country: 'Brazil' },
  { name: 'Rio de Janeiro', country: 'Brazil' },
  { name: 'Buenos Aires', country: 'Argentina' },

  // Asia & Oceania
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Osaka', country: 'Japan' },
  { name: 'Kyoto', country: 'Japan' },
  { name: 'Seoul', country: 'South Korea' },
  { name: 'Beijing', country: 'China' },
  { name: 'Shanghai', country: 'China' },
  { name: 'Guangzhou', country: 'China' },
  { name: 'Hong Kong', country: 'Hong Kong' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Bangkok', country: 'Thailand' },
  { name: 'Kuala Lumpur', country: 'Malaysia' },
  { name: 'Jakarta', country: 'Indonesia' },
  { name: 'Manila', country: 'Philippines' },
  { name: 'Delhi', country: 'India' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Dhaka', country: 'Bangladesh' },
  { name: 'Colombo', country: 'Sri Lanka' },
  { name: 'Kathmandu', country: 'Nepal' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Melbourne', country: 'Australia' },
  { name: 'Brisbane', country: 'Australia' },
  { name: 'Auckland', country: 'New Zealand' },

  // Africa
  { name: 'Cairo', country: 'Egypt' },
  { name: 'Alexandria', country: 'Egypt' },
  { name: 'Casablanca', country: 'Morocco' },
  { name: 'Johannesburg', country: 'South Africa' },
  { name: 'Cape Town', country: 'South Africa' },
  { name: 'Nairobi', country: 'Kenya' },
  { name: 'Lagos', country: 'Nigeria' },
];

/**
 * Filter and sort cities matching search text.
 */
export function searchCities(query: string, maxResults: number = 8): CityOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Deduplicate by name
  const seen = new Set<string>();
  const matches: { city: CityOption; score: number }[] = [];

  for (const city of POPULAR_CITIES) {
    const cityNameLower = city.name.toLowerCase();
    const key = `${cityNameLower}_${city.country.toLowerCase()}`;
    if (seen.has(key)) continue;

    if (cityNameLower.startsWith(q)) {
      seen.add(key);
      matches.push({ city, score: 2 }); // Exact start match gets higher priority
    } else if (cityNameLower.includes(q) || city.country.toLowerCase().includes(q)) {
      seen.add(key);
      matches.push({ city, score: 1 });
    }
  }

  matches.sort((a, b) => b.score - a.score || a.city.name.localeCompare(b.city.name));
  return matches.slice(0, maxResults).map((m) => m.city);
}
