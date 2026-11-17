const formularz = document.querySelector("#formularz-kontaktowy");
const komunikat = document.querySelector("#komunikat-formularza");
const powiadomienie = document.querySelector("#powiadomienie");
let timerPowiadomienia;

function pokazPowiadomienie(tekst) {
  powiadomienie.textContent = tekst;
  powiadomienie.classList.add("widoczne");

  clearTimeout(timerPowiadomienia);
  timerPowiadomienia = setTimeout(() => {
    powiadomienie.classList.remove("widoczne");
  }, 4000);
}

formularz.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const wzorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!wzorEmail.test(email)) {
    komunikat.textContent = "Podaj poprawny adres e-mail";
    komunikat.style.color = "#7e1a14";
    return;
  }

  komunikat.textContent = "";
  pokazPowiadomienie("Formularz został wysłany. Dziękuję za wiadomość!");
  formularz.reset();
});
