import { StatsService } from './../services/stats.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  constructor(private _statsService: StatsService) { }

  ngOnInit(): void {
  }

}
