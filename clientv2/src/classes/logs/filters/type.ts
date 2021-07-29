import { Observable } from "rxjs";
import { LogList } from "@/services/list.service";
import { BaseFilter, SourceData } from "./filter";
import { SummaryData } from "../summary_data";


export class TypeFilter extends BaseFilter {
    // age in days
    constructor(public exp: string, target: Observable<SummaryData>) {
        super(target)
    }

    // check if elapsed time less than specified age
    // if age is <= 0, always return true
    filter(data: SummaryData) {
        return Boolean(data.battle_type.match(this.exp))
    }
}