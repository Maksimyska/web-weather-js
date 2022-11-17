const linkTime = "https://proxy.cors.sh/https://timeapi.io/api/Time/current/coordinate?latitude="
const link = "https://proxy.cors.sh/http://api.openweathermap.org/data/2.5/weather?";
const api = "0c9127678dcbb8fb8f0e7838462ce731"
const root = document.getElementById('add')
var elemCount = 0

button__city__input.onclick = function () {
    var val = document.getElementById('city__input').value;
    fetchDataCity(val)
    document.getElementById('city__input').value = "";
};

button__coor__input.onclick = function () {
    var lon = document.getElementById('lon__input').value;
    var lat = document.getElementById('lat__input').value;
    fetchDataCoor(lon, lat)

    var lon = document.getElementById('lon__input').value = "";
    var lat = document.getElementById('lat__input').value = "";
};

let store = {
    name: "Нью-Йорк",
    lat: 56,
    lon: 60,
    feels_like: -4.02,
    pressure: 1019,
    temp: -0.88,
    humidity: 77,
    description: "light snow",
};

let storeTime = {
    date: "11.15.2022",
    time: "22:06",
    dayOfWeek: "Tuesday"
}

// Поиск, если введено название города
const fetchDataCity = async (city) => {
    try {
        const result = await fetch(`${link}q=${city}&type=like&APPID=${api}&units=metric&lang=ru`);
        const data = await result.json();

        const { name, coord: { lat, lon, }, main: { feels_like, humidity, pressure, temp, },
            weather: { 0: { description } }, wind: { speed, }, } = data;
        store = { ...store, lat, lon, name, feels_like, humidity, pressure, temp, description, speed };

        const resultTime = await fetch(`${linkTime}${lat}&longitude=${lon}`)
        const dataTime = await resultTime.json();

        const { date, time, dayOfWeek } = dataTime
        storeTime = { ...storeTime, date, time, dayOfWeek }

        createMap(lat, lon)
        getInfo()
    } catch (error) {
        console.log(error)
    }
}


// Поиск, если введены координаты
const fetchDataCoor = async (lon, lat) => {
    try {
        const result = await fetch(`${link}lat=${lat}&lon=${lon}&appid=${api}&units=metric&lang=ru`);
        const data = await result.json();

        const { name, main: { feels_like, humidity, pressure, temp, },
            weather: { 0: { description } }, wind: { speed, }, } = data;
        store = { ...store, lat, lon, name, feels_like, humidity, pressure, temp, description, speed };

        const resultTime = await fetch(`${linkTime}${lat}&longitude=${lon}`)
        const dataTime = await resultTime.json();

        const { date, time, dayOfWeek } = dataTime
        storeTime = { ...storeTime, date, time, dayOfWeek }

        createMap(lat, lon)
        getInfo()
    } catch (error) {
        console.log(error)
    }
}

// Добавление картинок, в зависимости от описания
const getImage = (description) => {
    const value = description.toLowerCase();

    switch (value) {
        case "пасмурно":
        case "небольшая облачность":
            return "../img/cloud.png";
        case "переменная облачность":
        case "облачно с прояснениями":
        case "облачность":
            return "../img/partly.png";
        case "плотный туман":
        case "туман":
            return "../img/fog.png";
        case "ясно":
            return "../img/sunny.png";
        case "clear":
            return "../img/clear.png";
        case "небольшой снег":
        case "небольшой снегопад":
        case "снег":
            return "../img/snow.svg";
        case "дождь":
        case "небольшой дождь":
            return "../img/rain.svg"
        case "гроза":
            return "../img/thunderstorm.svg"
        default:
            return "../img/the.png";
    }
};

// Перевод
const getDate = (date) => {
    const value = date.toLowerCase();

    switch (value) {
        case "monday":
            return "Понедельник"
        case "tuesday":
            return "Вторник"
        case "wednesday":
            return "Среда"
        case "thursday":
            return "Четверг"
        case "friday":
            return "Пятница"
        case "saturday":
            return "Суббота"
        case "sunday":
            return "Воскресенье"
    }
}

// Вывод данных на экран
const getInfo = () => {
    const { name, feels_like, humidity, pressure, temp, speed, description } = store
    const { date, time, dayOfWeek } = storeTime

    document.getElementById('city').innerHTML = name;
    document.getElementById('temp').innerHTML = `${Math.round(temp)} °C`;
    document.getElementById('speed').innerHTML = `${speed} м/c`;
    document.getElementById('info__time').innerHTML = `${(time)}`;
    document.getElementById('info__date').innerHTML = `${date}`;
    document.getElementById('humidity').innerHTML = `${humidity} %`;
    document.getElementById('pressure').innerHTML = `${pressure} мм рт.ст.`;
    document.getElementById('info__desc').innerHTML = `${ucFirst(description)}`;
    document.getElementById('info__dayOTW').innerHTML = `${getDate(dayOfWeek)}`;
    document.getElementById('temp__description').src = `${getImage(description)}`;
}

const createMap = async (lat, lon) => {
    try {
        const maps = await ymaps.load();
        const app = document.getElementById("app")
        const mapContainer = document.createElement("div");
        mapContainer.className = "app__map"
        mapContainer.style.height = "512px";
        mapContainer.style.width = "512px";
        app.appendChild(mapContainer);
        new maps.Map(mapContainer, {
            center: [lat, lon],
            zoom: 8
        });
        elemCount += 1
        console.log(elemCount);
        deleteMap()
    } catch (error) {
        console.error("Something went wrong", error);
    }
};


const deleteMap = () => {
    const app = document.getElementById("app")
    let b = document.querySelector(".app__map")
    if (elemCount >= 2) {
        app.removeChild(b)
        elemCount = 1
    }
}

function ucFirst(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

//Добавление виджетов с погодой
button__ok.onclick = function createWeather() {
    const { name, temp, description } = store
    const { date, time, dayOfWeek } = storeTime


    let add = document.querySelector("section.add")
    let div = document.createElement('div')
    div.className = 'add__weather__list'
    div.innerHTML = (`
        <div>
            <p class="add__city" id="add__city">${name}</p>
        </div>
        <div class="date">
            <p class="add__dayOTW" id="add__dayOTW">${getDate(dayOfWeek)}</p>
            <p class="add__date" id="add__date">${date}</p>
            <p class="add__time" id="add__time">${time}</p>
        </div>
        <p class="add__desc" id="add__desc">${description}</p>
        <p class="add__weather" id="add__weather">${Math.round(temp)} °C</p>
    `)

    add.appendChild(div)
}


fetchDataCity("Екатеринбург")