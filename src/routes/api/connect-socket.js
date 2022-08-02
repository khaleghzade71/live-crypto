// @ts-nocheck
import { socketUrl } from "$lib/constants";
import { getLocalStorage, post, setLocalStorage } from "$lib/utils";
import { coins } from '../../stores/coins';

let coinsArray = []
export async function initSocket() {
    coins.subscribe((value) => { coinsArray = value })
    let socketApiKey = getLocalStorage("socket-token");
    if (socketApiKey) {
        const connection = new WebSocket(socketUrl + socketApiKey);

        connection.onopen = () => {
            connection.send(
                JSON.stringify({
                    id: 1545910660739,
                    type: "subscribe",
                    topic: `/market/snapshot:${coinsArray
                        .map((coin) => coin.symbolName)
                        .join()}`,
                    response: true,
                })
            );
        };
        connection.onmessage = (event) => {
            let socketData = JSON.parse(event.data);
            if (JSON.parse(event.data).data) {
                update(socketData.data);
            }
        };
        connection.onclose = () => {
            setTimeout(() => {
                initSocket();
            }, 1000);
        };

        connection.onerror = () => {
            getToken();
        };

    } else {
        await getToken();
        initSocket();
    }
};

const getToken = async () => {
    let socketApiKey = await post("/api/get-token");
    setLocalStorage("socket-token", socketApiKey.token);
};

function update(socketData) {
    let index = coinsArray.findIndex(
        (coin) => socketData.data.symbol === coin.symbolName
    );
    let {
        buy: USDTPrice,
        changeRate: changePercent,
        vol: volume,
    } = socketData.data;
    coinsArray[index] = {
        ...coinsArray[index],
        USDTPrice,
        changePercent: changePercent * 100,
        volume,
    };
    coins.update(() => [...coinsArray])
};