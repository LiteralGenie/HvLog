import { FilterGroup } from "@/classes/logs/filters/group"
import { FilterCategory } from "@/classes/logs/filters/manager"
import { WeekdayFilter } from "@/classes/logs/filters/weekday"
import { LogList, SummaryData } from "@/services/list.service"
import { Injectable } from "@angular/core"


@Injectable({
    providedIn: 'root'
})
export class WeekdayOf extends FilterGroup<number> implements FilterCategory {
    id = "Weekday"
    filters: {[id:number]: WeekdayFilter}
    names_short = "Sun Mon Tue Wed Thu Fri Sat".split(" ")

    constructor(list: LogList) {
        super()
        this.filters = [...Array(7).keys()].map(
            i => new WeekdayFilter(i, this.info_cache, list.subject$)
        )
    }

    to_name(id: number) {
        return this.names_short[id]
    }
}