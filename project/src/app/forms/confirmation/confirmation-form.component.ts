import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDGeneratorService } from "../../services/storage/id-generator.service";
import { config } from '../../config';
import { Table } from "../../models/table.model";
import { TableMoveStatus } from "../../models/table-move-status.enum";

@Component({
    selector: 'confirmation-form',
    templateUrl: './confirmation-form.template.html'
})
export class ConfirmationFormComponent {

    @Output() onConfirmEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCancelEvent: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;

}
