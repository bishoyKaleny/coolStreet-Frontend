import requests

api_url = "https://my.meteoblue.com/packages/current"
api_key = "EeDkuZvytb7YFUlh"
lat = 48.137154
lon = 11.576124

params = {
    'lat': lat,
    'lon': lon,
    'apikey': api_key,
}

response = requests.get(api_url, params=params)

if response.status_code == 200:
    weather_data = response.json()
    # Process the weather data as needed
    print(weather_data)
else:
    print(f"Error: {response.status_code}")
