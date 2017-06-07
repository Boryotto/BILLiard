import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameEvent } from "../models/game-event.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { GenericLocalDataStorerService } from "../services/storage/generic-local-data-storer.service";
import { CloneService } from "../services/storage/clone.service";

@Component({
    selector: 'overview',
    templateUrl: './overview.template.html'
})
export class OverviewComponent implements OnInit {

    private events: GameEvent[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataStorer: GenericLocalDataStorerService,
        private cloner: CloneService
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
