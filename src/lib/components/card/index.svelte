<script type="ts">
    import type { Coin } from "src/lib/types";
    export let coin: Coin;
</script>

<div class="card w-full shadow-lg rounded-md mb-2">
    <div class="p-5 pt-12">
        <span class="flex justify-between mb-2">
            <p>{coin.symbolName}</p>
            <p
                class={coin.changePercent > 0
                    ? "text-green-500"
                    : "text-red-500"}
            >
                {coin.changePercent > 0 ? "+" : ""}{parseFloat(
                    coin.changePercent.toFixed(2)
                )}
            </p>
        </span>
        <p class="font-bold text-lg mb-2">
            {parseFloat(coin.USDTPrice.toFixed(4))}
        </p>

        <p class="font-bold text-xs">
            Volume:
            {parseFloat(coin.volume.toFixed(6))}
        </p>
    </div>
</div>
