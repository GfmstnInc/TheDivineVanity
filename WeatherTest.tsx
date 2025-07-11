import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Thermometer, Eye, Wind, Droplets, Gauge, Sun, Moon } from 'lucide-react';

interface WeatherData {
  status: string;
  message: string;
  location_tested: string;
  weather_data: {
    location: string;
    coordinates: string;
    temperature: number;
    feels_like: number;
    description: string;
    detailed_description: string;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_direction: number;
    cloudiness: number;
    visibility: string;
    sunrise: string;
    sunset: string;
  };
  vanessa_guidance: string;
  api_usage: {
    endpoint: string;
    credits_used: number;
    rate_limit: string;
  };
}

export default function WeatherTest() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testWeatherAPI = async (testLocation: string = location) => {
    if (!testLocation.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(`/api/weather/test/${encodeURIComponent(testLocation)}`);
      const data = await response.json();

      if (data.status === 'success') {
        setWeatherData(data);
      } else {
        setError(data.message || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  const quickTestLocations = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 
    'Dubai', 'Mumbai', 'São Paulo', 'Cairo', 'Moscow'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-divine-gold-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-playfair font-bold text-divine-gold-800">
            🌍 Global Weather Intelligence Test
          </h1>
          <p className="text-divine-gold-600">
            Test OpenWeather API integration with real data from any location worldwide
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-md border-divine-gold-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-divine-gold-600" />
              Weather Location Tester
            </CardTitle>
            <CardDescription>
              Enter any city name or try our quick test locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name (e.g., Paris, Tokyo, New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && testWeatherAPI()}
                disabled={loading}
                className="flex-1"
              />
              <Button 
                onClick={() => testWeatherAPI()} 
                disabled={loading || !location.trim()}
                className="bg-divine-gold-600 hover:bg-divine-gold-700 text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Weather'}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-divine-gold-600 font-medium">Quick Test Locations:</p>
              <div className="flex flex-wrap gap-2">
                {quickTestLocations.map((loc) => (
                  <Badge 
                    key={loc}
                    variant="outline"
                    className="cursor-pointer hover:bg-divine-gold-100 border-divine-gold-300"
                    onClick={() => testWeatherAPI(loc)}
                  >
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">⚠️ {error}</p>
            </CardContent>
          </Card>
        )}

        {weatherData && (
          <div className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-md border-divine-gold-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-divine-gold-600" />
                    {weatherData.location_tested}
                  </span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    ✅ API Working
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Coordinates: {weatherData.weather_data.coordinates}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Weather Display */}
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-divine-gold-700">
                    {weatherData.weather_data.temperature}°C
                  </div>
                  <div className="text-xl text-divine-gold-600 capitalize">
                    {weatherData.weather_data.description}
                  </div>
                  <div className="text-sm text-divine-gold-500">
                    Feels like {weatherData.weather_data.feels_like}°C
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-divine-gold-50 rounded-lg">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600">Humidity</div>
                      <div className="font-semibold">{weatherData.weather_data.humidity}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-divine-gold-50 rounded-lg">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Wind</div>
                      <div className="font-semibold">{weatherData.weather_data.wind_speed} km/h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-divine-gold-50 rounded-lg">
                    <Gauge className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Pressure</div>
                      <div className="font-semibold">{weatherData.weather_data.pressure} hPa</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-divine-gold-50 rounded-lg">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Visibility</div>
                      <div className="font-semibold">{weatherData.weather_data.visibility} km</div>
                    </div>
                  </div>
                </div>

                {/* Sun Times */}
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-sm text-gray-600">Sunrise</div>
                      <div className="font-semibold">{weatherData.weather_data.sunrise}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-sm text-gray-600">Sunset</div>
                      <div className="font-semibold">{weatherData.weather_data.sunset}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vanessa Guidance */}
            <Card className="bg-gradient-to-r from-divine-gold-100 to-cream-100 border-divine-gold-300">
              <CardHeader>
                <CardTitle className="text-divine-gold-800">
                  🌟 Vanessa's Sacred Weather Wisdom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-divine-gold-700 italic text-lg leading-relaxed">
                  {weatherData.vanessa_guidance}
                </p>
              </CardContent>
            </Card>

            {/* API Usage Info */}
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700 text-sm">API Usage Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <strong>Endpoint:</strong> {weatherData.api_usage.endpoint}
                  </div>
                  <div>
                    <strong>Credits Used:</strong> {weatherData.api_usage.credits_used}
                  </div>
                  <div>
                    <strong>Rate Limit:</strong> {weatherData.api_usage.rate_limit}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}