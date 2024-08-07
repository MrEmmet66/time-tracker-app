import config from "./config.ts";

export const fetchGraphQl = async (body: { query: string; }) => {
    const response = await fetch(config.API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') || null
        },
        body: JSON.stringify(body),
    })
    return await response.json()
}