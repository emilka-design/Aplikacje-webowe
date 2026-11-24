const poleMin = document.getElementById("min");
const poleMax = document.getElementById("max");
const wielkie = document.getElementById("wielkie");
const specjalne = document.getElementById("specjalne");
const przyciskGeneruj = document.getElementById("generuj");

const MALE = "abcdefghijklmnopqrstuvwxyz";
const WIELKIE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPECJALNE = "!@#$%^&*";

function losowyZnak(tekst) {
  return tekst[Math.floor(Math.random() * tekst.length)];
}

przyciskGeneruj.addEventListener("click", function () {
  const mini = Number(poleMin.value);
  const maxi = Number(poleMax.value);

  if (mini < 1 || maxi < 1 || mini > maxi) {
    alert("Podaj poprawne wartosci");
    return;
  }

  const dlugosc = mini + Math.floor(Math.random() * (maxi - mini + 1));

  let pula = MALE;
  let haslo = "";

  if (wielkie.checked) {
    pula = pula + WIELKIE;
    haslo = haslo + losowyZnak(WIELKIE);
  }
  if (specjalne.checked) {
    pula = pula + SPECJALNE;
    haslo = haslo + losowyZnak(SPECJALNE);
  }

  while (haslo.length < dlugosc) {
    haslo = haslo + losowyZnak(pula);
  }

  haslo = haslo
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  alert(haslo);
});
