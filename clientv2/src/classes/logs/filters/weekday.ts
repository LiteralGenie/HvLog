import { LogList, SummaryData } from "@/services/list.service"
import { Injectable } from "@angular/core"
import { FilterGroup, FilterGroupMember } from "./group"


export class WeekdayFilter extends FilterGroupMember<number> {
    filter(data: SummaryData, month: number): boolean {
        return month === this.id
    }

    // convert timestamp (seconds) to weekday (0-6)
    get_cache_value(data: SummaryData): number {
        return new Date(data.start*1000).getUTCDay()
    }
}