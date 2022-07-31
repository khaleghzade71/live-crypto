<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { request, gql } from "graphql-request";
    import { DropDown, Card } from "../lib/components/index";
    import variables from "../lib/constants/variables";
    import type { Coin, Country } from "../lib/types";

    const {
        countriesApiUrl,
        convertApiUrl,
        convertApiKey,
        socketUrl,
        socketApiKey,
    } = variables;

    let countries: Country[] = [];
    let USDTToCurrencyRate = 1;
    let currentCurrency = "USD";
    $: getCurrencyPrice = (coin: any) => coin.USDTPrice * USDTToCurrencyRate;
    let coins: Coin[] = [
        {
            symbolName: "BTC-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
        },
        {
            symbolName: "ETH-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
        },
        {
            symbolName: "ADA-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
        },
    ];

    const getCountriesSlice = (sourceArray: Country[], length: number) => {
        let index = 0;
        let finalArray: Country[] = [];
        while (finalArray.length < length) {
            if (
                !finalArray.find(
                    (country) =>
                        country.currency === sourceArray[index].currency
                )
            ) {
                finalArray = [...finalArray, sourceArray[index]];
            }
            index++;
        }
        return finalArray;
    };

    const getCountries = async () => {
        const query = gql`
            {
                countries {
                    name
                    currency
                    code
                }
            }
        `;
        const result = await request(countriesApiUrl, query);
        countries = getCountriesSlice(result.countries, 5);
    };

    const currencySelected = async ({
        detail: currency,
    }: {
        detail: string;
    }) => {
        currentCurrency = currency || "USD";
        let result = await fetch(
            `${convertApiUrl}${convertApiKey}&currencies=${currentCurrency}`
        );
        let test = await result.json();
        USDTToCurrencyRate = test.data[currentCurrency].value;
    };

    onMount(() => {
        const connection = new WebSocket(socketUrl + socketApiKey);

        connection.onopen = () => {
            connection.send(
                JSON.stringify({
                    id: 1545910660739,
                    type: "subscribe",
                    topic: `/market/snapshot:${coins
                        .map((coin) => coin.symbolName)
                        .join()}`,
                    response: true,
                })
            );
        };

        const update = (socketData: any) => {
            let index = coins.findIndex(
                (coin) => socketData.data.symbol === coin.symbolName
            );
            let {
                buy: USDTPrice,
                changeRate: changePercent,
                vol: volume,
            } = socketData.data;
            coins[index] = {
                ...coins[index],
                USDTPrice,
                changePercent: changePercent * 100,
                volume,
            };
        };

        connection.onmessage = function (event) {
            let socketData = JSON.parse(event.data);
            if (JSON.parse(event.data).data) {
                update(socketData.data);
            }
        };

        getCountries();
    });
</script>

<div class="m-auto w-1/3 mb-4">
    <DropDown
        options={countries}
        optionLabel="name"
        optionKey="currency"
        Inputlabel="Select your country"
        placeholder="Start entering the country"
        on:select={currencySelected}
    />
</div>
<div class="container flex w-2/3 m-auto gap-2">
    {#each coins as coin}
        <div class="w-1/3">
            <Card {coin} />
            <p class="font-bold text-xs">
                {currentCurrency}: {parseFloat(
                    getCurrencyPrice(coin).toFixed(6)
                )}
            </p>
        </div>
    {/each}
</div>
