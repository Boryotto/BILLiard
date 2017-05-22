import { Component, OnInit, Input } from '@angular/core';
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
export class BillDisplayerComponent implements OnInit {

    @Input() private table: Table;
    @Input() private event: GameEvent;
    @Input() private player: Player;
    @Input() private interval: number;

    private currentBill: number;
    private currencyISOCode: string;

    constructor(private moneyCalculator: MoneyCalculationsService) { }

    ngOnInit(): void {
        this.currencyISOCode = config.currencyISOCode;
        this.updateTotalBill();

        setInterval(() => {
            this.updateTotalBill();
        }, this.interval);
    }

    private updateTotalBill() {
        if (this.player != undefined && this.table != undefined && this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculatePlayerTableBill(this.player, this.table, this.event);
        }
        else if (this.player != undefined && this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculatePlayerBill(this.player, this.event);
        }
        else if (this.table != undefined && this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculateTableBill(this.table, this.event);
        }
        else if (this.event != undefined) {
            this.currentBill = this.moneyCalculator.calculateEventBill(this.event);
        }
    }

}