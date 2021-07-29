import { FilterGroup } from "@/classes/logs/filters/group"
import { FilterCategory } from "@/classes/logs/filters/manager"
import { PropertyFilter } from "@/classes/logs/filters/property"
import { LogList } from "@/services/list.service"
import { join_and } from "@/utils/observable_utils"
import { Injectable } from "@angular/core"
import { merge } from "rxjs"


@Injectable({
    providedIn: 'root'
})
export class WeekdayOf implements FilterCategory {
    filters: {[id:number]: PropertyFilter}
    names_short = "Sun Mon Tue Wed Thu Fri Sat".split(" ")

    constructor(list: LogList) {
        this.filters = [...Array(7).keys()].map(
            i => new PropertyFilter("weekday", x => x === i, list.subject$)
        )
    }

    get_add$(ids: number[]) { 
        let adds = ids.map(id => {
            return this.filters[id].on_add$
        })

        return join_and(adds)
    }

    get_remove$(ids: number[]) { 
        let rems = ids.map(id => {
            return this.filters[id].on_remove$
        })

        return merge(...rems)
    }


    get_name(id: number) {
        return this.names_short[id]
    }
}