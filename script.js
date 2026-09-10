"use strict";

async function getWeather(chosenDate) {
  let response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=55.67594&longitude=12.56553&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&start_date=${chosenDate}&end_date=${chosenDate}&models=dmi_seamless`,
  );
  return await response.json();
}

async function writeWeatherToHTML() {
  const weather = await getWeather(date.value);
  console.log(weather);
  document.querySelector(".weather").textContent = weather.daily.weather_code[0];
}

const weatherCodes = [
  { code: 0, description: "Clear sky" },

  { code: 1, description: "Mainly clear" },
  { code: 2, description: "Partly cloudy" },
  { code: 3, description: "Overcast" },

  { code: 45, description: "Fog" },
  { code: 48, description: "Depositing rime fog" },

  { code: 51, description: "Drizzle: Light intensity" },
  { code: 53, description: "Drizzle: Moderate intensity" },
  { code: 55, description: "Drizzle: Dense intensity" },

  { code: 56, description: "Freezing Drizzle: Light intensity" },
  { code: 57, description: "Freezing Drizzle: Dense intensity" },

  { code: 61, description: "Rain: Slight intensity" },
  { code: 63, description: "Rain: Moderate intensity" },
  { code: 65, description: "Rain: Heavy intensity" },

  { code: 66, description: "Freezing Rain: Light intensity" },
  { code: 67, description: "Freezing Rain: Heavy intensity" },

  { code: 71, description: "Snow fall: Slight intensity" },
  { code: 73, description: "Snow fall: Moderate intensity" },
  { code: 75, description: "Snow fall: Heavy intensity" },

  { code: 77, description: "Snow grains" },

  { code: 80, description: "Rain showers: Slight" },
  { code: 81, description: "Rain showers: Moderate" },
  { code: 82, description: "Rain showers: Violent" },

  { code: 85, description: "Snow showers: Slight" },
  { code: 86, description: "Snow showers: Heavy" },

  { code: 95, description: "Thunderstorm: Slight or moderate" },

  { code: 96, description: "Thunderstorm with slight hail" },
  { code: 99, description: "Thunderstorm with heavy hail" },
];

const btnAddTodo = document.getElementById("btnAddTodo");
const todos = [];
const date = document.querySelector("#date");
date.value = new Date().toISOString().slice(0, 10);

btnAddTodo.addEventListener("click", handleAddTodo);

async function handleAddTodo() {
  const input = document.getElementById("todoText");
  const todoTextInput = input.value;
  const outdoorCheck = document.querySelector(".outdoor");

  if (todoTextInput.trim() === "") {
    console.log("Please add text");
    return;
  }

  let todo = {
    text: todoTextInput,
    date: date.value,
    completed: false,
    outdoor: outdoorCheck.checked,
    weather: "It's indoors",
  };

  if (outdoorCheck.checked) {
    const weatherData = await getWeather(date.value);
    const weatherCode = weatherData.daily.weather_code[0];
    const matchedWeather = weatherCodes.find((weather) => weather.code === weatherCode);
    todo.weather = matchedWeather ? matchedWeather.description : "Unknown weather";
  }

  todos.push(todo);

  input.value = "";
  outdoorCheck.checked = false;

  console.log(todos);

  listAllToDos();
}

function listAllToDos() {
  const taskContainer = document.querySelector(".contentToDos");
  const doneContainer = document.querySelector(".toDosDone");
  taskContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  todos.forEach((todo, index) => {
    const contentToDos = document.createElement("div");
    contentToDos.classList.add("todoListed");

    contentToDos.innerHTML = `
    <div class="myToDo">
      <p class="taskDesc">${todo.text}</p>
      <p class="taskDate">${todo.date}</p>
      <p class="weather">${todo.weather}</p>
      <br />
      <button class="taskDelete">Delete</button>
      <button class="taskCheck">Done</button>
    </div>
    `;

    const deleteButton = contentToDos.querySelector(".taskDelete");

    deleteButton.addEventListener("click", function () {
      todos.splice(index, 1);
      listAllToDos();
      console.log(todos);
    });

    const taskCheck = contentToDos.querySelector(".taskCheck");
    const taskDesc = contentToDos.querySelector(".taskDesc");

    if (todo.completed) {
      taskDesc.classList.add("lineThrough");
    }

    taskCheck.addEventListener("click", function () {
      todo.completed = !todo.completed;

      listAllToDos();
    });

    if (todo.completed) {
      doneContainer.appendChild(contentToDos);
    } else {
      taskContainer.appendChild(contentToDos);
    }
  });
}
