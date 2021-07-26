import { FilterGroup } from "@/classes/logs/filters/group"
import { FilterCategory } from "@/classes/logs/filters/manager"
import { MonthFilter } from "@/classes/logs/filters/month"
import { LogList, SummaryData } from "@/services/list.service"
import { Injectable } from "@angular/core"


@Injectable({
    providedIn: 'root'
})
export class MonthOf extends FilterGroup<number> implements FilterCategory {
    id = "Month"
    filters: {[id:number]: MonthFilter}
    names_short = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")

    constructor(list: LogList) {
        super()
        this.filters = [...Array(12).keys()].map(
            i => new MonthFilter(i, this.info_cache, list.subject$)
        )
    }

    to_name(id: number) {
        return this.names_short[id]
    }
}