import { Routes } from '@angular/router';
import { WorldMapComponent } from './world-map/world-map';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'map' },
    { path: 'map', component: WorldMapComponent }, 
];
