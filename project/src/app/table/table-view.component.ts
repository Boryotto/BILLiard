import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { GameCalculationsService } from "../services/game/game-calculations.service";
import { Player } from "../models/player.model";


@Component({
    selector: 'table-view',
    templateUrl: './table-view.template.html',
    styleUrls: ['./table-view.stylesheet.css']

})
export class TableViewComponent implements OnInit {

    private tableId: number;
    private table: Table;
    private eventId: number;
    private event: GameEvent;

    private isEditingName: boolean;
    private enteredTableName: string;


    constructor(
        private route: ActivatedRoute,
        private dataStorer: LocalDataStorerService,
        private gameCalculator: GameCalculationsService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tableId = +params['tableId'];
            this.eventId = +params['eventId'];
        });

        this.dataStorer.getGameEvent(this.eventId).then(event => this.event = event).then(() => {
            this.table = this.event.tables.find(table => table.Id === this.tableId);
        });
    }

    private onChangeName() {
        console.debug(`Changing table name from: ${this.table.name} to: ${this.enteredTableName}`);
        this.table.name = this.enteredTableName;
        this.dataStorer.storeTable(this.table);
        this.isEditingName = false;
    }

    private onRemovePlayingPlayer(player: Player) {
        if (player != undefined) {
            console.debug(`Removing player (Id: ${player.Id}) from the table's playing players list`);
            let eventTableRecord = this.event.tableRecords.find(record => record.end == undefined && record.player.Id === player.Id);
            eventTableRecord.end = new Date();
            console.debug(`Storing the game event (id: ${this.event.Id}) with the updated table records`);
            this.dataStorer.storeGameEvent(this.event);
        }
    }


}