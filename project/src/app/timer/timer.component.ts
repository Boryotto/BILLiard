import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'timer',
    template: `
    <span *ngIf="calculateDayCount(currentDate) < 1 || !displayDays">{{ currentDate | date:"HH:mm:ss" }}</span>
    <span *ngIf="calculateDayCount(currentDate) >= 1 && displayDays">
        {{ currentDate | date:"HH:mm:ss" }} 
        ({{ calculateDayCount(currentDate) | number:'1.0-0'}})
    </span>
    `
})
export class TimerComponent implements OnInit {

    @Input() private start: Date;
    @Input() private active: boolean;
    @Input() private interval: number;
    @Input() private difference: boolean;
    @Input() private displayDays: boolean;

    private currentDate: Date;

    ngOnInit(): void {
        if (this.start == undefined) {
            this.currentDate = new Date(0);
            this.active = false;
        } else {
            this.currentDate = new Date(this.start);
            if (this.difference) {
                this.currentDate.setTime(new Date().getTime() - this.currentDate.getTime());
            }
        }
        this.currentDate.setMinutes(this.currentDate.getMinutes() + this.currentDate.getTimezoneOffset()) // Fix the timezone offset
        setInterval(() => {
            if (this.active) {
                this.currentDate = new Date(this.currentDate.getTime() + this.interval);
            }
        }, this.interval);

    }

    private calculateDayCount(date: Date): number {
        return date.getTime() / (1000 * 3600 * 24);
    }
}