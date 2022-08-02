import { convertApiKey, convertApiUrl } from "$lib/constants";

export const GET = async (request) => {
    let currentCurrency = request.params.currency;
    let result = await fetch(
        `${convertApiUrl}${convertApiKey}&currencies=${currentCurrency}`
    );
    let rate = await result.json();
    return { body: { rate: rate.data[currentCurrency].value } }
}