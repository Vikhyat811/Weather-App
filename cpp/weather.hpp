#include <string>

class Weather {
private:
    std::string city;
    double temperatureC;
    std::string condition;
    int humidity;
    double windSpeed;

public:
    Weather(std::string cityName);

    bool fetchWeatherData(const std::string& apiKey);
    void displayWeather() const;

    double getTempC() const { return temperatureC; }
    double getTempF() const { return (temperatureC * 9 / 5) + 32; }
    std::string getCondition() const { return condition; }
    int getHumidity() const { return humidity; }
    double getWindSpeed() const { return windSpeed; }
};
