import axios from 'axios'
import { zip_dicts, sum_lst } from "./misc_utils.js"


/*
Server request structure: {
    age: int,
    filters: [str],
    extractors: [str],
}

Server response structure: {
    start_time: {
        log: (object with basic log info -- eg battle_type, round_end, etc)
        extracts: {
            extractor_name: {
                (extractor-dependent structure -- see below)
            },
            ... (other extractors)
        }
    },
    ...
}

attribute-extractor response structure: {
    extractor name: [
        {
            meta: (object with round info),
            (attr_name): (attr_val),
            ... (other attrs)
        },
        ... (other rounds)
    ],
}
*/

async function send_request(kwargs) {
    if(!(typeof kwargs == 'string')) {
        kwargs= JSON.stringify(kwargs)
    }

    let ret= await axios.post(
        '/extract_tr',
        { kwargs }
    )

    return ret.data
}

/*
returns an array of the form: [
    (extractor_name): {
        (attr_name): (total_value),
        ... (other attrs)
    },
    ... (other extractors)
]
*/
async function sum_response(response) {
    let ret= {}

    // loop logs
    let log_totals= []
    Object.entries(response).forEach( ([start,info]) => {
        let extr_totals= {}

        // stack and sum the extractor info for each round
        let extrs= Object.entries(info.extracts)
        extrs.forEach( ([e,e_info]) => {
            extr_totals[e]= {}
            let zipped= zip_dicts(e_info)

            Object.entries(zipped).forEach( ([attr,lst]) => {
                if(attr === "meta") return

                extr_totals[e][attr]= sum_lst(lst)
            })
        })

        log_totals.push(extr_totals)
    })

    // stack extractor info from each log
    let zipped_logs= zip_dicts(log_totals)
    console.log(`log-by-log sums:`, zipped_logs)

    // sum extractor infos
    Object.entries(zipped_logs).forEach( ([extr,lst]) => {
        ret[extr]= {}
        let tmp= zip_dicts(lst)

        Object.entries(tmp).forEach( ([attr,val_lst]) => {
            ret[extr][attr]= sum_lst(val_lst)
        })
    })

    console.log(`final sums:`, ret)
    return ret
}


export {
    send_request,
    sum_response,
}