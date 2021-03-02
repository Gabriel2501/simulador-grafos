import { Subject, Observable } from 'rxjs';
import { IAresta } from './../interfaces/aresta';
import { StatsService } from './../services/stats.service';
import { Component, OnInit } from '@angular/core';
import { IVertice } from '../interfaces/vertice';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  public vertices$: Observable<IVertice[]>;
  public arestas$: Observable<IAresta[]>;

  constructor(private _statsService: StatsService) {
    this.vertices$ = this._statsService.getVertices();
    this.arestas$ = this._statsService.getArestas();
  }

  ngOnInit(): void {
  }

}
