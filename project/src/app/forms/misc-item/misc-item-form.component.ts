import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MiscItem } from "../../models/misc-item.model";
import { IDGeneratorService } from "../../services/storage/id-generator.service";
import { config } from '../../config';

@Component({
  selector: 'misc-item-form',
  templateUrl: './misc-item-form.template.html'
})
export class MiscItemFormComponent implements OnInit {

  @Output() onSubmitEvent: EventEmitter<MiscItem> = new EventEmitter<MiscItem>();
  @Output() onCancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() private bodyClass: string;
  @Input() private footerClass: string;

  constructor(private IDGenerator: IDGeneratorService) { }

  private model: MiscItem;
  private currencySymbol: string;

  onSubmit() {
    this.onSubmitEvent.emit(this.model);
    this.resetForm();
  }

  ngOnInit(): void {
    this.currencySymbol = config.currencySymbol;
    this.resetForm();
  }

  resetForm() {
    this.model = new MiscItem(this.IDGenerator.generateId(), "", 0, new Date());
  }

}