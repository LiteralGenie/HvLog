import { AgeFilter } from "@/classes/logs/filters/age"
import { Injectable } from "@angular/core"
import { LogList } from "../list.service"
import ENV from "@env"
import { FilterCategory } from "@/classes/logs/filters/manager"


@Injectable({
    providedIn: 'root'
})
export class AgeOf extends FilterCategory {
    filters: {[id:number]: AgeFilter} = {}

    constructor(list: LogList) {
        super()
        ENV.recency_periods.forEach(n => {
            this.filters[n] = new AgeFilter(n, list.subject$)
        })
    }

    get_add$(id: number) { return this.filters[id].on_add$ }
    get_remove$(id: number) { return this.filters[id].on_remove$ }
    get_name(id: number) { return `age_${Math.trunc(id)}` }
}