import { LogList, SummaryData } from "@/services/list.service"
import { Injectable } from "@angular/core"
import { FilterGroup, FilterGroupMember } from "./group"


export class MonthFilter extends FilterGroupMember<number> {
    filter(data: SummaryData, month: number): boolean {
        return month === this.id
    }

    // convert timestamp (seconds) to month (0-12) 
    get_cache_value(data: SummaryData): number {
        return new Date(data.start*1000).getUTCMonth()
    }
}

@Injectable({
    providedIn: 'root'
})
export class MonthOf extends FilterGroup<number> {
    filters: {[id:number]: MonthFilter}

    constructor(list: LogList) {
        super()
        this.filters = [...Array(12).keys()].map(
            i => new MonthFilter(i, this.info_cache, list.subject$)
        )
    }
}