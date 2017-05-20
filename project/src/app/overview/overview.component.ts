import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameEvent } from "../models/game-event.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";

@Component({
    selector: 'overview',
    templateUrl: './overview.template.html'
})
export class OverviewComponent implements OnInit {

    private events: GameEvent[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataStorer: LocalDataStorerService,
    ) { }

    ngOnInit(): void {
        this.dataStorer.getAllGameEvents().then(gameEvents => this.events = gameEvents);
    }

    private onEventFormSubmitted(newEvent: GameEvent) {
        if (newEvent != undefined) {
            console.debug(`a new event was submitted with id: ${newEvent.Id}`)
            this.events.push(newEvent);
            console.debug(`Storing the new game event (id: ${newEvent.Id})`);
            this.dataStorer.storeGameEvent(newEvent);
        }
    }
} 
