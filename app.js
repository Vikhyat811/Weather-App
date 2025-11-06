// app.js — WeatherAPI frontend with C++ WebAssembly (emscripten embind) integration
// Assumes weather_wasm.js was loaded and provides createWeatherModule()

let WASMModulePromise = null;
let WASM = null; // resolved Module

// Initialize WASM module right away
if (typeof createWeatherModule === 'function') {
  WASMModulePromise = createWeatherModule(); // returns Promise resolving to Module
  WASMModulePromise.then(mod => {
    WASM = mod;
    console.log("WASM module ready");
  }).catch(err => {
    console.error("WASM failed to load:", err);
  });
} else {
  console.warn("createWeatherModule not found. Did you include weather_wasm.js?");
}

// WeatherData wrapper in JS that can either use WASM or fallback to pure-JS methods
class WeatherData {
  constructor(jsData) {
    // jsData is the JSON object returned by WeatherAPI
    this._js = jsData;
    this.city = jsData.location.name;
    this.country = jsData.location.country;
    this.tempC = jsData.current.temp_c;
    this.tempF = jsData.current.temp_f;
    this.feelsC = jsData.current.feelslike_c;
    this.feelsF = jsData.current.feelslike_f;
    this.humidity = jsData.current.humidity;
    this.windKph = jsData.current.wind_kph;
    this.desc = jsData.current.condition.text;
    this.icon = jsData.current.condition.icon;

    // If WASM is available we will create a WASM-backed object for conversions & formatted strings
    this._wasmInstance = null;
    if (WASM) {
      try {
        const W = WASM.Weather; // embind-exposed constructor
        this._wasmInstance = new W();
        // setData(city, country, tempC, feelsC, humidity, windKph, desc)
        this._wasmInstance.setData(this.city, this.country, this.tempC, this.feelsC, this.humidity, this.windKph, this.desc);
      } catch (e) {
        console.error("Failed to create WASM Weather object:", e);
        this._wasmInstance = null;
      }
    }
  }

  // prefer WASM formatted strings if available
  tempString(useF = false) {
    if (this._wasmInstance) {
      return useF ? this._wasmInstance.tempFString() : this._wasmInstance.tempCString();
    }
    return useF ? `${this.tempF} °F` : `${this.tempC} °C`;
  }

  feelsString(useF = false) {
    if (this._wasmInstance) {
      return useF ? this._wasmInstance.feelsFString() : this._wasmInstance.feelsCString();
    }
    return useF ? `${this.feelsF} °F` : `${this.feelsC} °C`;
  }

  location() {
    if (this._wasmInstance) {
      return this._wasmInstance.location();
    }
    return `${this.city}, ${this.country}`;
  }

  description() {
    if (this._wasmInstance) {
      return this._wasmInstance.description();
    }
    return this.desc;
  }
}

// The rest of the app: UI wiring (same UI you already have)
class WeatherApp {
  constructor() {
    this.apiKey = ""; // WeatherAPI key
    this.baseUrl = "";

    this.cityInput = document.querySelector("#cityInput");
    this.searchBtn = document.querySelector("#searchBtn");
    this.unitToggle = document.querySelector("#unitToggle");
    this.result = document.querySelector("#result");
    this.error = document.querySelector("#error");
    this.loader = document.querySelector("#loader");

    this.searchBtn.addEventListener("click", () => this.search());
    this.cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.search();
    });
    this.unitToggle.addEventListener("change", () => this.updateUI());

    // If WASMModulePromise not yet ready, we can still run, but if user requests conversion before WASM ready we'll fallback
    if (WASMModulePromise) {
      WASMModulePromise.then(mod => {
        // re-create any previous weather JS objects using WASM (if you want)
        // (we don't have previous ones at init)
      }).catch(()=>{/* ignore */});
    }
  }

  async search() {
    const city = this.cityInput.value.trim();
    if (!city) return this.showError("Please enter a city name.");

    this.toggleLoader(true);
    this.hideError();

    try {
      const data = await this.fetchWeather(city);
      this.weather = new WeatherData(data);
      this.updateUI();
    } catch (err) {
      this.showError("⚠️ " + err.message);
    } finally {
      this.toggleLoader(false);
    }
  }

  async fetchWeather(city) {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("City not found or API error.");
    }
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json;
  }

  updateUI() {
    if (!this.weather) return;
    const useF = this.unitToggle.checked;

    document.querySelector("#icon").src = "https:" + this.weather._js.current.condition.icon;
    document.querySelector("#location").textContent = this.weather.location();
    document.querySelector("#desc").textContent = this.weather.description();
    document.querySelector("#temp").textContent = this.weather.tempString(useF);
    document.querySelector("#feels").textContent = this.weather.feelsString(useF);
    document.querySelector("#humidity").textContent = this.weather.humidity + " %";
    document.querySelector("#wind").textContent = this.weather.windKph + " km/h";

    this.result.classList.remove("hidden");
  }

  showError(msg) {
    this.error.textContent = msg;
    this.error.classList.remove("hidden");
    this.result.classList.add("hidden");
  }

  hideError() {
    this.error.classList.add("hidden");
  }

  toggleLoader(show) {
    this.loader.classList.toggle("hidden", !show);
  }
}

// Initialize app only after DOM loaded (WASM loading may still be in progress)
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WeatherApp();
});

