import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { MiscItem } from "../models/misc-item.model";


@Component({
    selector: 'player',
    templateUrl: './player-view.template.html',
    styleUrls: ['./player-view.stylesheet.css']

})
export class PlayerViewComponent implements OnInit {

    private playerId: number;
    private player: Player;
    private eventId: number;

    constructor(private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.playerId = +params['playerId'];
            this.eventId = +params['eventId'];
        })

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

}
