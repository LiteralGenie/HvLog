import { FilterManager } from "@/classes/logs/filters/manager";
import { Injectable } from "@angular/core";
import { AgeOf } from "./filters/age.service";
import { MonthOf } from "./filters/month.service";
import { TypeOf } from "./filters/type.service";
import { WeekdayOf } from "./filters/weekday.service";
import { LogList } from "./list.service";


@Injectable({
    providedIn: 'root'
})
export class Manager extends FilterManager {
    constructor(list: LogList) {
        super()
        
        this.categories[Manager.cats.AGE] = new AgeOf(list)
        this.categories[Manager.cats.MONTH] = new MonthOf(list)
        this.categories[Manager.cats.DAY] = new WeekdayOf(list)
        this.categories[Manager.cats.TYPE] = new TypeOf(list)
    }
}

export namespace Manager {
    export enum cats {
        AGE,
        MONTH,
        DAY,
        TYPE
    }
}