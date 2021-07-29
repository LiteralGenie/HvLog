import { SourceData } from "@/classes/logs/filters/filter";
import { FilterCategory } from "@/classes/logs/filters/manager";
import { PropertyFilter } from "@/classes/logs/filters/property";
import { SummaryData } from "@/classes/logs/summary_data";
import { join_and } from "@/utils/observable_utils";
import { Injectable } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { LogList } from "../list.service";


@Injectable({
    providedIn: 'root'
})
export class TypeOf extends FilterCategory {    
    types = new Set<string>()
    watchers: {[exp: string]: ReplaySubject<SummaryData>} = {}

    constructor(private list: LogList) {
        super()
        this.list.subject$.subscribe(
            data => this.types.add(data.battle_type)
        )
    }

    // create watcher for a regexp from existing types
    create_watcher(exp: string) {        
        return this.list.subject$.pipe(
            filter(data => Boolean(data.battle_type.match(exp)))
        )
    }

    get_add$(exps: string[]) {
        let adds = exps.map(exp => {
            // get watcher
            this.watchers[exp] = this.watchers[exp] || this.create_watcher(exp)
            return this.watchers[exp]
        })

        return join_and(adds)
    }

    // battle_type will never change
    get_remove$() {
        return of() as Observable<SourceData>
    }
}