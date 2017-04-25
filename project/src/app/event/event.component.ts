import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Player } from "../models/player.model";
import { GameEvent } from "../models/game-event.model";
import { Table } from "../models/table.model";
import { TableMoveStatus } from "../models/table-move-status.enum";
import { TableMovement } from "../models/table-movement.model";
import { TableRecord } from "../models/table-record.model";
import { config } from '../config';

@Component({
  selector: 'event',
  templateUrl: './event.template.html',
  styleUrls: ['./event.stylesheet.css']
})
export class EventComponent implements OnInit {

  private eventId: number; // The event's Id
  private event: GameEvent;
  private currencyISOCode: string = config.currencyISOCode;

  constructor(
    private route: ActivatedRoute,
    private dataStorer: LocalDataStorerService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
    })

    let eventName = "New Event";
    let tables: Table[] = [
      new Table(1003, 'Table 23', 56.90, new Date(2017, 3, 24, 22, 0, 0, 0), null, true, TableMoveStatus.NULL),
      new Table(1003, 'Table 53', 56.90, new Date(2017, 3, 24, 22, 0, 0, 0), null, false, TableMoveStatus.NULL)
    ];
    let players: Player[] = [new Player(50069, 'Mor Koshokaro', [])];
    let movements: TableMovement[] = [];
    let tableRecords: TableRecord[] = [new TableRecord(80, tables[0], players[0], new Date(2017, 3, 24, 22, 0, 0, 0), null)]
    this.event = new GameEvent(1030, eventName, tables, players, NaN, movements, tableRecords, new Date(), null);
  }

  private calculatePlayersOnTable(table: Table) {
    return this.event.tableRecords.filter((tableRecord: TableRecord) => tableRecord.table.Id === table.Id && tableRecord.end == undefined).length;
  }
} 
