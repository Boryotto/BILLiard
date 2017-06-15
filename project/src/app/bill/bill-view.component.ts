import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Player } from "../models/player.model";
import { GameEvent } from "../models/game-event.model";
import { Table } from "../models/table.model";
import { TableMoveStatus } from "../models/table-move-status.enum";
import { TableMovement } from "../models/table-movement.model";
import { TableRecord } from "../models/table-record.model";
import { config, classes } from '../config';
import { GameCalculationsService } from "../services/game/game-calculations.service";
import { TableActivity } from "../models/table-activity.model";
import { IDGeneratorService } from "../services/storage/id-generator.service";
import { MoneyCalculationsService } from "../services/game/money-calculations.service";
import { GenericLocalDataStorerService } from "../services/storage/generic-local-data-storer.service";

@Component({
    selector: 'bill-view',
    templateUrl: './bill-view.template.html'
})

export class BillViewComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataStorer: GenericLocalDataStorerService,
        private IDGenerator: IDGeneratorService,
        private gameCalculator: GameCalculationsService,
        private moneyCalculator: MoneyCalculationsService
    ) { }

    private eventId: number;
    private event: GameEvent;
    private panelClass: string = classes.player_bill_panel;
    private tipPercentage: number;

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.eventId = +params['eventId'];
        })
        this.dataStorer.getGameEvent(this.eventId).then(resolvedEvent => this.event = resolvedEvent).catch(reason => {
            this.router.navigate(['/error'])
        });

        this.tipPercentage = 0;
    }

}