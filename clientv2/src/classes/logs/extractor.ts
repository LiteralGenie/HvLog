import { request_extract } from "@/utils/request_utils"
import { LogList } from "./log_list"
import { sum_lst, zip_dicts } from "@/utils/misc_utils"


// mostly a cache for server response
export abstract class BaseExtractor {
    cache: { [log_id: number]: any } = {}
    name: string = ""

    constructor(public id: string) { }

    async get_log(log_id: number): Promise<any> {
        if(!this.cache[log_id]) {
            const response = await request_extract(log_id, [this.id])
            this.cache[log_id] = this.handle_response(response[this.id])
        }
        
        return this.cache[log_id]
    }

    abstract handle_response(resp: any): any
}


export class AttributeExtractor extends BaseExtractor {
    cache: { [log_id: number]: LogAttributes } = {}

    handle_response(resp: Array<DataInterface>) {
        return new LogAttributes(resp)
    }
}

// holds extract data for a log
export class LogAttributes extends Array<DataInterface> {
    cache: any = null

    constructor(public data: Array<DataInterface>) {
        super(...data)
    }

    get totals() {
        this.cache = this.cache || this._totals
        return this.cache
    }

    get _totals(): { [attr: string]: any } {
        const totals: { [x:string]: any } = {}

        const zipped = zip_dicts(this)
        Object.entries(zipped).forEach( ([attr, lst]) => {
            if (attr === "meta") return
            totals[attr]= sum_lst(lst)
        })

        return totals
    }
}


/* interfaces */
interface DataInterface {
    meta: {
        round: number,
        turn: number,
        event: number,
    }

    [attr_name: string]: any
}


// collection of BaseExtractors that watch for changes to a LogList
export class ExtractorGroup {
    log_list: LogList
    extractors: { [name: string]: BaseExtractor }
    cache: { [name: string]: any } = {} // list of logs checked for each extractor

    constructor(log_list: LogList) {
        this.log_list = log_list
        this.extractors = {}
    }

    extract(extractor: string, filters: any) {
        let extr = this.extractors[extractor]
        
    }

    _extract() {

    }
}