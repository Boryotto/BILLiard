import { Component, OnInit, Input } from '@angular/core';
import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";


@Component({
    selector: 'bill',
    template: "{{ currentBill | currency:currencyISOCode:true:'1.2-2' }}"

})
export class BillDisplayerComponent implements OnInit {

    @Input() private table: Table;
    @Input() private event: GameEvent;
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
        if (this.event != undefined) {
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
        let leaseTimeMillis: number = new Date().getTime() - table.start.getTime();
        return (leaseTimeMillis / 3600000) * table.hourlyRate;
    }
}