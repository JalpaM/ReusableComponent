import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service'

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  constructor(private dataService: DataService) { }
  public count = 0;
  public check_all = false;
  public Available_to_select = 0;
  public coloum_names = ['Name',"Device","Path","Status"]
  public device_data = [
    {name: 'smss.exe', device: 'Stark', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'Scheduled', checked:false},
    {name: 'netsh.exe', device: 'Targaryen', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'Available', checked:false},
    {name: 'uxtheme.dll', device: 'Lanniester', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll', status: 'Available', checked:false},
    {name: 'cryptbase.dll', device: 'Martell', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll', status: 'Scheduled', checked:false},
    {name: '7za.exe', device: 'Baratheon', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'Scheduled', checked:false}
  ];
  ngOnInit(): void {
    this.init()
    this.dataService.selectAllData$.pipe().subscribe(data => {
      if(data.length > 0){
        if(data[0].key == "select_All")
          this.selectAll(data[0].select_all);
        else if(data[0].key == "download")
          this.download();
        else
          this.select_device(data[0].selected_device);
      }
    });
  }
  selectAll(isSelectAll){
    let selected = 0;
    for(let i=0;i<this.device_data.length; i++){
      if(isSelectAll == true){
        var ele = document.getElementById("device"+i) as HTMLInputElement;
        ele.checked = true;
        this.device_data[i].checked = true;
        selected++;
      }else{
        var ele = document.getElementById("device"+i) as HTMLInputElement;
        ele.checked = false;
        this.device_data[i].checked = false;
      }
    }
    isSelectAll ? this.count = selected : this.count = 0;
  }
  select_device(index){
    if(this.device_data[index].checked !== false){
      var ele = document.getElementById("device"+index) as HTMLInputElement;
      ele.checked = true;
      this.count++;
      this.device_data[index].checked = true;
    }else{
      var ele = document.getElementById("device"+index) as HTMLInputElement;
      ele.checked = false;
      this.count--;
      this.device_data[index].checked = false;
    }
    this.checkForAllDeviceSelected();
  }
  checkForAllDeviceSelected(){
    if(this.count == this.Available_to_select){
      let ele = document.getElementById("selectAll") as HTMLInputElement;
      ele.indeterminate = false;
      ele.checked = true;
    }else{
      let ele = document.getElementById("selectAll") as HTMLInputElement;
      ele.indeterminate = true;
      //document.getElementById('check').indeterminate = true;
    }
  }
  init(){   
    this.Available_to_select = this.device_data.length;
  }
  download(){
    var selected_device = [];
    var selected_available_device = [];
    var selected_device_id = [];
    var selected_device_path = [];
    this.device_data.forEach(device => {
      if(device.checked == true){
        selected_device_id.push(device.device);
        selected_device_path.push(device.path);
        selected_device.push(device);
        if(device.status === "Available")
          selected_available_device.push(device);
      }
    });
    // tslint:disable-next-line:max-line-length
    alert("Selected device(s) are \n"+selected_device_id.join(",")+ "\n\nwith it's respective path locations are \n"+selected_device_path.join(","));
    if(selected_available_device.length > 0) {
      var columns = ['Name', 'Device', 'Path', 'Status',];


      var result = selected_available_device.map(function(obj) {
        return columns.map(function(key) {
          return obj[key.toLowerCase()];
        });
      });

      result.unshift(columns);
      console.log(result);
      let csvContent = "data:text/csv;charset=utf-8," + result.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF

      link.click();
    }
  }
}
