import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDGeneratorService } from "../../services/storage/id-generator.service";
import { config } from '../../config';
import { Player } from "../../models/player.model";

@Component({
    selector: 'player-form',
    templateUrl: './player-form.template.html'
})
export class PlayerFormComponent implements OnInit {

    @Output() onSubmitEvent: EventEmitter<Player> = new EventEmitter<Player>();
    @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
    @Input() private bodyClass: string;
    @Input() private footerClass: string;

    private model: Player;

    constructor(private IDGenerator: IDGeneratorService) { }

    onSubmit() {
        this.onSubmitEvent.emit(this.model);
        this.resetForm();
    }

    ngOnInit(): void {
        this.resetForm();
    }

    resetForm() {
        this.model = new Player(
            this.IDGenerator.generateId(),
            "",
            [],
        );
    }


}
