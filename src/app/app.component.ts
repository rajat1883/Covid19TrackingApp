import { Component, ViewChild, ElementRef } from '@angular/core';
import { CoronavirusService } from './coronavirus-service/coronavirus.service';
import { CountryData } from './coronavirus-model/country-data';
import { SingleDayData } from './coronavirus-model/single-day-data';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('coronaLineChart') chartViewEle: ElementRef;
  title = 'CoronavirusTracker';
  coronavirusData: CountryData[];
  countryNames: string[];
  coronavirusLatestDataIndex: number;
  searchText: string;
  ctx: any;
  chart: any;
  canvas: any;
  labels: string[];
  data: number[];
  chartVisible: boolean;

  constructor(private coronavirusService: CoronavirusService) {
    this.labels = ['New', 'In Progress', 'On Hold'];
    this.data = [1, 2, 3];
    this.getCoronavirusData();
  }

  getCoronavirusData(): void {
    this.coronavirusService.getCoronavirusData().subscribe((coronavirusData: CountryData[]) => {
      this.coronavirusData = coronavirusData;
      this.getCoronavirusDataDays();
      this.getCountryNames();
    });
  }


  private getCoronavirusDataDays() {
    this.coronavirusLatestDataIndex = (this.coronavirusData['Albania'] as SingleDayData[]).length - 1;
  }

  private getCountryNames() {
    this.countryNames = Object.keys(this.coronavirusData);
  }

  searchCountry(country: string): boolean {
    if (!this.searchText || country.toLowerCase().indexOf(this.searchText) > -1) {
      this.chartVisible = true;
    }
    else {
      this.chartVisible =  false;
    }
    return this.chartVisible;
  }

  createChart(countryName: string) {
    this.canvas = document.getElementById('coronaLineChart' + countryName);
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: this.labels,
          datasets: [{
              label: '# of Votes',
              data: this.data,
              backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
        display: true
      }
    });
  }

}
