import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { appRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EventComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
