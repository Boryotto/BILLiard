import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { config } from '../config';
import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Table } from "../models/table.model";
import { GameCalculationsService } from "../services/game/game-calculations.service";
import { TableRecord } from "../models/table-record.model";
import { IDGeneratorService } from "../services/storage/id-generator.service";
import { GenericLocalDataStorerService } from "../services/storage/generic-local-data-storer.service";
import { GameActionsService } from "../services/game/game-actions.service";


@Component({
    selector: 'player',
    templateUrl: './player-view.template.html',
    styleUrls: ['./player-view.stylesheet.css']

})
export class PlayerViewComponent implements OnInit {

    private playerId: number;
    private player: Player;
    private eventId: number;
    private event: GameEvent;

    private isEditingName: boolean;
    private enteredPlayerName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataStorer: GenericLocalDataStorerService,
        private IDGenerator: IDGeneratorService,
        private gameCalculator: GameCalculationsService,
        private gameActions: GameActionsService
    ) { }

    ngOnInit(): void {
        this.isEditingName = false;

        this.route.params.subscribe(params => {
            this.playerId = +params['playerId'];
            this.eventId = +params['eventId'];
        });

        this.dataStorer.getGameEvent(this.eventId).then(event => this.event = event).then(() => {
            this.player = this.event.players.find(player => player.Id === this.playerId);
        });


        let item: MiscItem = new MiscItem(12100, "Cola", 14.60, new Date());
        let item2: MiscItem = <MiscItem>{
            Id: 10211,
            name: "Cola",
            price: 14.60,
            orderDate: new Date(),
            prototype: MiscItem
        };
        localStorage.setItem('6999999', JSON.stringify(this.ngOnInit));

        // let r: MiscItem = JSON.parse(localStorage.getItem(item.Id.toString())) as MiscItem;
    }

    private onChangeName() {
        console.debug(`Changing player name from: ${this.player.name} to: ${this.enteredPlayerName}`);
        this.player.name = this.enteredPlayerName;
        this.dataStorer.storePlayer(this.player);
        this.isEditingName = false;
    }

    private onMiscItemFormSubmitted(newMiscItem: MiscItem) {
        if (newMiscItem != undefined) {
            console.debug(`a new misc item was submitted with id: ${newMiscItem.Id}`)
            this.player.miscItems.push(newMiscItem);
            console.debug(`Storing the game event (id: ${this.event.Id}) with the new misc item`);
            this.dataStorer.storeGameEvent(this.event);
        }
    }

    private onRemoveMiscItem(miscItem: MiscItem) {
        if (miscItem != undefined) {
            console.debug(`Removing misc item (Id: ${miscItem.Id}) from the player's misc Items list`);
            this.player.miscItems = this.player.miscItems.filter(currentItem => currentItem.Id !== miscItem.Id);
            console.debug(`Storing the game event (id: ${this.event.Id}) with the new misc item`);
            this.dataStorer.storeGameEvent(this.event);
        }

    }

    private onTableFormSubmitted(newTable: Table) {
        if (newTable != undefined) {
            console.debug(`a new table was added to the player. table id: ${newTable.Id}`);
            console.debug(`Creating a new table record...`);
            let newTableRecord: TableRecord = new TableRecord(
                this.IDGenerator.generateId(),
                newTable,
                this.player,
                new Date(),
                null
            );
            console.debug(`A new table record with id: ${newTableRecord.Id} was created.`);
            this.event.tableRecords.push(newTableRecord);
            console.debug(`Storing the game event (id: ${this.event.Id}) with the new tableRecord`);
            this.dataStorer.storeGameEvent(this.event);
        }
    }

    private onRemoveTableRecord(tableRecord: TableRecord) {
        if (tableRecord != undefined) {
            console.debug(`Removing table (Id: ${tableRecord.table.Id}) from the player's playing tables list`);
            let eventTableRecord = this.event.tableRecords.find(record => record.Id === tableRecord.Id);
            eventTableRecord.end = new Date();
            console.debug(`Storing the game event (id: ${this.event.Id}) with the updated table records`);
            this.dataStorer.storeGameEvent(this.event);
        }
    }

    private onRemovePlayer() {
        this.gameActions.deletePlayer(this.player, this.event);
        this.router.navigate(['/event', this.eventId]);
    }
}
