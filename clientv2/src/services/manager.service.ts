import { FilterManager } from "@/classes/logs/filters/manager";
import { PropertyCategory } from "@/classes/logs/filters/property";
import { Injectable } from "@angular/core";
import { AgeOf } from "./filters/age.service";
// import { MonthOf } from "./filters/month.service";
// import { TypeOf } from "./filters/type.service";
// import { WeekdayOf } from "./filters/weekday.service";
import { LogList } from "./list.service";


@Injectable({
    providedIn: 'root'
})
export class Manager extends FilterManager {
    constructor(list: LogList) {
        super()
        
        this.categories[Manager.cats.AGE] = new AgeOf(list)

        this.categories[Manager.cats.MONTH] = new PropertyCategory(
            'month',
            (id,month) => id === month,
            list
        )

        this.categories[Manager.cats.DAY] = new PropertyCategory(
            'weekday',
            (id,day) => id === day,
            list
        )
        
        this.categories[Manager.cats.TYPE] = new PropertyCategory(
            'battle_type',
            (id,type) => id === type,
            list
        )
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