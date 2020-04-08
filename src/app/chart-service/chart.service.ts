import { Injectable } from '@angular/core';
import { SingleDayData } from '../coronavirus-model/single-day-data';
import { Chart } from 'chart.js';
import { CountryData } from '../coronavirus-model/country-data';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private ctx: any;
  private chart: any;
  private canvas: any;
  private chartLabels: string[];
  private chartData: number[];
  private last5DayData: SingleDayData[];
  private chartTracker: Array<string>;
  private coronavirusData: CountryData[];
  private coronavirusLatestDataIndex: number;
  private readonly chartBackgroundColor: Array<string>;

  constructor() {
    this.chartTracker = new Array<string>();
    this.chartBackgroundColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(250, 226, 105, 1)',
      'rgba(149, 230, 117, 1)',
      'rgba(89, 145, 200, 1)',
      'rgba(132, 132, 132, 1)',
    ];
  }

  createCharts(countryName: string, coronavirusData: CountryData[], coronavirusLatestDataIndex: number) {
    this.coronavirusData = coronavirusData;
    this.coronavirusLatestDataIndex = coronavirusLatestDataIndex;

    if (this.chartTracker.indexOf(countryName) > -1) {
      return;
    }
    else {
      this.chartTracker.push(countryName);
    }

    this.last5DayData = this.extractDataForLast5Days(countryName);

    this.createBarChart(countryName);
    this.createLineChart(countryName);
    this.createDoughnutChart(countryName);
  }

  createBarChart(countryName: string) {
    this.formatCountryDataForBarChart();
    this.createChart('bar', countryName, 'Confirmed Cases');
  }

  createLineChart(countryName: string) {
    this.formatCountryDataForLineChart();
    this.createChart('line', countryName, 'Deaths');
  }

  createDoughnutChart(countryName: string) {
    this.formatCountryDataForDoghnutChart(countryName);
    this.createChart('doughnut', countryName, 'Case summary');
  }

  private createChart(typeOfChart: string, countryName: string, label: string) {
    this.canvas = document.getElementById(typeOfChart + 'CoronaLineChart' + countryName);
    this.ctx = this.canvas.getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: typeOfChart,
      data: {
        labels: this.chartLabels,
        datasets: [{
          label,
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

  formatCountryDataForBarChart() {
    this.chartLabels = [];
    this.chartData = [];

    this.fillChartLabels('date');

    this.fillChartData('confirmed');
  }

  formatCountryDataForLineChart() {
    this.chartLabels = [];
    this.chartData = [];

    this.fillChartLabels('date');

    this.fillChartData('deaths');
  }

  private fillChartLabels(property: string) {
    this.last5DayData.forEach((singleDayData: SingleDayData) => {
      this.chartLabels.push(singleDayData[property]);
    });
  }

  private fillChartData(property: string) {
    this.last5DayData.forEach((singleDayData: SingleDayData) => {
      this.chartData.push(singleDayData[property]);
    });
  }

  private extractDataForLast5Days(countryName: string): SingleDayData[] {
    return (this.coronavirusData[countryName] as SingleDayData[]).slice(1).slice(-5);
  }

  formatCountryDataForDoghnutChart(countryName: string) {
    this.chartLabels = [];
    this.chartData = [];
    const latestDayData = (this.coronavirusData[countryName][this.coronavirusLatestDataIndex] as SingleDayData);

    this.chartLabels.push('Deaths');
    this.chartLabels.push('Confirmed');
    this.chartLabels.push('Recovered');

    this.chartData.push(latestDayData.deaths);
    this.chartData.push(latestDayData.confirmed);
    this.chartData.push(latestDayData.recovered);
  }
}
