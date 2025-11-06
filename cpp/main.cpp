#include "Weather.hpp"
#include <iostream>

int main() {
    std::string city;
    std::string apiKey = "YOUR_API_KEY_HERE";

    std::cout << "Enter city name: ";
    std::getline(std::cin, city);

    Weather w(city);

    if (w.fetchWeatherData(apiKey)) {
        w.displayWeather();
    } else {
        std::cerr << "Failed to fetch weather data.\n";
    }

    return 0;
}
