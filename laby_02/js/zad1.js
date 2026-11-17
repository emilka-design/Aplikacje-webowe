let sekundy = 0;
let idTimer = null;

const czas = document.getElementById("czas");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const start = document.getElementById("start");

function formatuj(s) {
  const min = Math.floor(s / 60);
  const sek = s % 60;
  if (min > 0) {
    return min + "min " + sek + "s";
  }
  return sek + "s";
}
start.addEventListener("click", function () {
  if (idTimer !== null) {
    x;
    return;
  }
  idTimer = setInterval(function () {
    sekundy = sekundy + 1;
    czas.textContent = formatuj(sekundy);
  }, 1000);
});
stop.addEventListener("click", function () {
  clearInterval(idTimer);
  idTimer = null;
});
reset.addEventListener("click", function () {
  clearInterval(idTimer);
  idTimer = null;
  sekundy = 0;
  czas.textContent = formatuj(sekundy);
});
