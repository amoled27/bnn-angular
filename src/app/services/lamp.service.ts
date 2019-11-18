import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationUrls } from '../shared/application-urls';

@Injectable({
  providedIn: 'root'
})
export class LampService {
  // headers = new HttpHeaders()
  // .set('Access-Control-Allow-Origin', '*')
  // .set("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
  // .set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  createAuthorizationHeader(headers: HttpHeaders) {
    return headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

  getAllDevices() {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(ApplicationUrls.device.getAllDevices, { headers: headers }).pipe();
  }

  getOneDevice(deviceImei) {
    return this.http.get(ApplicationUrls.device.singleDevice + '/' + deviceImei).pipe();
  }

  updateDevice(deviceImei, data) {
    data = JSON.stringify(data);
    return this.http.post(ApplicationUrls.device.singleDevice + '/' + deviceImei, data).pipe();
  }

  deleteDevice(imei) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.delete(ApplicationUrls.device.deleteDevice + '/' + imei, { headers: headers }).pipe();
  }

  addDevice(data) {
    data = JSON.stringify(data);
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(ApplicationUrls.device.addDevice, data, { headers: headers }).pipe();
  }

  getDeviceByGroupId(id) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.get(ApplicationUrls.device.deviceByGroupId + '/' + id, { headers: headers }).pipe();
  }
  updateMultipleDevices(data) {
    data = JSON.stringify(data);
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    return this.http.post(ApplicationUrls.device.updateMultipleDevices, data, { headers: headers }).pipe();
  }
}
