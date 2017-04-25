import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";


@Component({
    selector: 'player',
    templateUrl: './player-view.template.html',
    styleUrls: ['./player-view.stylesheet.css']

})
export class PlayerViewComponent implements OnInit {

    private playerId: number;

    constructor(private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.playerId = +params['id'];
        })
    }

}