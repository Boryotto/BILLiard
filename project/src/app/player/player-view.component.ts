import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config } from '../config';
import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Table } from "../models/table.model";


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

    private currencyISOCode: string;

    constructor(
        private route: ActivatedRoute,
        private dataStorer: LocalDataStorerService
    ) { }

    ngOnInit(): void {
        this.currencyISOCode = config.currencyISOCode;

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

    private addMiscItem() {

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

    private getPlayingTables(): Table[] {
        return this.event.tableRecords.map(tableRecord => {
            if (tableRecord.player.Id === this.player.Id && tableRecord.end == undefined)
                return tableRecord.table;
        });
    }
}
