import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

import { Olympic } from 'src/app/core/models/Olympic';
import { CanvasJS } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<any> = of(null);
  public chartOptions: any = {};

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    console.log('Olympics:', this.olympics$);

    this.olympics$.subscribe(olympics => {
      this.renderChart(olympics);
    });
  }

  renderChart(olympics: Olympic[]): void {
    if (!olympics) {
      console.error("No data available");
      return;
    }

    let dataPoints: { y: number, label: string, id: number }[] = [];
    olympics.forEach(olympic => {
      dataPoints.push({
        y: olympic.participations.reduce((totalMedals, participation) => totalMedals + participation.medalsCount, 0),
        label: olympic.country,
        id: olympic.id 
      });
    });

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: "Médailles par pays"
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{label}",
        yValueFormatString: "#,###",
        toolTipContent: "{label}: {y} médailles",
        dataPoints: dataPoints
      }]
      
    };
    console.log('data',dataPoints);

    let chart = new CanvasJS.Chart("chartContainer", this.chartOptions);

    // Associer un événement de clic à chaque point de données
    chart.options.data[0].dataPoints.forEach((dataPoint: any) => {
      dataPoint.click = (e: any) => {
        console.log('DataPoint clicked:', dataPoint);
        // Rediriger vers la page de détail du pays avec son ID
        this.router.navigate(['/detail', dataPoint.id]);
      };
    });

    chart.render();
  }
}
