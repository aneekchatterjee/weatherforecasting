import React, { useState } from "react";

function App() {
  const [weather, setWeather] = useState({
    city: "",
    temp: "",
    condition: "",
    humidity: "",
    icon: ""
  });

  const generateWeather = () => {
    const cities = ["Chennai", "Delhi", "Mumbai", "Kolkata", "Bengaluru"];

    const conditions = [
      { name: "Sunny", icon: "01d" },
      { name: "Cloudy", icon: "03d" },
      { name: "Rainy", icon: "09d" },
      { name: "Clear Sky", icon: "01n" },
      { name: "Thunderstorm", icon: "11d" }
    ];

    const city = cities[Math.floor(Math.random() * cities.length)];
    const condition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 15) + 20;
    const humidity = Math.floor(Math.random() * 40) + 40;

    setWeather({
      city: city,
      temp: `Temperature: ${temperature} °C`,
      condition: `Condition: ${condition.name}`,
      humidity: `Humidity: ${humidity}%`,
      icon: `https://openweathermap.org/img/wn/${condition.icon}@2x.png`
    });
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.heading}>Weather Forecast</h1>
      <p><em>Random Weather Data Simulation</em></p>

      <div style={styles.box}>
        <button style={styles.button} onClick={generateWeather}>
          Generate Weather
        </button>

        <h2>{weather.city}</h2>
        {weather.icon && <img src={weather.icon} alt="weather icon" />}
        <p>{weather.temp}</p>
        <p>{weather.condition}</p>
        <p>{weather.humidity}</p>
      </div>

      <footer style={styles.footer}>
        ANEEK CHATTERJEE | MAYANK YADAV <br />
        © 2026 Weather Demo (Random Data)
      </footer>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to bottom, #87ceeb, #ffffff)",
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh"
  },
  heading: {
    color: "#003366"
  },
  box: {
    background: "rgb(86, 157, 5)",
    width: "320px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.2)"
  },
  button: {
    padding: "10px 18px",
    backgroundColor: "#4590da",
    color: "rgb(18, 8, 8)",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px"
  }
};

export default App;
