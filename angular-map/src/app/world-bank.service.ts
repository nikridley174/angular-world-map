import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type WorldBankCountry = {
    name: string;
    iso2Code: string;
    capitalCity: string;
    region: { 
        id: string;
        value: string;
    };
    incomeLevel: {
        id: string;
        value: string;
    };
    latitude: string;
    longitude: string;
};

@Injectable({ providedIn: 'root' })
export class WorldBankService {
    private http = inject(HttpClient);

    getCountry(iso2: string): Observable<WorldBankCountry | null> {
        const url = 'https://api.worldbank.org/v2/country/${iso2}?format=json';
        return this.http.get<any>(url).pipe(
            map((data) => (Array.isArray(data) && data[1] && data[1][0] ? data[1][0] as WorldBankCountry : null))
        );
    }
}