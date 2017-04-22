import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'timer',
    template: '{{ pad(currentDate.getHours(), 2) }}:{{ pad(currentDate.getMinutes(), 2)}}:{{ pad(currentDate.getSeconds(),2)}}',
})
export class TimerComponent implements OnInit {

    @Input() private start: Date;
    @Input() private interval: number;
    private currentDate: Date;

    ngOnInit(): void {
        this.currentDate = this.start;
        setInterval(() => {
            this.currentDate.setTime(this.currentDate.getTime() + this.interval);
        }, this.interval);
    }

    private pad(num: number, length: number): string {
        let result: string = num.toString();
        if (result.length < length) {
            for (let i = 0; i < length - result.length; i++) {
                result = '0' + result;
            }
        }
        return result;
    }
}