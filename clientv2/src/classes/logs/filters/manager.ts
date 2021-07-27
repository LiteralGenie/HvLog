
import { Observable } from "rxjs";
import { BaseFilter } from "./filter";


// facilitates interaction of components and (categories of) filters
// adds caching and allows subscription to single observable for whatever filter combo
export abstract class Manager {
    categories: {[cat:string]: FilterCategory} = {}

    // opts is an object whose keys are FilterCategory ids and whose values are Filter ids
    // returns list of matching filters
    get_filters(opts: FilterOptionsData): Array<BaseFilter> {
        let filters = Array<BaseFilter>()

        Object.entries(opts).map( ([name,ids]) => {
            filters.concat(ids.map(id => {
                return this.categories[name].filters[id]
            }))
        })

        return filters
    }

    // intersection of cached filter values
    get_intersection(lst: Array<BaseFilter>) {
        let set = new Set<number>()

        lst.forEach(ftr => {
            ftr.index.forEach(id => set.add(id))
        })

        return set
    }

    get cats() {
        return Object.keys(this.categories)
    }
}
 
export interface FilterOptionsData {
    [cat:string]: Array<number>
}

export class FilterOptions {
    constructor(public opts: FilterOptionsData) {
        // sort obj props
        this.opts = Object.fromEntries(Object.entries(this.opts).sort())

        // sort id lists
        Object.entries(this.opts).forEach( ([name,id_lst]) => {
            id_lst.sort()
        })
    }

    // concatenate 
    get hash() {
        let cats = []
        Object.entries(this.opts).forEach( ([name,id_lst]) => {
            if(!id_lst.length) return

            let ids = id_lst.map(x => String(x))
                            .join("-")
            cats.push(`${name}_${ids}`)
        })

        return 
    }
}

export interface FilterCategory {
    id: string

    filters: {[id:number]: BaseFilter}
    to_name(id: number): string
}