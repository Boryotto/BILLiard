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
import { IDGeneratorService } from "./id-generator.service";

@Injectable()
export class GenericLocalDataStorerService implements IDataStorer {

    private cache: any = {};

    constructor(
        private idGenerator: IDGeneratorService
    ) { }

    getAllGameEvents(): Promise<GameEvent[]> {
        return new Promise<GameEvent[]>((resolve, reject) => {
            let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey))
            if (eventIds == null) {
                resolve([]);
            }
            this.resolveObjectArray<GameEvent>(eventIds, this.getGameEvent).then(gameEvents => resolve(gameEvents));
        });
    }

    private resolveObjectArray<T>(objectIds: number[], resolveFunction: any): Promise<T[]> {
        let promises: Promise<T>[] = [];
        objectIds.forEach(Id => promises.push(resolveFunction.call(this, Id) as Promise<T>));
        return Promise.all(promises);
    }

    private addEventToEventList(event: GameEvent) {
        if (event) {
            let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey));
            if (!eventIds) {
                eventIds = [];
            }
            if (!eventIds.find(id => id === event.Id)) {
                eventIds.push(event.Id);
            }
            localStorage.setItem(config.eventIdArrayStorageKey, JSON.stringify(eventIds));
        }
    }

    private removeEventFromEventList(event: GameEvent) {
        if (event) {
            let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey));
            if (!eventIds) {
                return;
            }
            eventIds = eventIds.filter(Id => Id !== event.Id);
            localStorage.setItem(config.eventIdArrayStorageKey, JSON.stringify(eventIds));
        }
    }

    public storeObject(obj: any) {
        let storableData = this.parseObject(obj);

        storableData = JSON.stringify(storableData);
        localStorage.setItem(`${obj.Id}`, storableData);
    }

    // problem with this function: it doesn't clone the elements of an array (the recrusive call)
    private clone(obj: any): any {
        let clone: any = Object.assign({}, obj);
        if (typeof obj === 'object') {
            for (let property in clone) {
                let propType: string = typeof clone[property];
                if (propType === 'object'
                    && clone[property] != null
                    && !(clone[property] instanceof Date)) {
                    if (clone[property] instanceof Array) {
                        for (let i = 0; i < clone[property].length; i++) {
                            let elementCopy = this.clone(clone[property][i]);
                            clone[property][i] = elementCopy;
                        }
                    } else {
                        let propertyCopy = this.clone(clone[property]);
                        clone[property] = propertyCopy;
                    }
                }
            }
        }
        return clone;
    }

    private parseObject(obj: any) {
        if (obj != null) {
            let parsedObject: any = {};
            if (obj instanceof Array) {
                parsedObject = [];
            }

            let typeString = typeof obj;

            if (typeString === 'number') {
                parsedObject = {
                    type: 'number',
                    data: obj
                }
            } else if (obj instanceof Date) {
                parsedObject = {
                    type: 'date',
                    data: obj
                }
            }
            else if (typeString === "object"
                && obj != null
                && obj.type !== "date"
                && obj.type !== "reference"
                && obj.type !== "number") {

                // Custom objects and arrays here
                for (let property in obj) {
                    let propertyType = typeof obj[property];

                    if (obj[property] instanceof Date) {
                        // This is an arab solution to replace date values in a special key
                        let newPropertyName = `date_${property}`;
                        parsedObject[newPropertyName] = this.parseObject(obj[property]);
                    } else if (propertyType === 'number') {
                        let newPropertyName = `number_${property}`;
                        parsedObject[newPropertyName] = this.parseObject(obj[property]);
                    } else if (obj[property] instanceof Array) {
                        parsedObject[property] = this.parseObject(obj[property]);
                    }
                    else if (propertyType === 'object'
                        && obj[property] != null
                        && obj[property].type !== "date"
                        && obj[property].type !== "reference"
                        && obj[property].type !== "number") {
                        parsedObject[property] = {
                            type: 'reference',
                            data: obj[property].Id
                        };
                        this.storeObject(obj[property]);
                    } else {
                        parsedObject[property] = this.parseObject(obj[property]);
                    }
                }
            } else {
                parsedObject = obj;
            }
            return parsedObject;
        }
        return null;
    }

    public getObject(id: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let resolvedObject = JSON.parse(localStorage.getItem(`${id}`));
            if (resolvedObject == null) {
                reject(`Item with id: ${id} was not found.`);
            }

            this.resolveObject(resolvedObject);
            if (Object.keys(this.cache).indexOf(`${id}`) === -1) {
                this.cache[id] = resolvedObject;
            }
            resolve(this.cache[id]);
        });
    }

    private resolveObject(obj: any) {

        let typeString = typeof obj;
        if (typeString === "object") {
            // Custom objects and arrays here
            for (let property in obj) {
                let propertyType = typeof obj[property];
                if (propertyType === 'object' && obj[property] != null) {
                    if (obj[property] instanceof Array) {
                        this.resolveObject(obj[property]);
                    } else if (obj[property].type === 'date') {
                        obj[property.split('date_')[1]] = new Date(obj[property].data);
                        delete obj[property];
                    } else if (obj[property].type === 'reference') {
                        this.getObject(obj[property].data).then(resolvedObject => {
                            obj[property] = resolvedObject;
                        });
                    } else if (obj[property].type === 'number') {
                        obj[property.split('number_')[1]] = +obj[property].data;
                        delete obj[property];
                    }
                }
            }
        }
    }

    public deleteObject(id: number) {
        let obj = this.getObject(id).then(obj => {
            this.deleteChildObjects(obj);

            localStorage.removeItem(`${id}`);
            delete this.cache[id];
            this.idGenerator.releaseReservedId(id);
        });
    }

    private deleteChildObjects(obj: any) {
        if (obj && typeof obj === 'object') {
            for (let property in obj) {
                if (obj[property] instanceof Array) {
                    this.deleteChildObjects(obj[property]);
                } else if (typeof obj[property] === 'object'
                    && !(obj[property] instanceof Date)
                    && obj[property]) {
                    this.deleteObject(obj[property].Id);
                }
            }
        }
    }

    getGameEvent(eventId: number): Promise<GameEvent> {
        return this.getObject(eventId);
    }

    storeGameEvent(event: GameEvent): void {
        this.storeObject(event);
        this.addEventToEventList(event);
    }
    getPlayer(playerId: number): Promise<Player> {
        return this.getObject(playerId);
    }
    storePlayer(player: Player): void {
        this.storeObject(player);
    }
    getTable(tableId: number): Promise<Table> {
        return this.getObject(tableId);
    }
    storeTable(table: Table): void {
        this.storeObject(table);
    }
    getMiscItem(itemId: number): Promise<MiscItem> {
        return this.getObject(itemId);
    }
    storeMiscItem(item: MiscItem): void {
        this.storeObject(item);
    }
    getTableRecord(recordId: number): Promise<TableRecord> {
        return this.getObject(recordId);
    }
    storeTableRecord(record: TableRecord): void {
        this.storeObject(record);
    }
    getTableMovement(movementId: number): Promise<TableMovement> {
        return this.getObject(movementId);
    }
    storeTableMovement(movement: TableMovement): void {
        this.storeObject(movement);
    }

    removeGameEvent(event: GameEvent) {
        if (event) {
            this.deleteObject(event.Id);
            this.removeEventFromEventList(event);
        }
    }
}
