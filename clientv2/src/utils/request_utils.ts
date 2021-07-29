import ENV from "@env"
import { HttpClient } from '@angular/common/http';
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

// returned object keys are extractor names
function request_extract(client: HttpClient, log_id: number, extractors: Array<string>): Observable<any> {
    const target = `${ENV.server}/test/extract`
    const params = {log_id, extractors: JSON.stringify(extractors) }

    return client.get(target, {params}).pipe(
        tap(data => console.log(target, params, data))
    )
}

export {
    request_extract
}