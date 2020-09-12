import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/service/notifications.service';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationModel } from 'src/models/NotificationModel';
import { UtilService } from 'src/service/util.service';
import { LocalService } from 'src/service/local.service';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-group-notifications',
  templateUrl: './group-notifications.component.html',
  styleUrls: ['./group-notifications.component.css']
})
export class GroupNotificationsComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 6;
  pageSize: number;
  sizeList:number=0;
  btnfilter: boolean = true;
  sltDate: boolean = true;
  sltType: boolean = true;
  filterSelect = "1";
  lista: string[] = ["Seleccione", "Fecha", "Tipo"];
  seleccionados = "Seleccione";
  notificationsList:NotificationModel[];
  notificationsListAux:NotificationModel[];
  userSesion: any;
  notificationSend:Array<NotificationModel>=new Array<NotificationModel>();
  messageEmpty:string = ""; 
  quantityNotifications:number = 0;  

  constructor(
    public notificationService:NotificationsService,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    public utilService : UtilService,
    private localService : LocalService,
    private filterPipe: FilterPipe
  ) { }

  ngOnInit() {
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.loadNotificationsUser();
  }


  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  viewsFilter() {
    this.btnfilter = false;
  }
  funtionSeltType() {
    if (this.seleccionados == 'Fecha') {
      this.sltDate = false;
      this.sltType = true;
    } else if (this.seleccionados == 'Tipo') {
      this.sltDate = true;
      this.sltType = false;
    } else {
      this.sltDate = true;
      this.sltType = true;
    }
  }

  loadNotificationsUser() {
    this.SpinnerService.show();
    this.notificationService.getNotificationList(this.userSesion.id,this.userSesion.rolid).subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.notificationsList = response;
        this.notificationsListAux=response;
        this.sizeList = this.notificationsList.length;
        this.validateNotificationsSend();
        this.quantityNotifications = this.notificationsList.length;
        this.showMessageEmpty();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );
  }  

  sendReadNotifications() {
    this.SpinnerService.show();
    this.notificationService.read_notification(this.notificationSend).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );
  }    

  getTitle(type:string){
    return this.utilService.getTypeNotification(type);
  }

  getDateNoti(fecha:string){
    return this.utilService.getDateNoti(fecha);
  }

  validateNotificationsSend(){
    this.notificationSend==new Array<NotificationModel>();
    for(let i in this.notificationsList){
      if(this.notificationsList[i].state=='NO'){
        this.notificationsList[i].iduserread=this.userSesion.id;
        this.notificationSend.push(this.notificationsList[i]);
      }
    }
    if(this.notificationSend.length>0){
      this.sendReadNotifications();
    }
  }

  /* Validar Contenido vacio */
  showMessageEmpty(){
    this.messageEmpty=(this.quantityNotifications==0)?"No se encontraron notificaciones en la consulta realizada":"";
  }
  findC='';
  
  filterN(){
    this.notificationsList = this.notificationsListAux;
   if (this.findC != "") {

     if (this.filterPipe.transform(this.notificationsList, { type_notification: this.findC }).length != 0) {
       this.notificationsList = this.filterPipe.transform(this.notificationsList, { type_notification: this.findC });

     } 
     if (this.filterPipe.transform(this.notificationsList, { datenotificacion: this.findC }).length != 0) {
       this.notificationsList = this.filterPipe.transform(this.notificationsList, { datenotificacion: this.findC });

     } 
     if (this.filterPipe.transform(this.notificationsList, { description: this.findC }).length != 0) {
       this.notificationsList = this.filterPipe.transform(this.notificationsList, { description: this.findC });

     } 
  
   }
 }

}
