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

    const { countriesApiUrl, convertApiUrl, socketUrl, socketApiKey } =
        variables;
    let countries: Country[] = [];
    let currencyRate = 1;
    let currentCurrency: String = "USDT";
    let coins: Coin[] = [
        {
            symbolName: "BTC-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
            currencyPrice: 0,
        },
        {
            symbolName: "ETH-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
            currencyPrice: 0,
        },
        {
            symbolName: "ADA-USDT",
            USDTPrice: 0,
            changePercent: 0,
            volume: 0,
            currencyPrice: 0,
        },
    ];

    const query = gql`
        {
            countries {
                name
                currency
                code
            }
        }
    `;
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
        const result = await request(countriesApiUrl, query);
        countries = getCountriesSlice(result.countries, 5);
        console.log("countries: ", countries);
    };
    const currencySelected = async (currency: { detail: string }) => {
        currentCurrency = currency.detail;
        let result = await fetch(convertApiUrl + currency.detail, {
            headers: {
                apiKey: "1xM0aDUHSlpiB1SYbKSjQtd1xoa13DG8",
            },
        });
        let test = await result.json();
        currencyRate = test.result;
        console.log("convertRate: ", currencyRate);
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
                currencyPrice: USDTPrice * currencyRate,
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

<DropDown
    items={countries}
    label="Select your country"
    placeholder="Start entering the country"
    on:select={currencySelected}
/>
<div class="container flex w-3/4 m-auto gap-2">
    {#each coins as coin}
        <div class="w-1/3">
            <Card {coin} />
            <p>{currentCurrency} : {coin.currencyPrice}</p>
        </div>
    {/each}
</div>
<img src={`https://flagcdn.com/24x18/ad.png`} alt="" />
