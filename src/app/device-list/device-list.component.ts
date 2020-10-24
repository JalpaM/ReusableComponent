import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  constructor(private dataService: DataService) { }
  public count = 0;
  // public check_all = false;
  public availableToSelect = 0;
  public columnNames = ['Name', 'Device', 'Path', 'Status'];
  public deviceData = [
    {name: 'smss.exe', device: 'Stark', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
      status: 'Scheduled', checked: false},
    {name: 'netsh.exe', device: 'Targaryen', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
      status: 'Available', checked: false},
    {name: 'uxtheme.dll', device: 'Lanniester', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
      status: 'Available', checked: false},
    {name: 'cryptbase.dll', device: 'Martell', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll',
      status: 'Scheduled', checked: false},
    {name: '7za.exe', device: 'Baratheon', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'Scheduled', checked: false}
  ];
  ngOnInit(): void {
    this.init();
    this.dataService.selectAllData$.pipe().subscribe(data => {
      if (data.length > 0) {
        if (data[0].key == 'select_All') {
          this.selectAll(data[0].select_all);
        } else if (data[0].key == 'download') {
          this.download();
 } else {
          this.select_device(data[0].selected_device);
 }
      }
    });
  }
  selectAll(isSelectAll) {
    let selected = 0;
    for (let i = 0; i < this.deviceData.length; i++) {
      if (isSelectAll ===  true) {
        const ele = document.getElementById('device' + i ) as HTMLInputElement;
        ele.checked = true;
        this.deviceData[i].checked = true;
        selected++;
      } else {
        const ele = document.getElementById('device' + i) as HTMLInputElement;
        ele.checked = false;
        this.deviceData[i].checked = false;
      }
    }
    isSelectAll ? this.count = selected : this.count = 0;
  }
  select_device(index) {
    if (this.deviceData[index].checked !== false) {
      const ele = document.getElementById('device' + index) as HTMLInputElement;
      ele.checked = true;
      this.count++;
      this.deviceData[index].checked = true;
    } else {
      const ele = document.getElementById('device' + index) as HTMLInputElement;
      ele.checked = false;
      this.count--;
      this.deviceData[index].checked = false;
    }
    this.checkForAllDeviceSelected();
  }
  checkForAllDeviceSelected() {
    if (this.count === this.availableToSelect) {
      const ele = document.getElementById('selectAll') as HTMLInputElement;
      ele.indeterminate = false;
      ele.checked = true;
    } else {
      const ele = document.getElementById('selectAll') as HTMLInputElement;
      ele.indeterminate = true;
    }
  }
  init() {
    this.availableToSelect = this.deviceData.length;
  }
  download() {
    const selectedDevice = [];
    const selectedAvailableDevice = [];
    const selectedDeviceId = [];
    const selectedDevicePath = [];
    this.deviceData.forEach(device => {
      if (device.checked === true) {
        selectedDeviceId.push(device.device);
        selectedDevicePath.push(device.path);
        selectedDevice.push(device);
        if (device.status === 'Available') {
          selectedAvailableDevice.push(device);
        }
      }
    });
    // tslint:disable-next-line:max-line-length
    alert('Selected device(s) are \n' + selectedDeviceId.join(',') + '\n\nwith it\'s respective path locations are \n' + selectedDevicePath.join(','));
    if (selectedAvailableDevice.length > 0) {
      const columns = ['Name', 'Device', 'Path', 'Status', ];


      const result = selectedAvailableDevice.map((obj) => {
        return columns.map((key) => {
          return obj[key.toLowerCase()];
        });
      });

      result.unshift(columns);
      console.log(result);
      const csvContent = 'data:text/csv;charset=utf-8,' + result.map(e => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'my_data.csv');
      document.body.appendChild(link); // Required for FF

      link.click();
    }
  }
}
