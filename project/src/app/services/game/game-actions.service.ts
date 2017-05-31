import { Injectable } from '@angular/core';
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableRecord } from "../../models/table-record.model";
import { Player } from "../../models/player.model";
import { GameEvent } from "../../models/game-event.model";
import { TableActivity } from "../../models/table-activity.model";
import { IDGeneratorService } from "../storage/id-generator.service";
import { LocalDataStorerService } from "../storage/local-data-storer.service";
import { TableMoveStatus } from "../../models/table-move-status.enum";
import { TableMovement } from "../../models/table-movement.model";

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

    public moveTable(source: Table, destination: Table, event: GameEvent) {
        event.tableRecords.filter(record => record.table.Id === source.Id && record.end == undefined)
            .forEach(record => {
                let newRecord = new TableRecord(this.IDGenerator.generateId(), destination, record.player, new Date(), null);
                event.tableRecords.push(newRecord);
            });
        destination.moveStatus = TableMoveStatus.TARGET;
        source.moveStatus = TableMoveStatus.SOURCE;
        event.movements.push(new TableMovement(this.IDGenerator.generateId(), source, destination, new Date()))
        this.closeTable(source, event);
        this.openTable(destination, event);
    }

    public closeEvent(event: GameEvent) {
        event.tables.forEach(table => this.closeTable(table, event));
        // Make sure all table records are closed.
        event.tableRecords.filter(record => record.end == undefined).forEach(record => record.end = new Date());
        event.end = new Date();
        this.dataStorer.storeGameEvent(event);
    }

    public openEvent(event: GameEvent) {
        event.end = null;
        event.tables.forEach(table => {
            table.end = null;
            table.isOpen = true;
        });
        this.dataStorer.storeGameEvent(event);
    }
}