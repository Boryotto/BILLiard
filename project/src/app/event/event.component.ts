import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalDataStorerService } from "../services/storage/local-data-storer.service";
import { MiscItem } from "../models/misc-item.model";
import { Player } from "../models/player.model";
import { GameEvent } from "../models/game-event.model";
import { Table } from "../models/table.model";
import { TableMoveStatus } from "../models/table-move-status.enum";
import { TableMovement } from "../models/table-movement.model";
import { TableRecord } from "../models/table-record.model";
import { config } from '../config';
import { GameCalculationsService } from "../services/game/game-calculations.service";

@Component({
  selector: 'event',
  templateUrl: './event.template.html',
  styleUrls: ['./event.stylesheet.css']
})
export class EventComponent implements OnInit {

  private eventId: number; // The event's Id
  private event: GameEvent;
  private currencyISOCode: string = config.currencyISOCode;

  private isEditingName: boolean;
  private enteredEventName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorer: LocalDataStorerService,
    private gameCalculator: GameCalculationsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId'];
    })
    this.dataStorer.getGameEvent(this.eventId).then(resolvedEvent => this.event = resolvedEvent).catch(reason => {
      this.router.navigate(['/error'])
    });

    // let eventName = "New Event";
    // let tables: Table[] = [
    //   new Table(1003, 'Table 23', 56.90, new Date(2017, 3, 25, 22, 0, 0, 0), null, true, TableMoveStatus.NULL),
    //   new Table(1023, 'Table 53', 56.90, null, null, false, TableMoveStatus.NULL)
    // ];
    // let players: Player[] = [
    //   new Player(50069, 'Mor Koshokaro', [new MiscItem(5556, "Weinstepfen Beer", 35.50, new Date(2017, 4, 2, 23, 0, 0, 0))]),
    //   new Player(504069, 'Maya Levy', []),
    //   new Player(503069, 'Lior Sarfati', []),
    //   new Player(507069, 'Yuval Milman', []),
    //   new Player(506069, 'Gadiel Ben Shitrit', []),
    //   new Player(505069, 'Tal Zehazi', []),
    // ];
    // let movements: TableMovement[] = [];
    // let tableRecords: TableRecord[] = [new TableRecord(80, tables[0], players[0], new Date(2017, 3, 25, 22, 0, 0, 0), null)]
    // this.event = new GameEvent(1030, eventName, tables, players, 156, movements, tableRecords, new Date(), null);

    // this.dataStorer.storeGameEvent(this.event);
  }

  private onChangeName() {
    console.debug(`Changing event name from: ${this.event.name} to: ${this.enteredEventName}`);
    this.event.name = this.enteredEventName;
    this.dataStorer.storeGameEvent(this.event);
    this.isEditingName = false;
  }

} 
