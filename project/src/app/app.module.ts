import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { appRoutes } from './app.routes';

// Services
import { LocalDataStorerService } from "./services/storage/local-data-storer.service";
import { IDGeneratorService } from "./services/storage/id-generator.service";
import { GameCalculationsService } from "./services/game/game-calculations.service";
import { GameActionsService } from "./services/game/game-actions.service";

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
import { PlayerFormComponent } from "./forms/player/player-form.component";
import { OverviewComponent } from "./overview/overview.component";
import { EventFormComponent } from "./forms/event/event-form.component";
import { TableFormComponent } from "./forms/table/table-form.component";
import { PlayerPickerFormComponent } from "./forms/player-picker/player-picker-form.component";

// 3d party
import { ModalModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
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
    PlayerPickerFormComponent,
    PlayerFormComponent,
    TableFormComponent,
    EventFormComponent,
    OverviewComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    LocalDataStorerService,
    IDGeneratorService,
    GameCalculationsService,
    GameActionsService
  ]
})
export class AppModule { }
