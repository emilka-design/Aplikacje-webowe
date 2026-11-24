const poleFiltr = document.getElementById("filtr");
const poleSort = document.getElementById("sortowanie");
const tabela = document.getElementById("tabela");

let produkty = [];

function renderuj(lista) {
  tabela.innerHTML = "";

  lista.forEach(function (p) {
    const wiersz = document.createElement("tr");

    const komorkaZdjecie = document.createElement("td");
    const img = document.createElement("img");
    img.src = p.thumbnail;
    img.alt = p.title;
    img.width = 80;
    komorkaZdjecie.appendChild(img);

    const komorkaTytul = document.createElement("td");
    komorkaTytul.textContent = p.title;

    const komorkaOpis = document.createElement("td");
    komorkaOpis.textContent = p.description;

    wiersz.appendChild(komorkaZdjecie);
    wiersz.appendChild(komorkaTytul);
    wiersz.appendChild(komorkaOpis);
    tabela.appendChild(wiersz);
  });
}

function odswiez() {
  const fraza = poleFiltr.value.toLowerCase();

  const wynik = produkty.filter(function (p) {
    return p.title.toLowerCase().includes(fraza);
  });

  if (poleSort.value === "rosnaco") {
    wynik.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (poleSort.value === "malejaco") {
    wynik.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  }

  renderuj(wynik);
}

async function pobierz() {
  const odpowiedz = await fetch("https://dummyjson.com/products");
  const dane = await odpowiedz.json();
  produkty = dane.products.slice(0, 30);
  odswiez();
}

poleFiltr.addEventListener("input", odswiez);
poleSort.addEventListener("change", odswiez);

pobierz();
