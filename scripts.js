const form = document.getElementById("converterForm");
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertedAmount = document.getElementById("convertedAmount");
const loading = document.querySelector(".loading");
const result = document.querySelector(".result");
const error = document.querySelector(".error");

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

// Função de conversão
async function convertMoney() {
    loading.style.display = "block";
    error.style.display = "none";
    result.style.display = "none";

    try {
        const response = await fetch(API_URL + fromCurrency.value);

        // Tratamento caso a API falhe
        if (!response.ok) {
            throw new Error("Erro ao buscar dados da API.");
        }

        const data = await response.json();

        // Verifica se existe a moeda de destino
        if (!data.rates[toCurrency.value]) {
            throw new Error("Moeda não encontrada.");
        }

        const rate = data.rates[toCurrency.value];
        const convertedValue = (amount.value * rate).toFixed(2);

        convertedAmount.value = convertedValue;

        result.style.display = "block";
        result.innerHTML = `
            <div style="font-size: 1.4rem;">
                ${amount.value} ${fromCurrency.value} = ${convertedAmount.value} ${toCurrency.value}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px">
                Taxa: 1 ${fromCurrency.value} = ${rate} ${toCurrency.value}
            </div>
        `;
    } catch (err) {
        console.error(err);
        error.style.display = "block";
        error.innerHTML = `Falha ao converter moeda! Tente novamente.`;
    }

    loading.style.display = "none";
}

// Evento de submit do formulário
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (amount.value && amount.value > 0) {
        convertMoney();
    } else {
        error.style.display = "block";
        error.innerHTML = "Digite um valor válido para converter.";
    }
});
