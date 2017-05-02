import { Component, OnInit, Input } from '@angular/core';
import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { TableRecord } from "../models/table-record.model";


@Component({
    selector: 'bill',
    template: "{{ currentBill | currency:currencyISOCode:true:'1.2-2' }}"

})
export class BillDisplayerComponent implements OnInit {

    @Input() private table: Table;
    @Input() private event: GameEvent;
    @Input() private player: Player;
    @Input() private interval: number;

    private currentBill: number;
    private currencyISOCode: string;

    ngOnInit(): void {
        this.currencyISOCode = config.currencyISOCode;
        this.updateTotalBill();

        setInterval(() => {
            this.updateTotalBill();
        }, this.interval);
    }

    private updateTotalBill() {
        if (this.player != undefined && this.event != undefined) {
            this.currentBill = this.calculatePlayerBill(this.player);
        }
        else if (this.event != undefined) {
            this.currentBill = this.calculateEventBill(this.event);
        } else if (this.table != undefined) {
            this.currentBill = this.calculateTableBill(this.table);
        }
    }

    private calculateEventBill(event: GameEvent): number {
        let subBill: number = 0;
        for (let currentTable of event.tables) {
            subBill += this.calculateTableBill(currentTable);
        }
        return subBill;
    }

    private calculateTableBill(table: Table): number {
        if (table.start == undefined) {
            return 0;
        }
        let leaseTimeMillis: number = new Date().getTime() - table.start.getTime();
        return (leaseTimeMillis / 3600000) * table.hourlyRate;
    }

    private calculatePlayerBill(player: Player): number {
        let records: TableRecord[] = this.event.tableRecords.filter(record => record.player.Id === player.Id);
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
        player.miscItems.forEach(item => total += item.price);
        return total;
    }
}