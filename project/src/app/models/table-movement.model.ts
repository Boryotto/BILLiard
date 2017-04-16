import { Table } from "./table.model"

export class TableMovement {
    public constructor(
        public Id: number,
        public tableSource: Table,
        public tableDestination: Table,
        public date: Date
    ) { }
}