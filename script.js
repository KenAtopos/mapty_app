"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = (date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 823);
// console.log(run1, cycling1);

class App {
  #map;
  #mapEvent;

  constructor() {
    this.#getPosition();
    form.addEventListener("submit", this.#newWorkout.bind(this)); // here the bind is because in this event handler function, this keyword refer to the element, namely form in this situation, by binding the this keyword, can set it to the app itself
    inputType.addEventListener("change", this.#toggleElevationField);
  }

  #getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          alert("Could not get the position!");
        }
      );
    }
  }

  #loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 13);
    //   console.log(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this.#showForm.bind(this)); // here same, before this was set to the map, bind this to make it set to app itself
  }

  #showForm(event) {
    this.#mapEvent = event;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  #toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  #newWorkout(event) {
    event.preventDefault();

    // clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    // display the marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();
