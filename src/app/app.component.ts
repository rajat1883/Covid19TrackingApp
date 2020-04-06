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
  chartLabels: string[];
  chartData: number[];
  chartVisible: boolean;
  last5DayData: SingleDayData[];
  chartTracker: Array<string>;

  private readonly chartBackgroundColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(250, 226, 105, 1)',
    'rgba(149, 230, 117, 1)',
    'rgba(89, 145, 200, 1)',
    'rgba(132, 132, 132, 1)',
  ];

  constructor(private coronavirusService: CoronavirusService) {
    this.chartTracker = new Array<string>();
    this.getCoronavirusData();
  }

  getCoronavirusData(): void {
    this.coronavirusService.getCoronavirusData().subscribe((coronavirusData: CountryData[]) => {
      this.coronavirusData = coronavirusData;
      this.getIndexOfLatestCoronavirusData();
      this.getCountryNames();
    });
  }

  private getIndexOfLatestCoronavirusData() {
    this.coronavirusLatestDataIndex = (this.coronavirusData['Albania'] as SingleDayData[]).length - 1;
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

  createChart(countryName: string) {
    if (this.chartTracker.indexOf(countryName) > -1) {
      return;
    }
    else {
      this.chartTracker.push(countryName);
    }

    this.createSpecificChart(countryName, 'bar');
    this.createSpecificChart(countryName, 'line');
    this.createSpecificChart(countryName, 'doughnut');
  }

  private createSpecificChart(countryName: string, typeOfChart: string) {
    if (typeOfChart === 'bar' || typeOfChart === 'line') {
      this.formatCountryDataForChart(countryName);
    }
    else {
      this.formatCountryDataForDoghnutChart(countryName);
    }
    this.canvas = document.getElementById(typeOfChart + 'CoronaLineChart' + countryName);
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: typeOfChart,
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Total cases in ' + countryName,
          data: this.chartData,
          backgroundColor: this.chartBackgroundColor,
          fill: false,
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        display: true,
        legend: {
          align: 'start'
        }
      }
    });
  }

  formatCountryDataForChart(countryName: string) {
    this.chartLabels = [];
    this.chartData = [];
    this.last5DayData = (this.coronavirusData[countryName] as SingleDayData[]).slice(1).slice(-5);
    this.last5DayData.forEach((singleDayData: SingleDayData) => {
      this.chartLabels.push(singleDayData.date);
    });

    this.last5DayData.forEach((singleDayData: SingleDayData) => {
      this.chartData.push(singleDayData.deaths);
    });
  }

  formatCountryDataForDoghnutChart(countryName: string) {
    this.chartLabels = [];
    this.chartData = [];

    this.chartLabels.push('Deaths');
    this.chartLabels.push('Confirmed');
    this.chartLabels.push('Recovered');

    this.chartData.push((this.coronavirusData[countryName][this.coronavirusLatestDataIndex] as SingleDayData).deaths);
    this.chartData.push((this.coronavirusData[countryName][this.coronavirusLatestDataIndex] as SingleDayData).confirmed);
    this.chartData.push((this.coronavirusData[countryName][this.coronavirusLatestDataIndex] as SingleDayData).recovered);
  }

}
