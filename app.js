const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;
const AUTHOR = "Mateusz Olszewski";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const cities = [
    { country: "Poland", city: "Warsaw", lat: 52.23, lon: 21.01 },
    { country: "Poland", city: "Krakow", lat: 50.06, lon: 19.94 },
    { country: "Poland", city: "Gdansk", lat: 54.35, lon: 18.65 },
    { country: "Poland", city: "Wroclaw", lat: 51.11, lon: 17.03 },

    { country: "Germany", city: "Berlin", lat: 52.52, lon: 13.41 },
    { country: "Germany", city: "Munich", lat: 48.13, lon: 11.58 },
    { country: "Germany", city: "Hamburg", lat: 53.55, lon: 9.99 },

    { country: "France", city: "Paris", lat: 48.85, lon: 2.35 },
    { country: "France", city: "Lyon", lat: 45.76, lon: 4.84 },
    { country: "France", city: "Marseille", lat: 43.30, lon: 5.37 },

    { country: "Italy", city: "Rome", lat: 41.90, lon: 12.49 },
    { country: "Italy", city: "Milan", lat: 45.46, lon: 9.19 },
    { country: "Italy", city: "Venice", lat: 45.44, lon: 12.33 },

    { country: "Spain", city: "Madrid", lat: 40.41, lon: -3.70 },
    { country: "Spain", city: "Barcelona", lat: 41.38, lon: 2.17 },

    { country: "United Kingdom", city: "London", lat: 51.50, lon: -0.12 },
    { country: "United Kingdom", city: "Manchester", lat: 53.48, lon: -2.24 },

    { country: "USA", city: "New York", lat: 40.71, lon: -74.00 },
    { country: "USA", city: "Los Angeles", lat: 34.05, lon: -118.24 },
    { country: "USA", city: "Chicago", lat: 41.88, lon: -87.63 },

    { country: "Japan", city: "Tokyo", lat: 35.68, lon: 139.69 },
    { country: "Japan", city: "Osaka", lat: 34.69, lon: 135.50 },

    { country: "Australia", city: "Sydney", lat: -33.86, lon: 151.20 },

    { country: "Canada", city: "Toronto", lat: 43.65, lon: -79.38 },

    { country: "Brazil", city: "Rio de Janeiro", lat: -22.90, lon: -43.20 }
];

console.log("================================");
console.log(`Data uruchomienia: ${new Date().toISOString()}`);
console.log(`Autor: ${AUTHOR}`);
console.log(`Aplikacja nasłuchuje na porcie TCP: ${PORT}`);
console.log("================================");

app.get("/", (req, res) => {
    res.render("index", {
        cities,
        weather: null
    });
});

app.post("/weather", async (req, res) => {
    const selected = cities.find(
        c => c.city === req.body.city
    );

    if (!selected) {
        return res.redirect("/");
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selected.lat}&longitude=${selected.lon}&current_weather=true`;

        const response = await axios.get(url);

       const weather = response.data.current_weather;

res.render("index", {
    cities,
    weather: {
        city: selected.city,
        country: selected.country,
        temperature: weather.temperature,
        windspeed: weather.windspeed,
        winddirection: weather.winddirection,
        time: weather.time
    }
});

    } catch (err) {
        res.send("Błąd pobierania pogody");
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
//docker run -d -p 3000:3000 --name weather-container2 weather-app
//docker ps