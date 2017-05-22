import { Injectable } from '@angular/core';
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableRecord } from "../../models/table-record.model";
import { Player } from "../../models/player.model";
import { GameEvent } from "../../models/game-event.model";

@Injectable()
export class MoneyCalculationsService {
    
    public calculateEventBill(event: GameEvent): number {
        let subBill: number = 0;
        for (let currentTable of event.tables) {
            subBill += this.calculateTableBill(currentTable, event);
        }
        event.players.forEach(currentPlayer => {
            currentPlayer.miscItems.forEach(item => subBill += item.price);
        });
        return subBill;
    }

    public calculateTableBill(table: Table, event: GameEvent): number {
        if (table.start == undefined) {
            return 0;
        }
        let leaseTimeMillis: number = 0;
        event.tableActivities.filter(activity => activity.table.Id === table.Id).forEach(activity => {
            if (activity.end != undefined) {
                leaseTimeMillis += activity.end.getTime() - activity.start.getTime();
            } else {
                leaseTimeMillis += new Date().getTime() - activity.start.getTime();
            }
        });
        return (leaseTimeMillis / 3600000) * table.hourlyRate;
    }

    public calculatePlayerTableBill(player: Player, table: Table,event: GameEvent): number {
        let records: TableRecord[] = event.tableRecords.filter(record =>
            record.player.Id === player.Id
            && record.table.Id === table.Id
        );
        let total: number = 0;
        for (let record of records) {
            let leaseTimeMillis: number = 0;
            if (record.end != undefined) {
                leaseTimeMillis = record.end.getTime() - record.start.getTime();
            } else {
                leaseTimeMillis = new Date().getTime() - record.start.getTime();
            }
            total += (leaseTimeMillis / 3600000) * record.table.hourlyRate;
        }
        player.miscItems.forEach(item => total += +item.price);
        return total;
    }

    public calculatePlayerBill(player: Player, event: GameEvent): number {
        let records: TableRecord[] = event.tableRecords.filter(record => record.player.Id === player.Id);
        let total: number = 0;
        for (let record of records) {
            let leaseTimeMillis: number = 0;
            if (record.end != undefined) {
                leaseTimeMillis = record.end.getTime() - record.start.getTime();
            } else {
                leaseTimeMillis = new Date().getTime() - record.start.getTime();
            }
            total += (leaseTimeMillis / 3600000) * record.table.hourlyRate;
        }
        player.miscItems.forEach(item => total += +item.price);
        return total;
    }
}
