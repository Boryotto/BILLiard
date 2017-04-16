import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'event',
  templateUrl: './event.template.html'
})
export class EventComponent implements OnInit {

  private eventId: number; // The event's Id

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
    })
  }

}
