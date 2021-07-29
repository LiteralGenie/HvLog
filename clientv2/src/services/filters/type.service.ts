import { FilterCategory } from "@/classes/logs/filters/manager";
import { TypeFilter } from "@/classes/logs/filters/type";
import { join_and } from "@/utils/observable_utils";
import { Injectable } from "@angular/core";
import { LogList } from "../list.service";


@Injectable({
    providedIn: 'root'
})
export class TypeOf extends FilterCategory {    
    types = new Set<string>()
    filters: {[exp: string]: TypeFilter} = {}

    constructor(private list: LogList) {
        super()
        this.list.subject$.subscribe(
            data => this.types.add(data.battle_type)
        )
    }

    // dynamically create filter
    get_filter(exp: string) {
        this.filters[exp] = this.filters[exp] || new TypeFilter(exp, this.list.subject$)
        return this.filters[exp]
    }

    get_add$(exps: string[]) {
        let adds = exps.map(exp => this.get_filter(exp).on_add$)
        return join_and(adds)
    }

    // battle_type will never change but whatever
    get_remove$(exps: string[]) {
        let rems = exps.map(exp => this.get_filter(exp).on_remove$)
        return join_and(rems)
    }
}