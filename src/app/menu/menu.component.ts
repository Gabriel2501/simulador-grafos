import { StatsService } from './../services/stats.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('inputLabel') inputLabel!: ElementRef;

  private verticeLabel!: string;

  constructor(private _statsService: StatsService) {
  }

  ngOnInit(): void {
  }

  adicionarVertice(inputLabel: HTMLInputElement) {
    this.verticeLabel = inputLabel.value ? inputLabel.value.toUpperCase() : "A";
    this._statsService.updateLabel(this.verticeLabel);
  }
}
