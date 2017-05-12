import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MiscItem } from "../../models/misc-item.model";
import { Table } from "../../models/table.model";
import { GameCalculationsService } from "../../services/game/game-calculations.service";
import { ActivatedRoute } from "@angular/router";
import { LocalDataStorerService } from "../../services/storage/local-data-storer.service";
import { GameEvent } from "../../models/game-event.model";


@Component({
    selector: 'table-picker',
    templateUrl: './table-picker-form.template.html'
})
export class TablePickerFormComponent implements OnInit {

    @Output() onSubmitEvent: EventEmitter<Table> = new EventEmitter<Table>();
    @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;
    @Input() private tables: Table[];

    private eventId: number;
    private event: GameEvent;

    private chosenTableId: number;

    constructor(
        private route: ActivatedRoute,
        private dataStorer: LocalDataStorerService,
        private gameCalculator: GameCalculationsService
    ) { }


    onSubmit() {
        let chosenTable: Table = this.tables.find(table => table.Id === this.chosenTableId);
        this.onSubmitEvent.emit(chosenTable);
        this.resetForm();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.eventId = +params['eventId'];
            this.dataStorer.getGameEvent(this.eventId).then(event => this.event = event);
        });

        this.resetForm();
    }

    public resetForm() {
        this.chosenTableId = -1;
    }

    private setChosenTable(table: Table) {
        this.chosenTableId = table.Id;

    }

}