import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class IpService {

    constructor(private http: HttpClient) { }

    //Get IP Adress using http://freegeoip.net/json/?callback

    getIpAddress(): Observable<any> {
        return this.http
            .get<any>("http://api.ipstack.com/check?access_key=e352e2fdb8585a7b782270cc7cb1e768&format=1").pipe(
                map(response => response || {}),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error("observable error: ", error.message);
        return observableThrowError(error);
    }
}