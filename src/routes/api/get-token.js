import { getTokenApiUrl } from "$lib/constants";

export const POST = async () => {
    let result = await fetch(getTokenApiUrl, {
        method: "POST",
    })
    let token = await result.json();
    return { body: { token: token.data.token } }
}