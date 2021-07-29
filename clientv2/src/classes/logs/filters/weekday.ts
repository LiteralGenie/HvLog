import { LogList } from "@/services/list.service"
import { Injectable } from "@angular/core"
import { SummaryData } from "../summary_data"
import { FilterGroup, FilterGroupMember } from "./group"


// export class WeekdayFilter extends FilterGroupMember<number> {
//     filter(data: SummaryData, weekday: number): boolean {
//         return weekday === this.id
//     }

//     // convert timestamp (seconds) to weekday (0-6)
//     get_cache_value(data: SummaryData): number {
//         return data.weekday
//     }
// }