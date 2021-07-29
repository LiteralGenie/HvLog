// import { FilterCategory } from "@/classes/logs/filters/manager"
// import { PropertyFilter } from "@/classes/logs/filters/property"
// import { LogList } from "@/services/list.service"
// import { join_and } from "@/utils/observable_utils"
// import { Injectable } from "@angular/core"
// import { merge } from "rxjs"


// @Injectable({
//     providedIn: 'root'
// })
// export class MonthOf implements FilterCategory {
//     filters: {[id:number]: PropertyFilter}
//     names_short = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")

//     constructor(list: LogList) {
//         this.filters = [...Array(12).keys()].map(
//             i => new PropertyFilter("month", x => x === i, list.subject$)
//         )
//     }

//     get_add$(ids: number[]) { 
//         let adds = ids.map(id => {
//             return this.filters[id].on_add$
//         })

//         return join_and(adds)
//     }

//     get_remove$(ids: number[]) { 
//         let rems = ids.map(id => {
//             return this.filters[id].on_remove$
//         })

//         return merge(...rems)
//     }

//     get_name(id: number) {
//         return this.names_short[id]
//     }
// }