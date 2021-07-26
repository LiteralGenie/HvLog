import ENV from "@env"
import { from, Observable, ReplaySubject, Subject } from "rxjs"
import { tap, switchMap } from 'rxjs/operators'
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"


@Injectable({
    providedIn: 'root'
})
export class LogList {
    // inits
    summaries: { [id: number]: SummaryData } = {}
    last_fetch: number = 0
    subject$ = new ReplaySubject<SummaryData>()

    constructor(private http_client: HttpClient) {}

    // fetch and notify of new log summaries
    fetch(start: number|null = null): Observable<SummaryData> {
        // setup
        start = start || this.last_fetch
        this.last_fetch = Math.floor(Date.now() / 1000)
        let params = { start }

        // request
        return this._fetch(params).pipe( 
            // unravel and emit the response
            switchMap(lst => {
                return from(lst.map(summ => {
                    // add id
                    return { 
                        ...summ, 
                        id: summ.start 
                    }
                }))
            }),

            // cache each emit
            tap(summ => {
                this.summaries[summ.id] = summ
            }),

            // subject emit
            tap(summ => this.subject$.next(summ))
        )
    }

    _fetch(params: {}) {
        let target = `${ENV.server}/test/logs`
        return this.http_client.get(target, { params }) as Observable<SummaryResponse[]>
    }
}

export interface SummaryResponse {
    start: number // seconds
    round_end: number
    round_max: number
    battle_type: string
}

export interface SummaryData extends SummaryResponse {
    id: number
}