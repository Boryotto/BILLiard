import { Component, OnInit, Input, OnDestroy } from '@angular/core';


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
export class TimerComponent implements OnInit, OnDestroy {

    @Input() private start: Date;
    @Input() private end: Date;
    @Input() private active: boolean;
    @Input() private interval: number;
    @Input() private difference: boolean;
    @Input() private displayDays: boolean;

    private currentDate: Date;
    private intervalToken: NodeJS.Timer;

    ngOnInit(): void {
        this.currentDate = new Date();
        if (this.start == undefined) {
            this.active = true;
        } else {
            this.currentDate = new Date(this.start);
            if (this.difference) {
                if (this.end == undefined)
                    this.currentDate.setTime(new Date().getTime() - this.currentDate.getTime());
                else
                    this.currentDate.setTime(this.end.getTime() - this.currentDate.getTime());
            }
            this.currentDate.setMinutes(this.currentDate.getMinutes() + this.currentDate.getTimezoneOffset()) // Fix the timezone offset            
        }

        if (this.interval == undefined || this.interval === 0) {
            this.interval = 1000;
        }

        this.intervalToken = setInterval(() => {
            if (this.active) {
                this.currentDate = new Date(this.currentDate.getTime() + this.interval);
            }
        }, this.interval);

    }

    ngOnDestroy(): void {
        clearInterval(this.intervalToken);
    }

    private calculateDayCount(date: Date): number {
        return date.getTime() / (1000 * 3600 * 24);
    }
}