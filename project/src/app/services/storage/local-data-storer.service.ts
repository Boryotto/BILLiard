import { Injectable } from '@angular/core';
import { config } from "../../config";

import { IDataStorer } from '../../interfaces/data-storer.interface'
import { GameEvent } from "../../models/game-event.model";
import { Player } from "../../models/player.model";
import { Table } from "../../models/table.model";
import { MiscItem } from "../../models/misc-item.model";
import { TableRecord } from "../../models/table-record.model";
import { TableMovement } from "../../models/table-movement.model";
import { TableMoveStatus } from "../../models/table-move-status.enum";
import { TableActivity } from "../../models/table-activity.model";

@Injectable()
export class LocalDataStorerService implements IDataStorer {

    getAllGameEvents(): Promise<GameEvent[]> {
        return new Promise<GameEvent[]>((resolve, reject) => {
            let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey))
            if (eventIds == null) {
                resolve([]);
            }
            this.resolveObjectArray<GameEvent>(eventIds, this.getGameEvent).then(gameEvents => resolve(gameEvents));
        });
    }

    private addEventToEventList(event: GameEvent) {
        let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey));
        if (!eventIds) {
            eventIds = [];
        }
        if (!eventIds.find(id => id === event.Id)) {
            eventIds.push(event.Id);
        }
        localStorage.setItem(config.eventIdArrayStorageKey, JSON.stringify(eventIds));
    }

    private removeEventFromEventList(event: GameEvent) {
        let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey));
        if (!eventIds) {
            eventIds = [];
        }
        if (!eventIds.find(id => id === event.Id)) {
            eventIds = eventIds.filter(id => id !== event.Id);
        }
        localStorage.setItem(config.eventIdArrayStorageKey, JSON.stringify(eventIds));
    }

    private resolveObjectArray<T>(objectIds: number[], resolveFunction: any): Promise<T[]> {
        let promises: Promise<T>[] = [];
        objectIds.forEach(Id => promises.push(resolveFunction.call(this, Id) as Promise<T>));
        return Promise.all(promises);
    }

    getGameEvent(eventId: number): Promise<GameEvent> {
        return new Promise<GameEvent>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${eventId}`));

            if (storedData == undefined) {
                reject(`Item with the id: ${eventId} was not found`);
            }

            let tables: Table[] = [];
            let players: Player[] = [];
            let movements: TableMovement[] = [];
            let tableRecords: TableRecord[] = [];
            let tableActivities: TableActivity[] = [];
            this.resolveObjectArray<Table>(storedData.tableIds, this.getTable).then(resolvedTables => tables = resolvedTables)
                .then(() => this.resolveObjectArray<Player>(storedData.playerIds, this.getPlayer)).then(resolvedPlayers => players = resolvedPlayers)
                .then(() => this.resolveObjectArray<TableMovement>(storedData.movementIds, this.getTableMovement).then(resolvedTableMovements => movements = resolvedTableMovements))
                .then(() => this.resolveObjectArray<TableRecord>(storedData.tableRecordIds, this.getTableRecord).then(resolvedTableRecords => tableRecords = resolvedTableRecords))
                .then(() => this.resolveObjectArray<TableActivity>(storedData.tableActivityIds, this.getTableActivity).then(resolvedTableActivities => tableActivities = resolvedTableActivities))
                .then(() => {
                    resolve(new GameEvent(
                        eventId,
                        storedData.name,
                        tables,
                        players,
                        storedData.hourlyRate,
                        movements,
                        tableRecords,
                        tableActivities,
                        storedData.start == undefined ? null : new Date(storedData.start),
                        storedData.end == undefined ? null : new Date(storedData.end)
                    ))
                });
        });
    }

    storeGameEvent(event: GameEvent): void {

        let tableIds: number[] = [];
        event.tables.forEach(table => {
            tableIds.push(table.Id);
            this.storeTable(table);
        });
        let playerIds: number[] = [];
        event.players.forEach(player => {
            playerIds.push(player.Id);
            this.storePlayer(player);
        });
        let movementIds: number[] = [];
        event.movements.forEach(movement => {
            movementIds.push(movement.Id);
            this.storeTableMovement(movement);
        });

        let tableRecordIds: number[] = [];
        event.tableRecords.forEach(tableRecord => {
            tableRecordIds.push(tableRecord.Id);
            this.storeTableRecord(tableRecord);
        });

        let tableActivityIds: number[] = [];
        event.tableActivities.forEach(tableActivity => {
            tableActivityIds.push(tableActivity.Id);
            this.storeTableActivity(tableActivity);
        });

        let storableData: any = {
            Id: event.Id,
            name: event.name,
            tableIds: tableIds,
            playerIds: playerIds,
            hourlyRate: event.hourlyRate,
            movementIds: movementIds,
            tableRecordIds: tableRecordIds,
            tableActivityIds: tableActivityIds,
            start: event.start,
            end: event.end
        }
        localStorage.setItem(`${event.Id}`, JSON.stringify(storableData));
        this.addEventToEventList(event);
    }

    removeGameEvent(event: GameEvent): void {
        localStorage.removeItem(`${event.Id}`);
        event.tables.forEach(table => this.removeTable(table, event));
        event.players.forEach(player => this.removePlayer(player, event));
        event.movements.forEach(movement => this.removeTableMovement(movement, event));
        event.tableActivities.forEach(activity => this.removeTableActivity(activity, event));
        event.tableRecords.forEach(record => this.removeTableRecord(record, event));

        this.removeEventFromEventList(event);
    }

    getPlayer(playerId: number): Promise<Player> {
        return new Promise<Player>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${playerId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${playerId} was not found`);
            }
            let miscItems: MiscItem[] = [];
            this.resolveObjectArray<MiscItem>(storedData.miscItemsIds, this.getMiscItem).then(resolvedMiscItems =>
                resolve(
                    new Player(
                        playerId,
                        storedData.name,
                        resolvedMiscItems
                    )
                )
            );
        });
    }
    storePlayer(player: Player): void {
        let miscItemsIds: number[] = [];
        player.miscItems.forEach(miscItem => {
            miscItemsIds.push(miscItem.Id);
            this.storeMiscItem(miscItem);
        });
        let storableData: Object = {
            Id: player.Id,
            name: player.name,
            miscItemsIds: miscItemsIds
        };
        localStorage.setItem(`${player.Id}`, JSON.stringify(storableData));
    }

    removePlayer(player: Player, event: GameEvent) {
        localStorage.removeItem(`${player.Id}`);
        event.tableRecords.filter(record => record.player.Id === player.Id).forEach(record => this.removeTableRecord(record, event));
        player.miscItems.forEach(item => this.removeMiscItem(item, player));
    }

    getTable(tableId: number): Promise<Table> {
        return new Promise<Table>((resolve, reject) => {

            let storedData = JSON.parse(localStorage.getItem(`${tableId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${tableId} was not found`);
            }
            resolve(new Table(
                tableId,
                storedData.name,
                storedData.hourlyRate,
                storedData.start == undefined ? null : new Date(storedData.start),
                storedData.end == undefined ? null : new Date(storedData.end),
                storedData.isOpen,
                storedData.moveStatus as TableMoveStatus))
        });
    }
    storeTable(table: Table): void {
        let storableData: Object = {
            Id: table.Id,
            name: table.name,
            hourlyRate: table.hourlyRate,
            start: table.start,
            end: table.end,
            isOpen: table.isOpen,
            moveStatus: table.moveStatus,
        }
        localStorage.setItem(`${table.Id}`, JSON.stringify(storableData));
    }

    removeTable(table: Table, event: GameEvent): void {
        event.tableRecords.filter(record => record.table.Id === table.Id).forEach(record => this.removeTableRecord(record, event));
        event.tableActivities.filter(activity => activity.table.Id === table.Id).forEach(activity => this.removeTableActivity(activity, event));
        event.tables = event.tables.filter(currentTable => currentTable.Id !== table.Id);
        localStorage.removeItem(`${table.Id}`);
    }

    getMiscItem(itemId: number): Promise<MiscItem> {
        return new Promise<MiscItem>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${itemId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${itemId} was not found`);
            }
            resolve(new MiscItem(itemId, storedData.name, +storedData.price, new Date(storedData.orderDate)));
        });
    }
    storeMiscItem(item: MiscItem): void {
        localStorage.setItem(`${item.Id}`, JSON.stringify(item));
    }

    removeMiscItem(miscItem: MiscItem, player: Player): void {
        localStorage.removeItem(`${miscItem.Id}`);
        player.miscItems = player.miscItems.filter(item => item.Id !== miscItem.Id);
    }

    getTableRecord(recordId: number): Promise<TableRecord> {
        return new Promise<TableRecord>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${recordId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${recordId} was not found`);
            }
            let table: Table;
            let player: Player;
            this.getTable(storedData.tableId).then(resolvedTable => {
                table = resolvedTable;
                return this.getPlayer(storedData.playerId);
            }).then(resolvedPlayer => {
                player = resolvedPlayer;
                resolve(new TableRecord(recordId, table, player, storedData.start == undefined ? null : new Date(storedData.start), storedData.end == undefined ? null : new Date(storedData.end)));
            });
        });
    }

    storeTableRecord(record: TableRecord): void {
        let storableData: Object = {
            Id: record.Id,
            tableId: record.table.Id,
            playerId: record.player.Id,
            start: record.start,
            end: record.end
        }
        localStorage.setItem(`${record.Id}`, JSON.stringify(storableData));
    }

    removeTableRecord(record: TableRecord, event: GameEvent): void {
        localStorage.removeItem(`${record.Id}`);
        event.tableRecords = event.tableRecords.filter(currentRecord => currentRecord.Id !== record.Id);
    }

    getTableActivity(activityId: number): Promise<TableActivity> {
        return new Promise<TableActivity>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${activityId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${activityId} was not found`);
            }
            let table: Table;
            this.getTable(storedData.tableId).then(resolvedTable => {
                table = resolvedTable;
                resolve(new TableActivity(activityId, table, storedData.start == undefined ? null : new Date(storedData.start), storedData.end == undefined ? null : new Date(storedData.end)));
            });
        });
    }

    storeTableActivity(tableActivity: TableActivity) {
        let storableData: any = {
            Id: tableActivity.Id,
            tableId: tableActivity.table.Id,
            start: tableActivity.start,
            end: tableActivity.end
        }
        localStorage.setItem(`${tableActivity.Id}`, JSON.stringify(storableData));
    }

    removeTableActivity(tableActivity: TableActivity, event: GameEvent): void {
        localStorage.removeItem(`${tableActivity.Id}`);
        event.tableActivities = event.tableActivities.filter(currentActivity => currentActivity.Id !== tableActivity.Id);
    }


    getTableMovement(movementId: number): Promise<TableMovement> {
        return new Promise<TableMovement>((resolve, reject) => {
            let storedData = JSON.parse(localStorage.getItem(`${movementId}`));
            if (storedData == undefined) {
                reject(`Item with the id: ${movementId} was not found`);
            }
            let tableSource: Table;
            let tableDestination: Table;
            this.getTable(storedData.tableSourceId).then(resolvedTableSource => {
                tableSource = resolvedTableSource;
                return this.getTable(storedData.tableDestinationId);
            }).then(resolvedTableDestination => {
                tableDestination = resolvedTableDestination;
                resolve(new TableMovement(movementId, tableSource, tableDestination, storedData.date == undefined ? null : new Date(storedData.date)));
            });
        });
    }

    storeTableMovement(movement: TableMovement): void {
        let storableData: any = {
            Id: movement.Id,
            tableSourceId: movement.tableSource.Id,
            tableDestinationId: movement.tableDestination.Id,
            date: movement.date
        }
        localStorage.setItem(`${movement.Id}`, JSON.stringify(storableData));
    }

    removeTableMovement(movement: TableMovement, event: GameEvent): void {
        localStorage.removeItem(`${movement.Id}`);
        event.movements = event.movements.filter(currentMovement => currentMovement.Id !== movement.Id);
    }
}