import { Injectable } from '@angular/core';
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableRecord } from "../../models/table-record.model";
import { Player } from "../../models/player.model";
import { GameEvent } from "../../models/game-event.model";
import { TableActivity } from "../../models/table-activity.model";
import { IDGeneratorService } from "../storage/id-generator.service";
import { LocalDataStorerService } from "../storage/local-data-storer.service";

@Injectable()
export class GameActionsService {

    constructor(
        private IDGenerator: IDGeneratorService,
        private dataStorer: LocalDataStorerService
    ) { }

    public closeTable(table: Table, event: GameEvent) {
        table.isOpen = false;
        event.tableRecords.filter(record => record.table.Id === table.Id && record.end == undefined)
            .forEach(record => record.end = new Date());
        event.tableActivities.filter(activity => activity.table.Id === table.Id).forEach(activity => activity.end = new Date());
        this.dataStorer.storeGameEvent(event);
        this.dataStorer.storeTable(table);
    }

    public openTable(table: Table, event: GameEvent) {
        table.isOpen = true;
        event.tableActivities.push(new TableActivity(this.IDGenerator.generateId(), table, new Date(), null));
        this.dataStorer.storeGameEvent(event);
        this.dataStorer.storeTable(table);
    }

}