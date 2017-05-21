import { Table } from "./table.model"
import { Player } from "./player.model"
import { TableMovement } from "./table-movement.model"
import { TableRecord } from "./table-record.model";
import { TableActivity } from "./table-activity.model";

export class GameEvent {

    public constructor(
        public Id: number,
        public name: string,
        public tables: Table[],
        public players: Player[],
        public hourlyRate: number,
        public movements: TableMovement[],
        public tableRecords: TableRecord[],
        public tableActivities: TableActivity[],
        public start: Date,
        public end: Date
    ) { }

}