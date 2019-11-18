import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddLampDialogComponent } from '../add-lamp-dialog/add-lamp-dialog.component';
import { LampService } from 'src/app/services/lamp.service';
import Swal from 'sweetalert2';
import { EditLampComponent } from '../edit-lamp/edit-lamp.component';

@Component({
  selector: 'app-lamp',
  templateUrl: './lamp.component.html',
  styleUrls: ['./lamp.component.scss']
})
export class LampComponent implements OnInit {
  isSwitchedOn = false;
  lampList = [];
  currentImei: any;
  currentSite: any;
  currentVoltage: any;
  addLampDialog: MatDialogRef<AddLampDialogComponent>;
  editLampDialog: MatDialogRef<EditLampComponent>;
  enableBtn: boolean = false;
  currentDeviceName: any;
  currentRow: any;
  searchItems = [];
  searchType = 'imei';
  searchValue = '';
  unAlteredLampList = [];
  tempLampList = [];
  constructor(public dialog: MatDialog, private lampService: LampService) {
  }

  ngOnInit() {
    this.getLampList();
    this.searchItems = [{ value: 'imei' }, { value: 'poleid' },]
  }

  onActivate(e) {
    let row = e.row;
    if (row && e.type == 'click') {
      this.isSwitchedOn = row.isDeviceOn;
      this.currentImei = row.imei;
      this.currentSite = row.siteName;
      this.currentVoltage = row.voltage;
      this.currentDeviceName = row.name
      this.currentRow = row;
    }
  }

  openAddLampDialog() {
    this.addLampDialog = this.dialog.open(AddLampDialogComponent);
    this.addLampDialog.afterClosed().subscribe(res => {
      if (res) {
        let data = res.formData;
        data.groupId = res.groupId;
        this.lampService.addDevice(data).subscribe((resp: any) => {
          console.log(resp);
          if (resp.status && resp.status == 201) {
            Swal.fire({
              type: 'success',
              title: 'Device Added!'
            });
          } else {
            Swal.fire({
              type: 'error',
              title: 'Device adding failed! Try Again'
            });
          }
          this.lampList.push(resp.device);
          this.lampList = [...this.lampList];
          this.tempLampList = this.lampList;
          // unAlteredLampList.push    
        });
      }
    });
  }

  getLampList() {
    this.lampService.getAllDevices().subscribe((response: any) => {
      this.lampList = response.device;
      this.tempLampList = this.lampList;
      console.log(response.device);
      this.onActivate(this.lampList[0]);
    });
  }

  toggleSwitch(e) {
    setTimeout(() => {
      this.updateLamp(this.currentImei, this.isSwitchedOn);
    }, 1000);
  }

  setVoltage() {
    if (this.enableBtn) {
      setTimeout(() => {
        this.updateLamp(this.currentImei, this.isSwitchedOn, this.currentVoltage);
      }, 1000);
    }
  }



  updateLamp(imei, toggleStatus, voltage?) {
    let index;
    this.lampList.forEach((lamp, i) => {
      if (lamp.imei === imei) {
        if (voltage) {
          this.lampList[i].voltage = voltage;
        }
        this.lampList[i].isDeviceOn = toggleStatus ? 1 : 0;
        let data = this.lampList[i];
        this.lampService.updateDevice(imei, data).subscribe((response: any) => {
          // if (response.status == 201 || response.status == 200) {
          Swal.fire({
            type: 'success',
            title: 'Action successful!'
          });
          this.enableBtn = false;
          this.tempLampList = [...this.tempLampList];
          // }
        });
      }
    });


  }

  voltageChange() {
    this.enableBtn = true;
  }

  deleteRow(row) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${row.name}  with imei: ${row.imei} and pole id: ${row.poleId}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        let delImei = row._id;
        this.lampService.deleteDevice(delImei).subscribe((res: any) => {
          if (res.status && res.status === 200) {
            let data = this.lampList.map(el => el._id);
            let tempData = this.tempLampList.map(el => el.id);
            let kindex = data.findIndex(e => { return e === delImei });
            let tindex = tempData.findIndex(e => { return e === delImei });
            let lamplst = this.lampList;
            let tLamplst = this.tempLampList;
            lamplst.splice(kindex, 1);
            // tLamplst.splice(tindex, 1);
            this.lampList = [...lamplst];
            // this.tempLampList = [...tLamplst];
            Swal.fire(
              'Deleted!'
            )
          } else {
            Swal.fire(
              'Delete Failed!'
            )
          }
        });

      }
    });
  }


  editRow(row) {
    this.editLampDialog = this.dialog.open(EditLampComponent, {
      data: row
    });
    this.editLampDialog.afterClosed().subscribe(res => {
      if (res) {
        let dataEdit = res.formData;
        dataEdit['groupId'] = res.groupId;
        this.lampService.updateDevice(dataEdit.imei, dataEdit).subscribe((r: any) => {
          let device = r.device;
          if (device) {
            this.lampList.forEach((resp, count, arr) => {
              if (resp._id === device._id) {
                this.lampList[count] = device;
                this.lampList = [...this.lampList];
              }
            })
          }
          Swal.fire(
            'updated!')
        });
      }
    })
  }

  searchItem() {
    let imeiSearch;
    let poleIdSearch;
    // switch (this.searchType) {
    //   case 'imei': {
    //     imeiSearch = this.searchValue;
    //     poleIdSearch = '';
    //     return false;
    //   };
    //   case 'poleid': {
    //     imeiSearch = '';
    //     poleIdSearch = this.searchValue;
    //   }
    // }
     this.tempLampList = [];

    let toSearch = this.searchValue;

    for (var i = 0; i < this.lampList.length; i++) {
      for (let key in this.lampList[i]) {
        if ( this.lampList[i][key].indexOf(toSearch) != -1) {
          this.tempLampList.push(this.lampList[i]);
        }
      }
    }
  }

  resetLampList() {

  }
}
