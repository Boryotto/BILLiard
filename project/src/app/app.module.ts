import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { appRoutes } from './app.routes';

// Services
import { LocalDataStorerService } from "./services/storage/local-data-storer.service";
import { IDGeneratorService } from "./services/storage/id-generator.service";

// Components
import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimerComponent } from "./timer/timer.component";
import { BillDisplayerComponent } from "./bill/bill-displayer.component";
import { TableViewComponent } from "./table/table-view.component";
import { PlayerViewComponent } from "./player/player-view.component";
import { ErrorComponent } from "./error/error.component";
import { MiscItemFormComponent } from "./forms/misc-item/misc-item-form.component";
import { TablePickerFormComponent } from "./forms/table-picker/table-picker-form.component";

// 3d party
import { ModalModule } from 'ngx-bootstrap';
import { GameCalculationsService } from "./services/game/game-calculations.service";
import { PlayerPickerFormComponent } from "./forms/player-picker/player-picker-form.component";


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  declarations: [
    AppComponent,
    EventComponent,
    TimerComponent,
    BillDisplayerComponent,
    TableViewComponent,
    PlayerViewComponent,
    ErrorComponent,
    MiscItemFormComponent,
    TablePickerFormComponent,
    PlayerPickerFormComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    LocalDataStorerService,
    IDGeneratorService,
    GameCalculationsService
  ]
})
export class AppModule { }
