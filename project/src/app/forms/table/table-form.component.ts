import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDGeneratorService } from "../../services/storage/id-generator.service";
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableMoveStatus } from "../../models/table-move-status.enum";

@Component({
    selector: 'table-form',
    templateUrl: './table-form.template.html'
})
export class TableFormComponent implements OnInit {

    @Output() onSubmitEvent: EventEmitter<Table> = new EventEmitter<Table>();
    @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;
    @Input() private defaultHourlyRate: number;

    private model: Table;
    private currencySymbol: string;

    constructor(private IDGenerator: IDGeneratorService) { }

    onSubmit() {
        this.model.start = new Date();
        this.onSubmitEvent.emit(this.model);
        this.resetForm();
    }

    ngOnInit(): void {
        this.currencySymbol = config.currencySymbol;
        this.resetForm();
    }

    resetForm() {
        this.model = new Table(
            this.IDGenerator.generateId(),
            "",
            this.defaultHourlyRate,
            null,
            null,
            true,
            TableMoveStatus.NULL
        );
    }

}
