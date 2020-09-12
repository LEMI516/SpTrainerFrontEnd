import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { GlobalVariable } from 'src/util/global';
import { retry, catchError } from 'rxjs/operators';
import { NotificationModel } from 'src/models/NotificationModel';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  getNotificationList(userid:number,rolId:string){
    let url = GlobalVariable.BASE_API_URL+"/notification/findbyuser/"+userid+"/"+rolId;
    return this.http.get<NotificationModel[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  getNotificationListNew(userid:number,rolId:string){
    let url = GlobalVariable.BASE_API_URL+"/notification/findbyusernew/"+userid+"/"+rolId;
    return this.http.get<NotificationModel[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }    

  getCountNotification(userid:number,rolId:string){
    let url = GlobalVariable.BASE_API_URL+"/notification/countnotificationnew/"+userid+"/"+rolId;
    return this.http.get<number>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  read_notification( notifications: Array<NotificationModel>){
    let url = GlobalVariable.BASE_API_URL+"/notification/update";
    return this.http.put(url,notifications).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }  
  
  createNotificationMasive( notifications: Array<NotificationModel>){
    let url = GlobalVariable.BASE_API_URL+"/notification/createmasive";
    return this.http.post(url,notifications).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   


  handleError(error) {
    return throwError(error);
  }   

}
