import { IAresta } from './../interfaces/aresta';
import { IVertice } from './../interfaces/vertice';
import { StatsService } from './../services/stats.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public vertices$: Observable<IVertice[]>;
  public arestas$: Observable<IAresta[]>;

  public vertices: IVertice[];

  public visibilidadeGraus: boolean;
  private visibilidadeGrausImpares: boolean;

  private verticesSelecionados: IVertice[];

  constructor(private _statsService: StatsService) {
    this.visibilidadeGraus = false;
    this.visibilidadeGrausImpares = false;
    this.verticesSelecionados = [];
    this.vertices = [];

    this.vertices$ = this._statsService.getVertices();
    this.arestas$ = this._statsService.getArestas();

    this.vertices$.subscribe(vertices => {
      this.vertices = vertices;
      this.vertices.forEach(vertice => {
        vertice.isHighlighted = this.visibilidadeGrausImpares && (vertice.connections.length % 2 === 1);
        if (vertice.isHighlighted) document.querySelector(`#id${vertice.id}`)?.classList.add("highlighted");
        else document.querySelector(`#id${vertice.id}`)?.classList.remove("highlighted");
      });
    });

    this._statsService.getVisibilidadeGraus().subscribe(visibilidade => {
      this.visibilidadeGraus = visibilidade;
    });
    this._statsService.getVisibilidadeGrausImpares().subscribe(visibilidade => {
      this.visibilidadeGrausImpares = visibilidade;
    });

  }

  ngOnInit(): void {
  }

  novoVertice(event: any) {
    if (event.target.id === "content-container") this._statsService.adicionarVertice(event.offsetX - 25, event.offsetY - 25);
  }

  selecionarVertice(vertice: IVertice) {
    vertice.isSelected = !vertice.isSelected;
    if (vertice.isSelected) {
      document.querySelector("#id" + vertice.id)?.classList.add("selected");
      this.verticesSelecionados.push(vertice);
    }
    else {
      this.verticesSelecionados.splice(this.verticesSelecionados.indexOf(vertice), 1);
      document.querySelector("#id" + vertice.id)?.classList.remove("selected");
    }
    if (this.verticesSelecionados.length === 2) {
      this.verticesSelecionados[0].isSelected = false;
      this.verticesSelecionados[1].isSelected = false;
      document.querySelector("#id" + this.verticesSelecionados[0].id)?.classList.remove("selected");
      document.querySelector("#id" + this.verticesSelecionados[1].id)?.classList.remove("selected");
      this._statsService.adicionarAresta(this.verticesSelecionados[0], this.verticesSelecionados[1]);
      this.verticesSelecionados = [];

    }
  }

  removerVertice(vertice: IVertice) {
    if (this.verticesSelecionados.includes(vertice)) this.selecionarVertice(vertice);
    this._statsService.removerVertice(vertice);
  }

  removerAresta(aresta: IAresta) {
    this._statsService.removerAresta(aresta);
  }
}
