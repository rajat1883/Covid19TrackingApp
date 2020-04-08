import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoronavirusService {

  private readonly coronaVirusApiUrl = 'https://pomber.github.io/covid19/timeseries.json';

  constructor(private http: HttpClient) { }

  getCoronavirusData() {
    return this.http.get(this.coronaVirusApiUrl);
  }

}
