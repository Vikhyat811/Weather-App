# 🌦️ Weather App – Real-Time Weather Forecasting using Web and C++ OOP Design

## 🔍 Domain
**Web & Software Development (IoT and API Integration)**  

This project combines **web technologies** and **object-oriented C++ programming** to build a real-time weather forecasting application.  
It uses the [WeatherAPI.com](https://www.weatherapi.com) service to fetch **live weather data** and displays it in an interactive web interface.

---

## 🎯 Objective

To develop an **interactive, responsive, and real-time Weather Forecasting App** that:
- Fetches **real-time weather data** for any city.
- Demonstrates **C++ Object-Oriented Programming (OOP)** principles.
- Uses **API integration** between backend and frontend technologies.
- Provides a **user-friendly interface** to visualize weather details.

---

## 🧰 Tech Stack

| Layer                | Technology                                   | Purpose                                 |
|----------------------|----------------------------------------------|-----------------------------------------|
| **Frontend**         | HTML5, CSS3, JavaScript (ES6)                | Interface design & data visualization   |
| **Backend (OOP)**    | C++17                                        | Weather data modeling and JSON handling |
| **Networking**       | `libcurl`                                    | HTTP requests to WeatherAPI             |
| **JSON Parser**      | `nlohmann/json`                              | Parse and extract weather data          |
| **Build Tool**       | `Makefile`                                   | Compile and link C++ project            |
| **API Provider**     | [WeatherAPI.com](https://www.weatherapi.com) | Provides real-time weather information  |
| **Version Control**  | Git & GitHub                                 | Source code management and deployment   |

---

## 🏗️ System Architecture

### **Frontend Flow**
1. User enters a city name.
2. JavaScript sends an API request to **WeatherAPI** using `fetch()`.
3. The JSON response is parsed.
4. Weather data (temperature, humidity, etc.) is displayed dynamically.

### **Backend (C++ OOP Model)**
1. The `Weather` class encapsulates attributes like temperature, humidity, condition, etc.  
2. Using **libcurl**, the program requests JSON data from **WeatherAPI**.  
3. The response is parsed using **nlohmann/json.hpp**.  
4. Data is displayed using the class method `displayWeather()`.

---

## 🚀 Deployment Steps

### **A. Deploy using Vercel**
1. Go to [vercel.com](https://vercel.com/).  
2. Login with your GitHub account.  
3. Import this repository.  
4. Click **Deploy** — your project will be live instantly.  
   *(Vercel automatically redeploys on every Git commit.)*

NOTE: Put your WeatherAPI API key in `app.js`:
   ```js
   config.apiKey = 'YOUR_API_KEY_HERE';

### **B. Run the C++ Backend**
```bash
cd cpp
make
./weather_app
