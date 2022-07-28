<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { onMount } from "svelte";
    let coins = [
        { symbolName: "BTC-USDT", price: 0, changePercent: 0, volume: 0 },
        { symbolName: "ETH-USDT", price: 0, changePercent: 0, volume: 0 },
        { symbolName: "ADA-USDT", price: 0, changePercent: 0, volume: 0 },
    ];
    onMount(() => {
        const connection = new WebSocket(
            "wss://ws-api.kucoin.com/endpoint?token=2neAiuYvAU61ZDXANAGAsiL4-iAExhsBXZxftpOeh_55i3Ysy2q2LEsEWU64mdzUOPusi34M_wGoSf7iNyEWJygYkKs61LKWJ1IxK1qKMbA4IlQzxaLFANiYB9J6i9GjsxUuhPw3BlrzazF6ghq4L9nlYdyULqBtXZJSySrPNpY=.p0OpaUkLjIm-irX2jN7KWQ=="
        );

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

        connection.onmessage = function (event) {
            let socketData = JSON.parse(event.data);
            console.log("socketData: ", socketData);
            if (socketData.data) {
                let index = coins.findIndex(
                    (coin) => socketData.data.data.symbol === coin.symbolName
                );
                let {
                    buy: price,
                    changeRate: changePercent,
                    vol: volume,
                } = socketData.data.data;
                coins[index] = {
                    ...coins[index],
                    price,
                    changePercent: changePercent * 100,
                    volume,
                };
            }
        };
    });
</script>

<div>
    {#each coins as coin}
        <p>price :{coin.price}</p>
        changePercent:
        <p>{coin.changePercent}</p>
        volume:
        <p>{coin.volume}</p>
    {/each}
</div>
