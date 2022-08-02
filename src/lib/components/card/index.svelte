<script type="ts">
    import type { Coin } from "src/lib/types";
    import { Loading } from "../index";

    export let coin: Coin;
</script>

<div class="card w-full min-w-300 shadow-lg rounded-md mb-2">
    <div class="p-5 pt-12 h-44">
        <span class="flex justify-between mb-2">
            <p>{coin.symbolName}</p>
            <p
                class={coin.changePercent > 0
                    ? "text-green-500"
                    : coin.changePercent < 0
                    ? "text-red-500"
                    : ""}
            >
                {coin.changePercent > 0 ? "+" : ""}{parseFloat(
                    coin.changePercent.toFixed(2)
                )}%
            </p>
        </span>
        {#if coin.USDTPrice}
            <p class="font-bold text-lg mb-2">
                {parseFloat(coin.USDTPrice.toFixed(4))}
            </p>

            <p class="font-bold text-xs">
                Volume:
                {parseFloat(coin.volume.toFixed(6))}
            </p>
        {:else}
            <Loading />
        {/if}
    </div>
</div>
