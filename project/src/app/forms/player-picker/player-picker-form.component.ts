import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MiscItem } from "../../models/misc-item.model";
import { Player } from "../../models/player.model";
import { GameCalculationsService } from "../../services/game/game-calculations.service";
import { ActivatedRoute } from "@angular/router";
import { LocalDataStorerService } from "../../services/storage/local-data-storer.service";
import { GameEvent } from "../../models/game-event.model";


@Component({
    selector: 'player-picker',
    templateUrl: './player-picker-form.template.html'
})
export class PlayerPickerFormComponent implements OnInit {

    @Output() onSubmitEvent: EventEmitter<Player> = new EventEmitter<Player>();
    @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;
    @Input() private players: Player[];

    private eventId: number;
    private event: GameEvent;

    private chosenPlayerId: number;

    constructor(
        private route: ActivatedRoute,
        private dataStorer: LocalDataStorerService,
        private gameCalculator: GameCalculationsService
    ) { }


    onSubmit() {
        let chosenPlayer: Player = this.players.find(player => player.Id === this.chosenPlayerId);
        this.onSubmitEvent.emit(chosenPlayer);
        this.resetForm();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.eventId = +params['eventId'];
            this.dataStorer.getGameEvent(this.eventId).then(event => this.event = event);
        });

        this.resetForm();
    }

    public resetForm() {
        this.chosenPlayerId = -1;
    }

    private setChosenPlayer(player: Player) {
        this.chosenPlayerId = player.Id;
    }

}