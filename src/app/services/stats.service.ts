import { IVertice } from './../interfaces/vertice';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAresta } from '../interfaces/aresta';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private verticeLabel!: string;

  private vertices$: Subject<IVertice[]>;
  private vertices: IVertice[];

  private arestas$: Subject<IAresta[]>;
  private arestas: IAresta[];

  constructor() {
    this.vertices$ = new Subject();
    this.vertices = [];

    this.arestas$ = new Subject();
    this.arestas = [];
  }

  getVertices() {
    return this.vertices$;
  }

  updateVertices() {
    this.vertices$.next(this.vertices);
  }

  getArestas() {
    return this.arestas$;
  }

  updateArestas() {
    this.arestas$.next(this.arestas);
  }

  updateLabel(newLabel: string) {
    this.verticeLabel = newLabel;
  }

  getLabel() {
    return this.verticeLabel;
  }

  adicionarVertice(offsetX: number, offsetY: number) {
    this.verticeLabel = this.verticeLabel ?? "A";
    if (this.verticeLabel.length > 4) this.verticeLabel = this.verticeLabel.slice(0, 4);
    let cont = 0;
    let tempLabel = this.verticeLabel;
    while (this.vertices.find(vertice => vertice.label == tempLabel)) {
      tempLabel = this.verticeLabel + cont;
      cont++;
    }

    this.vertices.push(
      {
        id: this.vertices.length,
        label: tempLabel,
        connections: [],
        offsetX: offsetX,
        offsetY: offsetY
      }
    );

    this.updateVertices();
  }

  adicionarAresta(vertice1: IVertice, vertice2: IVertice) {
    let index1: number, index2: number;
    index1 = this.vertices.findIndex(vertice => vertice.id === vertice1.id);
    index2 = this.vertices.findIndex(vertice => vertice.id === vertice2.id);

    if (index1 != -1 && index2 != -1) {
      if (!this.arestas.find(aresta => aresta.labelVertice1 == this.vertices[index1].label && aresta.labelVertice2 == this.vertices[index2].label)) {

        this.vertices[index1].connections?.push(this.vertices[index2].label);
        this.vertices[index2].connections?.push(this.vertices[index1].label);

        let initialX, initialY, finalX, finalY, angulo, comprimento, transformOrigin;
        initialX = this.vertices[index1].offsetX;
        initialY = this.vertices[index1].offsetY;

        finalX = this.vertices[index2].offsetX;
        finalY = this.vertices[index2].offsetY;

        angulo = (finalY - initialY) / (finalX - initialX);
        angulo = 360 - (Math.atan(angulo) * 180 / Math.PI);

        if (this.vertices[index1].offsetX >= this.vertices[index2].offsetX) {
          initialX = this.vertices[index2].offsetX;
          initialY = this.vertices[index2].offsetY;

          finalX = this.vertices[index1].offsetX;
          finalY = this.vertices[index1].offsetY;
        }
        
        transformOrigin = (this.vertices[index1].offsetY < this.vertices[index2].offsetY) ? "left top" : "left bottom";
        comprimento = Math.sqrt((Math.pow(finalX - initialX, 2)) + (Math.pow(finalY - initialY, 2)));

        this.arestas.push(
          {
            id: this.arestas.length,
            labelVertice1: this.vertices[index1].label,
            labelVertice2: this.vertices[index2].label,
            offsetX: initialX,
            offsetY: initialY,
            angulo: angulo,
            comprimento: comprimento,
            transformOrigin: transformOrigin
          }
        );
        this.updateArestas();
      }
    }
  }
}
