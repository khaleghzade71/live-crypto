<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { DropDown, Card } from "../lib/components/index";
    import type { Country } from "../lib/types";
    import { initSocket } from "./api/connect-socket";
    import { coins } from "../stores/coins";

    let countries: Country[] = [];
    let USDTToCurrencyRate = 1;
    let currentCurrency = "USD";
    $: getCurrencyPrice = (coin: any) => coin.USDTPrice * USDTToCurrencyRate;

    onMount(() => {
        initSocket();
        getCountries();
    });

    const getCountries = async () => {
        const response = await fetch("/api/get-countries");
        let result = await response.json();
        countries = result.countries;
    };

    const currencySelected = async ({
        detail: currency,
    }: {
        detail: string;
    }) => {
        if (currency) {
            currentCurrency = currency;
            let result = await fetch(
                `/api/convert-currency/${currentCurrency}`
            );
            let { rate } = await result.json();
            USDTToCurrencyRate = rate;
        } else {
            currentCurrency = "USD";
            USDTToCurrencyRate = 1;
        }
    };
</script>

<div class="m-auto w-1/3 min-w-300 mb-4">
    <DropDown
        options={countries}
        optionLabel="name"
        optionKey="currency"
        Inputlabel="Select your country"
        placeholder="Start entering the country"
        on:select={currencySelected}
    />
</div>
<div class="container flex max-w-fit flex-wrap m-auto gap-2 p-2">
    {#each $coins as coin}
        <div class="grow">
            <Card {coin} />
            <p class="font-bold text-xs">
                {currentCurrency}: {parseFloat(
                    getCurrencyPrice(coin).toFixed(6)
                )}
            </p>
        </div>
    {/each}
</div>
