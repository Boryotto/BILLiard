import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MiscItem } from "../../models/misc-item.model";
import { IDGeneratorService } from "../../services/storage/id-generator.service";


@Component({
  selector: 'misc-item-form',
  templateUrl: './misc-item-form.template.html'
})
export class MiscItemFormComponent implements OnInit {

  @Output() onSubmitEvent: EventEmitter<MiscItem> = new EventEmitter<MiscItem>();
  @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() private bodyClass: string;
  @Input() private footerClass: string;

  public isFormValid: boolean = false;

  constructor(private IDGenerator: IDGeneratorService) { }

  model = new MiscItem(this.IDGenerator.generateId(), "", 489, new Date());

  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log("submitted!!");
  }

  ngOnInit(): void {
  }

}