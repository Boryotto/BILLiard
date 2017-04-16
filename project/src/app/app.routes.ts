import { Routes } from "@angular/router"
import { EventComponent } from "./event/event.component"

export const appRoutes: Routes = [
    { path: 'event/:id', component: EventComponent },
    { path: '**', redirectTo: '' }
];