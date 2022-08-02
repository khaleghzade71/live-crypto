import type { Coin } from '$lib/types';
import { writable, type Writable } from 'svelte/store';


export const coins: Writable<Coin[]> = writable([{
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
}]);