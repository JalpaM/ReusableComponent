import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import {DataService} from '../service/data.service'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private dataService: DataService) { }
  public check_all = false;
  public count = 0;
  public Available_to_select = 0;
  @Input() deviceData = [];
  @Input() coloumn_name = [];
  @Input() isShowCOunt = false;
  @Input() isExportAvailable = false;
  ngOnInit(): void {
  }
  selectAll(){
    this.check_all = !this.check_all
    this.check_all == true ? this.count = this.deviceData.length : this.count = 0;
    if(this.check_all == true){
      this.deviceData.forEach((device)=>{
        device.checked = true;
      })
    }
    this.dataService.selectedDevice([{"key":"select_All","select_all":this.check_all}]);
  }
  select_device(index){
    this.count = 0;
    this.deviceData[index].checked = !this.deviceData[index].checked;
    this.deviceData.forEach((device)=>{
      device.checked == true ? this.count++ : "";
    })
    this.dataService.selectedDevice([{"key":"select_one","selected_device":index}])
    //this.checkForAllDeviceSelected();
  }
  download(){
    this.dataService.selectedDevice([{"key":"download"}])
  }
  checkForAllDeviceSelected(){
    // if(this.count == this.availableToSelect){
    //   let ele = document.getElementById("selectAll") as HTMLInputElement;
    //   ele.checked = true;
    // }else{
    //   let ele = document.getElementById("selectAll") as HTMLInputElement;
    //   ele.checked = false;
    // }
  }
}
