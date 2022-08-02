// @ts-nocheck
import { getCountriesApiUrl } from "$lib/constants";
import { request, gql } from "graphql-request";

export const GET = async () => {
    const query = gql`
            {
                countries {
                    name
                    currency
                    code
                }
            }
        `;
    const result = await request(getCountriesApiUrl, query);
    let countries = getCountriesSlice(result.countries, 5)
    return {
        body: { countries }
    }
}

function getCountriesSlice(sourceArray, length) {
    let index = 0;
    let finalArray = [];
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