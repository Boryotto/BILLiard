import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MiscItem } from "../../models/misc-item.model";
import { IDGeneratorService } from "../../services/storage/id-generator.service";
import { config } from '../../config';
import { GameEvent } from "../../models/game-event.model";
import { Player } from "../../models/player.model";
import { Table } from "../../models/table.model";
import { TableMoveStatus } from "../../models/table-move-status.enum";

@Component({
    selector: 'event-form',
    templateUrl: './event-form.template.html'
})
export class EventFormComponent implements OnInit {

    @Output() onSubmitEvent: EventEmitter<GameEvent> = new EventEmitter<GameEvent>();
    @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;

    constructor(private IDGenerator: IDGeneratorService) { }

    private model: GameEvent;
    private currencySymbol: string;

    private latestPlayerIdAdded: number;
    private latestTableIdAdded: number;

    onSubmit() {
        this.model.start = new Date();
        this.model.tables.forEach(table => table.start = new Date());
        this.onSubmitEvent.emit(this.model);
        this.resetForm();
    }

    ngOnInit(): void {
        this.currencySymbol = config.currencySymbol;
        this.resetForm();
    }

    resetForm() {
        this.latestPlayerIdAdded = -1;
        this.latestTableIdAdded = -1;
        this.model = new GameEvent(
            this.IDGenerator.generateId(),
            "",
            [],
            [],
            0,
            [],
            [],
            null,
            null
        );
    }

    private addNewPlayer() {
        let player: Player = new Player(
            this.IDGenerator.generateId(),
            "",
            []
        );
        this.model.players.push(player);
        this.latestPlayerIdAdded = player.Id;
    }

    private removePlayer(player: Player) {
        this.model.players = this.model.players.filter(currentPlayer => currentPlayer.Id !== player.Id);
    }

    private addNewTable() {
        let table: Table = new Table(
            this.IDGenerator.generateId(),
            "",
            this.model.hourlyRate,
            null,
            null,
            true,
            TableMoveStatus.NULL
        );
        this.model.tables.push(table);
        this.latestTableIdAdded = table.Id;
    }

    private removeTable(table: Table) {
        this.model.tables = this.model.tables.filter(currentTable => currentTable.Id !== table.Id);
    }
}