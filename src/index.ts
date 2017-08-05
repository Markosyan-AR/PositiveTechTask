import { getRates, CurrencyRate } from './service';

const selectedCart: ICartItem[] = [
    { price: 20 },
    { price: 45 },
    { price: 67 },
    { price: 1305 }
];

getRates()
    .done((rates: CurrencyRate[]) => {
        let totalCost = calculateTotalCost(rates, selectedCart);
        writeResult(totalCost);
    });

function calculateTotalCost(rates: CurrencyRate[], cart: ICartItem[]) {
    let orderSumm = cart.reduce((prev, curr) => prev + curr.price, 0);

    return rates.reduce((obj, currency) => {
        obj[currency.name] = orderSumm / currency.rate;
        return obj;
    }, {} as { [key: string]: number });
}

function writeResult(data: { [key: string]: number }) {
    for (let key in data) {
        $('ul').append(`<li>Currency: ${key}, Summ: ${data[key].toFixed(2)}</li>`);
    }
}

interface ICartItem {
    price: number;
}