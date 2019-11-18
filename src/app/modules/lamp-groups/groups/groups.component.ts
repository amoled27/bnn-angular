import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { GroupService } from 'src/app/services/group.service';
import Swal from 'sweetalert2';
import { LampService } from 'src/app/services/lamp.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  lampList = [];
  groupList = [];
  createGroupDialog: MatDialogRef<CreateGroupDialogComponent>;
  recentVoltage = 0;
  enableBtn = false;
  showLamps: boolean = false;
  selectedGroup: boolean;
  selectedGroupId: any;
  // selectedGrpOption = 'groupTransefer';
  selectedGrpOption = 'groupInfo';
  info: boolean = true;
  transfer: boolean = false;
  selectedFromGrp;
  selectedToGrp;
  lampListTransferA = [];
  lampListTransferB = [];
  selectedForTransfer = [];
  selectedImeiForTransfer = [];
  frmSelect;
  toSelect;
  // SelectionType = SelectionType;
  constructor(private dialog: MatDialog, private groupService: GroupService, private lampService: LampService) { }

  ngOnInit() {
    this.getAllGroups();
  }

  onCreateGroupDialog() {
    this.createGroupDialog = this.dialog.open(CreateGroupDialogComponent)
    this.createGroupDialog.afterClosed().subscribe(res => {
      if (res) {
        let data = {
          name: res.name,
          areaId: res.areaId._id
        }
        this.groupService.addGroup(data).subscribe((resp: any) => {
          Swal.fire({
            type: 'success',
            title: 'Group was added!',
            text: `Group ${data.name} was added to Area ${res.areaId.areaShortName}`
          });
          res._id = resp.group._id;
          this.groupList.push(res);
          this.groupList = [...this.groupList];
        });
      }
    });
  }

  getAllGroups() {
    this.groupService.getGroups().subscribe((res: any) => {
      this.groupList = res.groups;
      console.log(this.groupList, 'grplist')
    });
  }

  onActivate(event) {
    if (event.type === 'click') {
      this.selectedGroupId = event.row._id;
      this.selectedGroup = event.row.name;
      this.showLamps = false;
      this.enableBtn = false;
      this.recentVoltage = event.row.recentVoltage ? event.row.recentVoltage : 3;
      this.selectedForTransfer = [...this.selectedForTransfer];
    }
  }
  voltageChange() {
    this.enableBtn = true;
  }

  setVoltage() {
    let data = {
      voltage: this.recentVoltage,
      groupId: this.selectedGroupId
    }
    this.groupService.setGroupVoltage(data).subscribe(res => {
      Swal.fire({
        type: 'success',
        title: 'Voltage set successfully!',
        text: `Voltage for ${this.selectedGroup} was set to ${data.voltage}`
      });
    });
  }

  showLampList() {
    this.showLamps = true;
    this.lampService.getDeviceByGroupId(this.selectedGroupId).subscribe((res: any) => {
      console.log(res.devices, 'sdkadlsakdlsakdlaskdlsakdlasklsa')
      this.lampList = res.devices;
    });
    //get lamps as per group ID
  }

  editRow() {

  }
  selectFromGroup(grp) {
    this.selectedFromGrp = grp;
    this.lampService.getDeviceByGroupId(grp._id).subscribe((res: any) => {
      this.lampListTransferA = res.devices;
    });
  }
  selectToGroup(grp) {
    this.selectedToGrp = grp;
    console.log(grp, 'togrp')
    this.lampService.getDeviceByGroupId(grp._id).subscribe((res: any) => {
      this.lampListTransferB = res.devices;
    });
  }

  transferLamps() {
    this.selectedForTransfer.forEach((lamp, inedx, arr) => {
      lamp.groupId = this.selectedToGrp;
      if (arr.length - 1 === inedx) {
        // let data = {...this.selectedForTransfer};
        this.lampService.updateMultipleDevices( this.selectedForTransfer).subscribe((res: any) => {
          if (res.statusCode == 201) {
            Swal.fire({
              type: 'success',
              title: 'Groups Updated!',
            })
            this.selectedForTransfer = [];
            this.selectedFromGrp = '';
            this.frmSelect = '';
            this.toSelect = ''
            this.lampListTransferA = [];
          }
          console.log(res, 'updated');
        });
      }
    });
  }
}

