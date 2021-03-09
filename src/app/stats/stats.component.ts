import { Subject, Observable } from 'rxjs';
import { IAresta } from './../interfaces/aresta';
import { StatsService } from './../services/stats.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IVertice } from '../interfaces/vertice';
import { ThisReceiver } from '@angular/compiler';
import { ViewportScroller } from '@angular/common';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

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

  public exibirDetalhes: boolean;

  public vertices: IVertice[];
  public arestas: IAresta[];

  public isRegular: string;
  public isConexo: string;
  public possuiCaminhoEuleriano: string;
  public possuiCicloEuleriano: string;
  public somaGraus: number;
  public quantidadeGrausImpares: number;

  public visibilidadeGraus: boolean;
  public visibilidadeGrausColor: string;

  public visibilidadeGrausImpares: boolean;
  public visibilidadeGrausImparesColor: string;

  constructor(private _statsService: StatsService) {
    this.exibirDetalhes = false;

    this.vertices$ = this._statsService.getVertices();
    this.arestas$ = this._statsService.getArestas();

    this.vertices = [];
    this.arestas = [];

    this.isRegular = "Não";
    this.isConexo = "Não";
    this.possuiCaminhoEuleriano = "Não";
    this.possuiCicloEuleriano = "Não";
    this.somaGraus = 0;
    this.quantidadeGrausImpares = 0;

    this.visibilidadeGraus = false;
    this.visibilidadeGrausColor = "warn";

    this.visibilidadeGrausImpares = false;
    this.visibilidadeGrausImparesColor = "warn";

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
    this.visibilidadeGrausColor = this.visibilidadeGraus ? "primary" : "warn";

    this._statsService.updateVisibilidadeGraus(this.visibilidadeGraus);
  }

  alternarVisibilidadeGrausImpares() {
    this.visibilidadeGrausImpares = !this.visibilidadeGrausImpares;
    this.visibilidadeGrausImparesColor = this.visibilidadeGrausImpares ? "primary" : "warn";

    this._statsService.updateVisibilidadeGrausImpares(this.visibilidadeGrausImpares);
  }

  updateStats() {
    this.isConexo = "Não";
    this.possuiCaminhoEuleriano = "Não";
    this.possuiCicloEuleriano = "Não";
    this.somaGraus = 0;
    this.quantidadeGrausImpares = 0;

    let regularValidator = true;
    let cicloEulerianoValidator = true;
    this.vertices.forEach(vertice => {
      let conexoes = vertice.connections.length + vertice.selfConnectionCounter;
      //Soma dos graus dos vértices
      this.somaGraus += conexoes;

      if (vertice.connections.length !== this.vertices[0].connections.length || this.vertices[0].connections.length === 0) regularValidator = false;

      if (conexoes % 2 === 1) {
        this.quantidadeGrausImpares++;
        cicloEulerianoValidator = false;
      }
      else if (conexoes === 0) cicloEulerianoValidator = false;
    });

    if (this.vertices.some(vertice => this.verificarConexo(vertice))) {
      this.isConexo = "Sim";
    }

    this.isRegular = (this.somaGraus % this.vertices.length === 0) && regularValidator ? "Sim" : "Não";

    if (this.isConexo === "Sim" && (this.quantidadeGrausImpares === 2 || this.quantidadeGrausImpares === 0)) this.possuiCaminhoEuleriano = "Sim";
    if (this.isConexo === "Sim" && cicloEulerianoValidator) this.possuiCicloEuleriano = "Sim";
  }

  verificarConexo(v: IVertice, verificados?: string[], nivel?: number): boolean {
    verificados = verificados ?? [];
    nivel = nivel ?? 0;

    verificados.push(v.label);
    nivel++;

    if (v.connections.length !== 0 && v.connections.some(connection => !verificados?.includes(connection))) {
      let remainingConnections = v.connections.filter(connection => !verificados?.includes(connection));
      return remainingConnections.some(connection => this.verificarConexo(this.vertices[this.vertices.findIndex(vertice => vertice.label === connection)], verificados, nivel));
    }
    else {
      return this.vertices.every(vertice => verificados?.includes(vertice.label));
    }
  }
}
