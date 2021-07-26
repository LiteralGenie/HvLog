import { AgeFilter } from "@/classes/logs/filters/age"
import { Injectable } from "@angular/core"
import { LogList } from "../list.service"
import ENV from "@env"
import { FilterCategory } from "@/classes/logs/filters/manager"


@Injectable({
    providedIn: 'root'
})
export class AgeOf implements FilterCategory {
    id = "Age"
    filters: {[id:number]: AgeFilter}

    constructor(list: LogList) {
        this.filters = ENV.recency_periods.map(n => {
            return new AgeFilter(n, list.subject$)
        })
    }

    to_name(id: number) {
        return `age_${Math.trunc(id)}`
    }
}