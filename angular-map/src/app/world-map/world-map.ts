import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WorldBankService, WorldBankCountry } from '../world-bank.service';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './world-map.html',
  styleUrl: './world-map.css'
})
export class WorldMapComponent implements OnInit {
  private svc = inject(WorldBankService);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  svg = signal<SafeHtml | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  country = signal<WorldBankCountry | null>(null);

  ngOnInit() {
    fetch('assets/map-image.svg')
      .then(r => r.text())
      .then(raw => this.svg.set(this.sanitizer.bypassSecurityTrustHtml(raw)))
      .catch(() => this.error.set('Could not load the SVG map from assets/map-image.'));
  }

  onMapClick(evt: Event) {
    const el = evt.target as Element | null;
    if (!el || el.tagName.toLowerCase() !== 'path') return;
    const iso2 = (el.getAttribute('id') || '').toUpperCase();
    if (iso2.length !== 2) return;
    this.fetchCountry(iso2);
  }

  fetchCountry(iso2: string) {
    this.loading.set(true);
    this.error.set(null);
    this.country.set(null);

    this.http.get<any>(`https://api.worldbank.org/v2/country/${iso2}?format=json`).subscribe({
      next: (data) => {
        const c = Array.isArray(data) && data[1] && data[1][0] ? data[1][0] as WorldBankCountry : null;
        if (!c) {
          this.error.set('No country data found.');
        } else {
          this.country.set(c);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load country data.');
        this.loading.set(false);
      }
    });
  }
}
