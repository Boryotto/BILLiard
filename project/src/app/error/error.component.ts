import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { config, errorCodes } from '../config';

@Component({
    selector: 'error',
    templateUrl: './error.template.html',
    styleUrls: ['./error.stylesheet.css']
})
export class ErrorComponent implements OnInit {

    private errorCode: number;
    private message: string;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.errorCode = +params['id'];
        });

        this.message = errorCodes[this.errorCode];
        console.log(this.message);
    }

}