import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";


@Component({
    selector: 'table',
    templateUrl: './table-view.template.html',
    styleUrls: ['./table-view.stylesheet.css']

})
export class TableViewComponent implements OnInit {

    private tableId: number;

    constructor(private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tableId = +params['id'];
        })
    }

}