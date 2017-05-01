import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { appRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { LocalDataStorerService } from "./services/storage/local-data-storer.service";
import { TimerComponent } from "./timer/timer.component";
import { BillDisplayerComponent } from "./bill/bill-displayer.component";
import { TableViewComponent } from "./table/table-view.component";
import { PlayerViewComponent } from "./player/player-view.component";
import { ErrorComponent } from "./error/error.component";

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EventComponent,
    TimerComponent,
    BillDisplayerComponent,
    TableViewComponent,
    PlayerViewComponent,
    ErrorComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    LocalDataStorerService
  ]
})
export class AppModule { }
