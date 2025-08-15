import { Component, Injectable, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Wikipedia } from './wikipedia';
import { NgFor } from '@angular/common';
import { WorldMapComponent } from './world-map/world-map';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, WorldMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  title = 'Wikipedia Search';
  pages = [];

  constructor(private wikipedia: Wikipedia) {}

  onTerm(term: string) {
    this.wikipedia.search(term).subscribe((response: any) => {
      this.pages = response.query.search;
    });
  }
}
