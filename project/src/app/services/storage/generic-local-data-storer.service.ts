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
export class GenericLocalDataStorerService implements IDataStorer {


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
        let eventIds: number[] = JSON.parse(localStorage.getItem(config.eventIdArrayStorageKey));
        if (!eventIds) {
            eventIds = [];
        }
        if (!eventIds.find(id => id === event.Id)) {
            eventIds.push(event.Id);
        }
        localStorage.setItem(config.eventIdArrayStorageKey, JSON.stringify(eventIds));
    }

    public storeObject(obj: any) {
        // create a copy of obj before we change it:
        // let storableData: any = JSON.parse(JSON.stringify(obj));
        let storableData: any = this.clone(obj);
        // because of the json deserialization, all dates are kept as strings. I need to make a clone() function.
        // FML

        this.parseObject(storableData);

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
            let typeString = typeof obj;

            if (typeString === "object") {
                if (obj instanceof Date) {
                    obj = {
                        type: 'date',
                        data: obj
                    }
                } else { // Custom objects and arrays here
                    for (let property in obj) {
                        let propertyType = typeof obj[property];
                        if (propertyType === 'object'
                            && obj[property] != null
                            && obj[property].type !== "date"
                            && obj[property].type !== "reference"
                            && obj[property].type !== "number"
                        ) {

                            if (obj[property] instanceof Array) {
                                this.parseObject(obj[property]);
                            } else if (obj[property] instanceof Date) {
                                // This is an arab solution to replace date values in a special key
                                let newPropertyName = `date_${property}`;
                                obj[newPropertyName] = {
                                    type: 'date',
                                    data: obj[property]
                                }
                                delete obj[property];
                            } else {
                                let propCopy = obj[property];
                                obj[property] = {
                                    type: 'reference',
                                    data: obj[property].Id
                                }
                                this.storeObject(propCopy);
                            }
                        } else if (propertyType === 'number') {
                            let newPropertyName = `number_${property}`;
                            obj[newPropertyName] = {
                                type: 'number',
                                data: obj[property]
                            }
                            delete obj[property];
                        }
                    }
                }
            }
        }
    }

    public getObject(id: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let resolvedObject = JSON.parse(localStorage.getItem(`${id}`));
            if (resolvedObject == null) {
                reject(`Item with id: ${id} was not found.`);
            }

            this.resolveObject(resolvedObject);
            resolve(resolvedObject);
        });
    }

    private resolveObject(obj: any) {

        let typeString = typeof obj;
        // console.log(obj);
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

}
