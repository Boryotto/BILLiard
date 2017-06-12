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
        let leaseTimeMillis: number = this.calculateOverallTablePlayTimeMillis(table, event);
        return (leaseTimeMillis / 3600000) * table.hourlyRate;
    }

    public calculatePlayerTableBill(player: Player, table: Table, event: GameEvent): number {
        let playedTimeMillis = 0;
        let totalTablePlayTimeMillis = 0;
        event.tableRecords.filter(record => record.table.Id === table.Id).forEach(record => {
            let recordPlayDuration;
            if (record.end)
                recordPlayDuration = record.end.getTime() - record.start.getTime();
            else
                recordPlayDuration = new Date().getTime() - record.start.getTime();

            totalTablePlayTimeMillis += recordPlayDuration;
            if (record.player.Id === player.Id)
                playedTimeMillis += recordPlayDuration;
        });
        if (totalTablePlayTimeMillis === 0)
            return 0;
        else
            return (playedTimeMillis / totalTablePlayTimeMillis) * this.calculateTotalTableBill(table, event);
    }

    private calculateTotalTableBill(table: Table, event: GameEvent): number {
        return (this.calculateTableTotalPlayTimeMillis(table, event) / 3600000) * table.hourlyRate;
    }

    private calculateOverallTablePlayTimeMillis(table: Table, event: GameEvent): number {
        let leaseTimeMillis: number = 0;
        event.tableActivities.filter(activity => activity.table.Id === table.Id).forEach(activity => {
            if (activity.end != undefined) {
                leaseTimeMillis += activity.end.getTime() - activity.start.getTime();
            } else {
                leaseTimeMillis += new Date().getTime() - activity.start.getTime();
            }
        });
        return leaseTimeMillis;
    }

    // Calculates the total time players played on the given table for each table activity in milliseconds 
    private calculateTableTotalPlayTimeMillis(table: Table, event: GameEvent): number {
        let totalPlayTime = 0;
        if (table && event) {

            event.tableActivities.filter(activity => activity.table.Id === table.Id).
                forEach(activity => {

                    let records: TableRecord[] = event.tableRecords.filter(record => {
                        if (record.table.Id === table.Id) {
                            if (record.end && activity.end)
                                return record.start.getTime() >= activity.start.getTime() && record.end.getTime() <= activity.end.getTime();
                            else if (record.end && !activity.end)
                                return record.start.getTime() >= activity.start.getTime();
                            else if (!record.end && !activity.end)
                                return true;
                            else
                                return false
                        }
                    });

                    let recordStartTimes = records.map(record => record.start.getTime());
                    let minStartTime = Math.min(...recordStartTimes);
                    let recordEndTimes = records.map(record => {
                        if (record.end)
                            return record.end.getTime();
                        else
                            return new Date().getTime();
                    });
                    let maxEndTime = Math.max(...recordEndTimes);
                    maxEndTime = maxEndTime === -Infinity ? 0 : maxEndTime;
                    minStartTime = minStartTime === Infinity ? 0 : minStartTime;
                    totalPlayTime += maxEndTime - minStartTime;
                });
        }
        return totalPlayTime;
    }

    public calculatePlayerBill(player: Player, event: GameEvent): number {
        let total: number = 0;
        event.tables.forEach(table => total += this.calculatePlayerTableBill(player, table, event));
        player.miscItems.forEach(item => total += +item.price);
        total += event.players.length === 0 ? 0 : this.calculateDeadTimeBill(event) / event.players.length;
        return total;
    }

    public calculateDeadTimeBill(event: GameEvent): number {
        let totalBill = 0;
        event.tables.forEach(table => {
            let totalTablePlayTime = this.calculateTableTotalPlayTimeMillis(table, event);
            let overallPlayTime = this.calculateOverallTablePlayTimeMillis(table, event);
            let totalDeadTime = overallPlayTime - totalTablePlayTime;
            totalBill += (totalDeadTime / 3600000) * table.hourlyRate;
        });
        return totalBill;
    }

    public calculateTableRecordBill(tableRecord: TableRecord): number {
        let millis: number = 0;
        let start: Date = new Date(tableRecord.start);
        let end: Date = new Date(tableRecord.end);
        if (end != undefined) {
            millis += end.getTime() - start.getTime();
        } else {
            millis += new Date().getTime() - start.getTime();
        }
        return (millis / 3600000) * tableRecord.table.hourlyRate;
    }
}
