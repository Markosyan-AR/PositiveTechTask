export function getRates() {
    return $.ajax({
        type: "GET",
        url: "http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22RUBUSD,EURUSD,JPYUSD,USDUSD%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
    })
        .then((rawData: ICurrencyData) => rawData.query.results.rate.map(x => new CurrencyRate(x)));
}

export class CurrencyRate {
    public rate: number;
    public name: string;

    constructor(data: ICurrencyRateItem) {
        this.rate = parseFloat(data.Rate);
        this.name = data.Name.slice(0, 3);
    }
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