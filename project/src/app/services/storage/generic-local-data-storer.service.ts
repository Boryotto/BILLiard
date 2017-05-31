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


    public storeObject(obj: any) {
        let storableData: any = {};
        this.parseObject(obj);

        storableData = JSON.stringify(obj);
        localStorage.setItem(`${obj.Id}`, storableData);
        console.log(obj);
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
                        if (propertyType === 'object' && obj[property] != null) {
                            if (obj[property] instanceof Array) {
                                this.parseObject(obj[property]);
                            } else if (obj[property] instanceof Date) {
                                // This is an arab solution to replace date values in a special key
                                obj[`date_${property}`] = {
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
            console.log(resolvedObject);
            resolve(resolvedObject);
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
                    } else {
                        if (obj[property].type === 'date') {
                            obj[property.split('date_')[1]] = new Date(obj[property].data);
                            delete obj[property];
                        } else if (obj[property].type === 'reference') {
                            this.getObject(obj[property].data).then(resolvedObject => {
                                obj[property] = resolvedObject;
                            });
                        }
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
