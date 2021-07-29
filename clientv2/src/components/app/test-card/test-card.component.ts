import { FilterOptions } from '@/classes/logs/filters/manager';
import { LogList } from '@/services/list.service';
import { Manager } from '@/services/manager.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.css']
})
export class TestCardComponent implements OnInit {
  filter_opts: FilterOptions
  data: any = {}

  constructor(
    private log_list: LogList,
    private mgr: Manager
  ) {
    this.filter_opts = {}
    this.filter_opts[Manager.cats.AGE] = [30]
    this.filter_opts[Manager.cats.TYPE] = ["Grindfest"]
  }

  ngOnInit(): void {
    this.log_list.fetch().subscribe()

    this.mgr.get_add$(this.filter_opts).subscribe(
      data => {
        console.log('card got', data)
        this.data = JSON.stringify(data)
      }
    )
  }
}
