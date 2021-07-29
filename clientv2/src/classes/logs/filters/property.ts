import { Observable } from "rxjs";
import { SummaryData } from "../summary_data";
import { BaseFilter } from "./filter";


export class PropertyFilter extends BaseFilter {
    constructor(
        public prop: keyof SummaryData,
        public check_fn: (x: SummaryData[keyof SummaryData]) => boolean,
        target: Observable<SummaryData>
    ) {
        super(target)
    }

    filter(data: SummaryData) {
        let val = data[this.prop]
        return this.check_fn(val)
    }
}