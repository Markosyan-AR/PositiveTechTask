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

function getRates() {
    return $.ajax({
        type: "GET",
        url: "http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22RUBUSD,EURUSD,JPYUSD,USDUSD%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
    })
        .then((rawData: ICurrencyData) => rawData.query.results.rate.map(x => new CurrencyRate(x)));
}

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

interface ICurrencyData {
    query: {
        results: {
            rate: ICurrencyRateItem[]
        }
    }
}

interface ICurrencyRateItem {
    Rate: string;
    Date: string;
    Name: string;
}

class CurrencyRate {
    public rate: number;
    public name: string;

    constructor(data: ICurrencyRateItem) {
        this.rate = parseFloat(data.Rate);
        this.name = data.Name.slice(0, 3);
    }
}