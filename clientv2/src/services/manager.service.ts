import { FilterManager } from "@/classes/logs/filters/manager";
import { Injectable } from "@angular/core";
import { AgeOf } from "./filters/age.service";
import { MonthOf } from "./filters/month.service";
import { WeekdayOf } from "./filters/weekday.service";


@Injectable({
    providedIn: 'root'
})
export class Manager extends FilterManager {
    constructor(
        weekday: WeekdayOf,
        month: MonthOf,
        age: AgeOf
    ) {
        super()
        this.categories[weekday.id] = weekday
        this.categories[month.id] = month
        this.categories[age.id] = age
    }   
}