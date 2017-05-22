import { Routes } from "@angular/router"
import { EventComponent } from "./event/event.component"
import { TableViewComponent } from "./table/table-view.component";
import { PlayerViewComponent } from "./player/player-view.component";
import { ErrorComponent } from "./error/error.component";
import { OverviewComponent } from "./overview/overview.component";
import { BillViewComponent } from "./bill/bill-view.component";

export const appRoutes: Routes = [
    { path: '', component: OverviewComponent },
    { path: 'event/:eventId', component: EventComponent },
    { path: 'event/:eventId/table/:tableId', component: TableViewComponent },
    { path: 'event/:eventId/player/:playerId', component: PlayerViewComponent },
    { path: 'event/:eventId/bill', component: BillViewComponent },
    { path: 'error/:id', component: ErrorComponent },
    { path: '**', redirectTo: '' }
];