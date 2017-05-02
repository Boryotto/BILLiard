import { Routes } from "@angular/router"
import { EventComponent } from "./event/event.component"
import { TableViewComponent } from "./table/table-view.component";
import { PlayerViewComponent } from "./player/player-view.component";
import { ErrorComponent } from "./error/error.component";

export const appRoutes: Routes = [
    { path: 'event/:eventId', component: EventComponent },
    { path: 'event/:eventId/table/:tableId', component: TableViewComponent },
    { path: 'event/:eventId/player/:playerId', component: PlayerViewComponent },
    { path: 'error/:id', component: ErrorComponent },
    { path: '**', redirectTo: '' }
];