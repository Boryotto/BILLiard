import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { GameCalculationsService } from "../services/game/game-calculations.service";
import { Player } from "../models/player.model";
import { IDGeneratorService } from "../services/storage/id-generator.service";
import { TableRecord } from "../models/table-record.model";
import { GameActionsService } from "../services/game/game-actions.service";


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
        private router: Router,
        private dataStorer: LocalDataStorerService,
        private gameCalculator: GameCalculationsService,
        private IDGenerator: IDGeneratorService,
        private gameActions: GameActionsService
    ) { }

    ngOnInit(): void {

        this.route.params.subscribe(params => {
            this.tableId = +params['tableId'];
            this.eventId = +params['eventId'];
        });

        this.dataStorer.getGameEvent(this.eventId).then(event => this.event = event).then(() => {
            this.table = this.event.tables.find(table => table.Id === this.tableId);
            console.log(this.event)
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

    private onPlayerFormSubmitted(newPlayer: Player) {
        if (newPlayer != undefined) {
            console.debug(`a new player was added to the table. player id: ${newPlayer.Id}`);
            console.debug(`Creating a new table record...`);
            let newTableRecord: TableRecord = new TableRecord(
                this.IDGenerator.generateId(),
                this.table,
                newPlayer,
                new Date(),
                null
            );
            console.debug(`A new table record with id: ${newTableRecord.Id} was created.`);
            this.event.tableRecords.push(newTableRecord);
            console.debug(`Storing the game event (id: ${this.event.Id}) with the new tableRecord`);
            this.dataStorer.storeGameEvent(this.event);
        }
    }

    private onTableFormSubmitted(newTable: Table) {
        if (newTable != undefined) {
            console.debug(`a new table was submitted with id: ${newTable.Id}`)
            this.event.tables.push(newTable);
            this.gameActions.moveTable(this.table, newTable, this.event);
            console.debug(`The table ${this.table.Id} was moved to a new table with id: ${newTable.Id}`)
            this.dataStorer.storeGameEvent(this.event);
        }
    }

    private onRemoveTable() {
        this.dataStorer.removeTable(this.table, this.event);
        this.router.navigate(['/event',this.eventId]);
    }

}