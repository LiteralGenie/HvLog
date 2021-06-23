import { send_request, sum_response } from "../extractor_utils.js"


async function get_credits(age=-1) {
    let kwargs= {
        age,
        filters: [],
        extractors: ['credits'],
    }
    console.log(`request:`, kwargs)

    let resp= await send_request(kwargs)
    console.log('server response:', resp)

    let ret= await sum_response(resp)
    return ret.credits.value
}


export {
    get_credits
}