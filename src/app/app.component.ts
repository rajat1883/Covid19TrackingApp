import { Component, ViewChild, ElementRef } from '@angular/core';
import { CoronavirusService } from './coronavirus-service/coronavirus.service';
import { CountryData } from './coronavirus-model/country-data';
import { SingleDayData } from './coronavirus-model/single-day-data';
import { ChartService } from './chart-service/chart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('coronaLineChart') chartViewEle: ElementRef;
  title = 'CoronavirusTracker';
  countryNames: string[];
  searchText: string;
  chartVisible: boolean;
  coronavirusData: CountryData[];
  coronavirusLatestDataIndex: number;

  constructor(private coronavirusService: CoronavirusService, private chartService: ChartService) {
    this.getCoronavirusData();
  }

  getCoronavirusData(): void {
    this.coronavirusService.getCoronavirusData().subscribe((coronavirusData: CountryData[]) => {
      this.coronavirusData = coronavirusData;
      this.coronavirusLatestDataIndex = this.getIndexOfLatestCoronavirusData();
      this.getCountryNames();
    });
  }

  private getIndexOfLatestCoronavirusData() {
    return (this.coronavirusData['Albania'] as SingleDayData[]).length - 1;
  }

  private getCountryNames() {
    this.countryNames = Object.keys(this.coronavirusData);
  }

  searchCountry(country: string): boolean {
    if (!this.searchText || country.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
      this.chartVisible = true;
    }
    else {
      this.chartVisible = false;
    }
    return this.chartVisible;
  }

  createCharts(countryName: string) {
    this.chartService.createCharts(countryName, this.coronavirusData, this.coronavirusLatestDataIndex);
  }
}
