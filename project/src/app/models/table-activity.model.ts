import { Table } from "./table.model"
import { Player } from "./player.model"
import { TableMovement } from "./table-movement.model"
import { TableRecord } from "./table-record.model";

export class TableActivity {

    public constructor(
        public Id: number,
        public table: Table,
        public start: Date,
        public end: Date
    ) { }

}