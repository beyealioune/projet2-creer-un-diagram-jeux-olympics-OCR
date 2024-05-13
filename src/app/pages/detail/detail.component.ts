import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  country!: any;
  public chartOptions: any = {
    title: {
      text: "Détails par pays"
    },
    animationEnabled: true,
    data: [{
      type: "column",
      dataPoints: []
    }]
  };

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) { }

  ngOnInit(): void {
    const idParamString = this.route.snapshot.paramMap.get('id');
    if (idParamString) {
      const idParam = parseInt(idParamString, 10);
      this.olympicService.getOlympics().subscribe(olympics => {
        this.country = olympics.find((country: Olympic) => country.id === idParam);
        if (this.country) {
          this.updateChartData(this.country);
          console.log('Country:', this.country);
        }
      });
    } else {
      console.error('ID Param is null');
    }
  }

  updateChartData(country: Olympic): void {
    const dataByYear: { [year: number]: { participations: number, medals: number, athletes: number } } = {};
  
    country.participations.forEach(participation => {
      if (!dataByYear[participation.year]) {
        dataByYear[participation.year] = { participations: 0, medals: 0, athletes: 0 };
      }
      dataByYear[participation.year].participations++;
      dataByYear[participation.year].medals += participation.medalsCount;
      dataByYear[participation.year].athletes += participation.athleteCount;
    });
  
    const dataPoints = Object.keys(dataByYear).map(year => {
      const numYear = parseInt(year, 10);
      return {
        label: numYear,
        participations: dataByYear[numYear].participations,
        medals: dataByYear[numYear].medals,
        athletes: dataByYear[numYear].athletes
      };
    });
  
    this.chartOptions.data[0].dataPoints = dataPoints.flatMap(data => ([
      { label: data.label, y: data.participations, indexLabel: `Participations: ${data.participations}` },
      { label: data.label, y: data.medals, indexLabel: `Médailles: ${data.medals}` },
      { label: data.label, y: data.athletes, indexLabel: `Athlètes: ${data.athletes}` }
    ]));
  }    
  

  getTotalMedals(participations: any[] | undefined): number {
    return participations ? participations.reduce((total, participation) => total + participation.medalsCount, 0) : 0;
  }

  getTotalAthletes(participations: any[] | undefined): number {
    return participations ? participations.reduce((total, participation) => total + participation.athleteCount, 0) : 0;
  } 
}
