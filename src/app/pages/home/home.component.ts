import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { ChartOptions } from 'src/app/core/models/ChartOptions';
import { DataPoint } from 'src/app/core/models/DataPoint';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public numberOfOlympics: number = 0;
  public numberOfCountries: number = 0;

  public olympics$: Observable<any> = of(null);
  public chartOptions: ChartOptions = {
    animationEnabled: true,
    title: {
      text: "Médailles par pays"
    },
    data: []
  };

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe(olympics => {
      this.numberOfOlympics = olympics.length;

      // Obtenir le nombre de pays uniques
      const uniqueCountries = new Set(olympics.map((olympic: Olympic) => olympic.country));
      this.numberOfCountries = uniqueCountries.size;

      // Rendre le graphique avec les données
      this.renderChart(olympics);
    });
  }

  renderChart(olympics: Olympic[]): void {
    if (!olympics) {
      console.error("No data available");
      return;
    }

    let dataPoints: DataPoint[] = [];
    olympics.forEach(olympic => {
      dataPoints.push({
        y: olympic.participations.reduce((totalMedals, participation) => totalMedals + participation.medalsCount, 0),
        label: olympic.country,
        id: olympic.id.toString() // Convertir en string
      });
    });

    this.chartOptions.data = [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{label}",
      yValueFormatString: "#,###",
      toolTipContent: "{label}: {y} médailles",
      dataPoints: dataPoints
    }];

    let chart = new CanvasJS.Chart("chartContainer", this.chartOptions);

    chart.options.data[0].dataPoints.forEach((dataPoint: DataPoint) => {
      dataPoint.click = (e: any) => {
        console.log('DataPoint clicked:', dataPoint);
        this.router.navigate(['/detail', dataPoint.id]);
      };
    });

    chart.render();
  }
}
