import { IAresta } from './../interfaces/aresta';
import { IVertice } from './../interfaces/vertice';
import { forwardRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private verticeLabel!: string;

  private vertices$: Subject<IVertice[]>;
  private vertices: IVertice[];

  private arestas$: Subject<IAresta[]>;
  private arestas: IAresta[];

  private visibilidadeGraus$: Subject<boolean>;
  private visibilidadeGrausImpares$: Subject<boolean>;

  private verticesRemovidos = 0;
  private arestasRemovidas = 0;

  constructor() {
    this.vertices$ = new Subject();
    this.vertices = [];

    this.arestas$ = new Subject();
    this.arestas = [];

    this.visibilidadeGraus$ = new Subject();
    this.visibilidadeGrausImpares$ = new Subject();
  }

  update(){
    this.updateVertices();
    this.updateArestas();
  }

  getVisibilidadeGraus() {
    return this.visibilidadeGraus$;
  }

  updateVisibilidadeGraus(visibilidade: boolean) {
    this.visibilidadeGraus$.next(visibilidade);
  }

  getVisibilidadeGrausImpares() {
    return this.visibilidadeGrausImpares$;
  }

  updateVisibilidadeGrausImpares(visibilidade: boolean) {
    this.visibilidadeGrausImpares$.next(visibilidade);
    this.update();
  }

  getVertices() {
    return this.vertices$;
  }

  updateVertices(vertices?: IVertice[]) {
    if(vertices) this.vertices = vertices;
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
        id: this.vertices.length + this.verticesRemovidos,
        label: tempLabel,
        connections: [],
        offsetX: offsetX,
        offsetY: offsetY
      }
    );

    this.update();
  }

  removerVertice(verticeRemover: IVertice) {
    while (this.arestas.some(aresta => aresta.labelVertice1 === verticeRemover.label || aresta.labelVertice2 === verticeRemover.label)) {
      this.vertices.forEach(vertice => {
        vertice.connections.forEach((connectionLabel, index) => {
          if (connectionLabel === verticeRemover.label) {
            vertice.connections.splice(index, 1);
            this.removerArestas(verticeRemover);
          }
        });
      });
    }
    this.vertices.splice(this.vertices.findIndex(vertice => vertice.id === verticeRemover.id), 1);
    this.verticesRemovidos++;
    this.update();
  }

  adicionarAresta(vertice1: IVertice, vertice2: IVertice) {
    let index1: number, index2: number;
    index1 = this.vertices.findIndex(vertice => vertice.id === vertice1.id);
    index2 = this.vertices.findIndex(vertice => vertice.id === vertice2.id);

    if (index1 != -1 && index2 != -1) {
      if (!this.arestas.find(aresta => aresta.labelVertice1 == this.vertices[index1].label && aresta.labelVertice2 == this.vertices[index2].label)) {

        let conexaoReversa = this.arestas.findIndex(aresta => aresta.labelVertice1 == this.vertices[index2].label && aresta.labelVertice2 == this.vertices[index1].label);

        this.vertices[index1].connections?.push(this.vertices[index2].label);
        this.vertices[index2].connections?.push(this.vertices[index1].label);

        let initialX, initialY, finalX, finalY, angulo, comprimento, transformOrigin, additionalOffsetX = 0, additionalOffsetY = 0;
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

        if (conexaoReversa != -1) {
          if (vertice1.offsetX / vertice2.offsetX > vertice1.offsetY / vertice2.offsetY) {
            additionalOffsetX = 0;
            additionalOffsetY = 5;
            this.arestas[conexaoReversa].additionalOffsetX = 0;
            this.arestas[conexaoReversa].additionalOffsetY = -5;
          }
          else {
            additionalOffsetX = 5;
            additionalOffsetY = 0;
            this.arestas[conexaoReversa].additionalOffsetX = -5;
            this.arestas[conexaoReversa].additionalOffsetY = 0;
          }
        }

        this.arestas.push(
          {
            id: this.arestas.length + this.arestasRemovidas,
            labelVertice1: this.vertices[index1].label,
            labelVertice2: this.vertices[index2].label,
            offsetX: initialX,
            offsetY: initialY,
            additionalOffsetX: additionalOffsetX,
            additionalOffsetY: additionalOffsetY,
            angulo: angulo,
            comprimento: comprimento,
            transformOrigin: transformOrigin
          }
        );
        this.update();
      }
    }
  }

  removerAresta(arestaRemover: IAresta) {
    let conexaoReversa = this.arestas.findIndex(aresta => aresta.labelVertice1 === arestaRemover.labelVertice2 && aresta.labelVertice2 === arestaRemover.labelVertice1);
    if (conexaoReversa != -1) {
      this.arestas[conexaoReversa].additionalOffsetX = 0;
      this.arestas[conexaoReversa].additionalOffsetY = 0;
    }

    this.arestas.splice(this.arestas.findIndex(aresta => aresta.id === arestaRemover.id), 1);
    this.arestasRemovidas++;

    this.update();
  }

  removerArestas(vertice: IVertice) {
    this.arestas.forEach((aresta, index) => {
      if (aresta.labelVertice1 == vertice.label || aresta.labelVertice2 == vertice.label) {
        this.arestas.splice(index, 1);
        this.arestasRemovidas++;
      }
    });

    this.update();
  }
}
