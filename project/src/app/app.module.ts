import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
