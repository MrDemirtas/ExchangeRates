let API_KEY = "ee3699df609ad3cee153d7e6"; // Exchange Rate API Key https://www.exchangerate-api.com/

let exchangeRates; // Para birimleri kodu
let currencyNames; // Para birimleri ismi
let conversionRates; // Para birimleri değeri
let selectedRate = "USD"; // Varsayılan para birimi

// #rateCount input elementinin değeri değiştiğinde updateExhcangeList fonksiyonunu çalıştır
document.getElementById("rateCount").addEventListener("keyup", () => {
  updateExhcangeList();
});

// #selectedRate select elementinin değeri değiştiğinde çalışır.
document.getElementById("selectedRate").addEventListener("change", () => {
  selectedRate = document.getElementById("selectedRate").value; // Varsayılan para birimini seçilen para birimi değişkenine ata.
  run();
});

// Para birimleri bilgileri fetch işlemi
fetchData("/assets/json/currencyNames.json")
  .then((response) => {
    for (const key in response) {
      document.getElementById("selectedRate").innerHTML += `<option value="${key}">${response[key].currencyName}</option>`;
      document.getElementById("exchangeRates").innerHTML += `
        <div class="rateCard rateCard${key}">
          <img src="https://flagcdn.com/${response[key]["country"].toLowerCase()}.svg" />
          <div class="exchangeRateInfo">
            <span id="exchangeRateName">${response[key].currencyName}</span>
            <span id="conversionRate${key}" class="conversionRate ${key}">1</span>
          </div>
        </div>
        `;
    }
    document.getElementById("selectedRate").value = selectedRate;
    run();
  })
  .catch((error) => {
    console.log(error);
  });

// Para birimi değer karşılığı fetch işleni
function run() {
  fetchData(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${selectedRate}`)
    .then((response) => {
      conversionRates = response["conversion_rates"]; // Para birimlerinin değerlerini değişkene ata
      for (const key in response["conversion_rates"]) {
        try {
          document.getElementById(`conversionRate${key}`).innerText = `${response["conversion_rates"][key].toFixed(2)} ${key}`; // Para birimi değerini iki ondalık basamaklı olarak ilgili yere yazdır.
        } catch (error) {
          console.log(error);
        }
      }
      document.getElementById("rateCountCrunncy").innerText = selectedRate;
      updateExhcangeList();
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateExhcangeList() {
  let rateCount = document.getElementById("rateCount").value; // #rateCount elementindeki sayıyı değişkene ata
  const conversionRateElements = document.querySelectorAll(".conversionRate"); // HTML sayfasındaki tüm .conversionRate class isimli elementleri dizi olarak değişkene ata

  conversionRateElements.forEach((element) => {
    element.innerText = `${(conversionRates[element.classList[1]] * rateCount).toFixed(2)} ${element.classList[1]}`; // Para değer karşılığını güncelle
  });
}

async function fetchData(uri) {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error("error");
  }
  return await response.json();
}
