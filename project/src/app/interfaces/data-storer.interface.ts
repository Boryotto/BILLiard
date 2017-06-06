import { GameEvent } from "../models/game-event.model";
import { Player } from "../models/player.model";
import { MiscItem } from "../models/misc-item.model";
import { Table } from "../models/table.model";
import { TableRecord } from "../models/table-record.model";
import { TableMovement } from "../models/table-movement.model";

export interface IDataStorer {

    getAllGameEvents(): Promise<GameEvent[]>;

    getGameEvent(eventId: number): Promise<GameEvent>;
    storeGameEvent(event: GameEvent): void;

    getPlayer(playerId: number): Promise<Player>;
    storePlayer(player: Player): void;

    getTable(tableId: number): Promise<Table>;
    storeTable(table: Table): void;

    getMiscItem(itemId: number): Promise<MiscItem>;
    storeMiscItem(item: MiscItem): void;

    getTableRecord(recordId: number): Promise<TableRecord>;
    storeTableRecord(record: TableRecord): void;

    getTableMovement(movementId: number): Promise<TableMovement>;
    storeTableMovement(movement: TableMovement): void;
}