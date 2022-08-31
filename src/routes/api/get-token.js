import { getTokenApiUrl } from "$lib/constants";
import { post } from "$lib/utils";

export const POST = async () => {
    let result = await post(getTokenApiUrl)
    return { body: { token: result.data.token } }
}