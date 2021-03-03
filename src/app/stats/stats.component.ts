import { Subject, Observable } from 'rxjs';
import { IAresta } from './../interfaces/aresta';
import { StatsService } from './../services/stats.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IVertice } from '../interfaces/vertice';
import { ThisReceiver } from '@angular/compiler';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  @ViewChild('inputLabel') inputLabel!: ElementRef;

  private verticeLabel!: string;

  private vertices$: Observable<IVertice[]>;
  private arestas$: Observable<IAresta[]>;

  public vertices: IVertice[];
  public arestas: IAresta[];
  public somaGraus: number;
  public visibilidadeGraus: boolean;

  public exibirDetalhes = false;

  constructor(private _statsService: StatsService) {
    this.vertices$ = this._statsService.getVertices();
    this.arestas$ = this._statsService.getArestas();

    this.vertices = [];
    this.arestas = [];
    this.somaGraus = 0;
    this.visibilidadeGraus = false;

    this.vertices$.subscribe(vertices => {
      this.vertices = vertices;
      this.updateStats();
    });
    this.arestas$.subscribe(arestas => {
      this.arestas = arestas;
      this.updateStats();
    });    
  }

  ngOnInit(): void {
  }

  adicionarVertice(inputLabel: HTMLInputElement) {
    this.verticeLabel = inputLabel.value ? inputLabel.value.toUpperCase() : "A";
    this._statsService.updateLabel(this.verticeLabel);
  }

  alternarVisibilidadeDetalhes() {
    this.exibirDetalhes = !this.exibirDetalhes;
  }

  alternarVisibilidadeGrausIndividualmente() {
    this.visibilidadeGraus = !this.visibilidadeGraus;
    this._statsService.updateVisibilidadeGraus(this.visibilidadeGraus);
  }

  updateStats() {
    this.somaGraus = 0;
    this.vertices.forEach(vertice => {
      this.somaGraus += vertice.connections.length;
    });
  }

}
