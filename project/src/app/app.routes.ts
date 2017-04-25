import { Routes } from "@angular/router"
import { EventComponent } from "./event/event.component"
import { TableViewComponent } from "./table/table-view.component";

export const appRoutes: Routes = [
    { path: 'event/:id', component: EventComponent },
    { path: 'table/:id', component: TableViewComponent },
    { path: '**', redirectTo: '' }
];