import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  private selectDeviceSource = new BehaviorSubject([]);
  selectAllData$ = this.selectDeviceSource.asObservable();

  selectedDevice(data) {
      this.selectDeviceSource.next(data);
  }
}
