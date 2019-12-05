import { Component, OnInit, Inject } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LampService } from 'src/app/services/lamp.service';

@Component({
  selector: 'app-edit-lamp',
  templateUrl: './edit-lamp.component.html',
  styleUrls: ['./edit-lamp.component.scss']
})
export class EditLampComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditLampComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private groupService: GroupService, private lampService: LampService) { }
  form: FormGroup;
  groups: any = [];
  selectedGroupId: any;
  lampList;
  currentImei;
  ngOnInit() {
    this.getGroups();
    this.buildForm();
    this.currentImei = this.data.imei;
  }

  buildForm() {
    this.form = this.fb.group({
      'name': [null],
      'imei': [null, Validators.required],
      'siteName': [null],
      'voltage': [0],
      'status': [false],
      'bnnId': [null],
      'poleId': [null],
      'groupId': [null, Validators.required],
    });
  }
  getData() {
    console.log(this.data, 'dataa');
    let stattus = this.data.isDeviceOn ? true : false;
    let formData = {
      'name': this.data.name,
      'imei': this.data.imei,
      'siteName': this.data.siteName,
      'voltage': this.data.voltage,
      'status': stattus || false,
      'bnnId': this.data.bnnId,
      'poleId': this.data.poleId || '',
      'groupId': this.data.groupId.name ? this.data.groupId.name : ''
    };
    this.selectedGroupId = this.data.groupId;
    let gName = this.groups.find(r => { if (r._id === this.data.groupId) { return r.name } });
    if (gName) {
      formData.groupId = gName.name;
    }
    this.form.setValue(formData);
    // this.form.value.name =e;
    // this.form.value.imei = ;
    // this.form.value.siteName = ;
    // this.form.value.voltage =;
    // this.form.value.status =;
    // this.form.value.bnnId = ;
    // this.form.value.poleId =; 
    // this.form.value.groupId =;
  }
  getGroups() {
    this.groupService.getGroups().subscribe((res: any) => {
      this.groups = res.groups;
      this.getData();
    });
  }
  onSelectGroup(group) {
    this.selectedGroupId = group._id;
  }
  saveData() {
    let data = {
      formData : this.form.value,
      groupId : this.selectedGroupId,
      imei: this.currentImei
    }
    this.dialogRef.close(data);
  }
}
