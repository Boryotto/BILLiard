import { MiscItem } from "./misc-item.model";

export class Player {

    public constructor(
        public Id: number,
        public name: string,
        public miscItems: MiscItem[]
    ) { }

}