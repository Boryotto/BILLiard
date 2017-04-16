import { Table } from "./table.model"
import { Player } from "./player.model"

export class TableRecord {
    public constructor(
        public Id: number,
        public table: Table,
        public player: Player,
        public start: Date,
        public end: Date
    ) { }
}