import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { config } from '../config';
import { Table } from "../models/table.model";
import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { TableRecord } from "../models/table-record.model";
import { MoneyCalculationsService } from "../services/game/money-calculations.service";


@Component({
    selector: 'bill',
    template: "{{ currentBill | currency:currencyISOCode:true:'1.2-2' }}"
})
export class BillDisplayerComponent implements OnInit, OnDestroy {

    @Input() private table: Table;
    @Input() private event: GameEvent;
    @Input() private player: Player;
    @Input() private interval: number;
    @Input() private bill: number;
    @Input() private tableRecord: TableRecord;
    @Input() private tip: number;
    @Input() private displayDeadTimeBill: boolean;

    private currentBill: number;
    private currencyISOCode: string;
    private intervalToken: NodeJS.Timer;

    constructor(private moneyCalculator: MoneyCalculationsService) { }

    ngOnInit(): void {
        if (!this.tip)
            this.tip = 0;
        if (!this.interval)
            this.interval = config.defaultIntervalMillis;

        this.currencyISOCode = config.currencyISOCode;
        this.updateTotalBill();

        this.intervalToken = setInterval(() => {
            this.updateTotalBill();
        }, this.interval);
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalToken);
    }

    private updateTotalBill() {
        if (this.bill > -1) {
            this.currentBill = this.bill;
        } else if (this.tableRecord) {
            this.currentBill = this.moneyCalculator.calculateTableRecordBill(this.tableRecord);
        }
        else if (this.player != undefined && this.table != undefined && this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculatePlayerTableBill(this.player, this.table, this.event);
        }
        else if (this.player != undefined && this.event != undefined) {
            if (this.displayDeadTimeBill)
                this.currentBill = this.event.players.length === 0 ? 0 : this.moneyCalculator.calculateDeadTimeBill(this.event) / this.event.players.length;
            else
                this.currentBill = this.moneyCalculator.calculatePlayerBill(this.player, this.event);
        }
        else if (this.table != undefined && this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculateTableBill(this.table, this.event);
        }
        else if (this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculateEventBill(this.event);
        }
        // Apply tip
        this.currentBill += this.currentBill * (this.tip / 100);
    }

}