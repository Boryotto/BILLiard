import { MiscItem } from "./misc-item.model";
import { TableRecord } from "./table-record.mode";

export class Player {

    public constructor(
        public Id: number,
        public name: string,
        public records: TableRecord[],
        public miscItems: MiscItem[]
    ) { }

}