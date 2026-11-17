if (localStorage.getItem("motyw") === "ciemny") {
  document.documentElement.classList.add("ciemny");
}

document.addEventListener("DOMContentLoaded", function () {
  const przycisk = document.querySelector("#przelacz-motyw");

  function ustawIkone() {
    const ciemny = document.documentElement.classList.contains("ciemny");
    przycisk.textContent = ciemny ? "☀️" : "🌙";
  }

  ustawIkone();

  przycisk.addEventListener("click", function () {
    const ciemny = document.documentElement.classList.toggle("ciemny");
    localStorage.setItem("motyw", ciemny ? "ciemny" : "jasny");
    ustawIkone();
  });
});
