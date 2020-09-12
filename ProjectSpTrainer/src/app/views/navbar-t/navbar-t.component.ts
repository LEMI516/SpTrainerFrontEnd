import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/service/notifications.service';
import { ToastService } from 'src/service/toast.service';
import { retry } from 'rxjs/operators';
import { NotificationModel } from 'src/models/NotificationModel';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-navbar-t',
  templateUrl: './navbar-t.component.html',
  styleUrls: ['./navbar-t.component.css']
})


export class NavbarTComponent implements OnInit {

  constructor(
    private router:Router,
    public notificationService:NotificationsService,
    public toastService:ToastService,
    private localService : LocalService
    ) { }

menu;
name:string=null;
userSesion:any;
  client= [
      {
       "nombre":"Mis Grupos",
       "src":"mygroup",
      },
      {
       "nombre":"Buscar Grupo",
       "src":"searchGroup",
      },
      {
        "nombre":"Actualizar datos",
        "src":"UPDATE_DATA",
       }      

 ];
 coach= [
    {
     "nombre":"Administrar Grupos",
     "src":"manage-group",
    },
    {
      "nombre":"Administrar Cliente",
      "src":"manage-client",
     },
    {
      "nombre":"Actualizar datos",
      "src":"UPDATE_DATA",
    },    

];

rol:string=null;
quantityNotification:number=0;
notificationList:NotificationModel[];
notificationListCurrent:Array<NotificationModel>=new Array<NotificationModel>();
msjnoti1:string="";
msjnoti2:string="";
msjnoti3:string="";
msjnoti4:string="";
msjnoti5:string="";
idnoti1:number;
idnoti2:number;
idnoti3:number;
idnoti4:number;
idnoti5:number;
msjnotidefault:string="";
quantityNotiShow:number=1;

  ngOnInit() {
    this.menuVar();
  }

  menuVar(){
    let usr=this.localService.getJsonValue('user'); 
    this.userSesion=JSON.parse(usr);
    if(usr==null || usr==undefined || usr=="null" || usr=="undefined"){
      this.router.navigateByUrl("/LoginComponent");
    }else{
      let ruta=localStorage.getItem('ruta');
      let obj = JSON.parse(usr);
      let rolid = obj.rolid;
      this.name=obj.firstname+" "+ obj.lastname;
      if(rolid=='coach'){
        ruta='/routerP/manage-group';
        this.menu=this.coach;
        this.rol="Entrenador";
        sessionStorage.setItem('ruta',ruta);
        this.router.navigateByUrl(ruta);
      }else{
        ruta='/routerP/mygroup';
        this.menu=this.client;
        this.rol="Cliente";
        sessionStorage.setItem('ruta',ruta);
        this.router.navigateByUrl(ruta);
      };

    }
  this.call();
  }

  closeSession(){
    this.localService.clearToken();
    this.router.navigateByUrl("/LoginComponent");
  }  

  getCountNotification(){
    this.notificationService.getNotificationListNew(this.userSesion.id,this.userSesion.rolid).subscribe(
      (response) => {
        this.notificationList=response;
        console.log(response);
        this.quantityNotification=this.notificationList.length;
        if(this.quantityNotification>0){
          this.validateNotifications();
          this.showNotificationMsj();
        }else{
          this.notificationListCurrent=new Array<NotificationModel>();
          this.toastService.removeAll();
        }
      },
      (error) => {}
    );    
  }   

  showNotification(customTpl,id) {
    this.toastService.show(customTpl, {classname: 'bg-info text-light',delay: 3000,autohide: false,id:id});
  }  

  showNotificationMsj(){
    //let notiNoShow = this.filterVisible();
    let notiNoShow = this.notificationListCurrent.filter(x=>!x.visible);
    let i=0;
    while(i<notiNoShow.length || this.quantityNotiShow>=5){
      let element: HTMLElement = document.getElementById('btnnoti'+this.quantityNotiShow) as HTMLElement;
      switch(this.quantityNotiShow){
        case 1:this.msjnoti1=notiNoShow[i].description;this.idnoti1=notiNoShow[i].id;break;
        case 2:this.msjnoti2=notiNoShow[i].description;this.idnoti2=notiNoShow[i].id;break;
        case 3:this.msjnoti3=notiNoShow[i].description;this.idnoti3=notiNoShow[i].id;break;
        case 4:this.msjnoti4=notiNoShow[i].description;this.idnoti4=notiNoShow[i].id;break;
        case 5:this.msjnoti5=notiNoShow[i].description;this.idnoti5=notiNoShow[i].id;break;
      }
      this.setvisibleNoti(notiNoShow[i]);
      this.quantityNotiShow++;
      i++;
      element.click();
    }
    if(this.quantityNotiShow>=5 && notiNoShow.length>0){
      let x=notiNoShow.length;
      this.msjnotidefault = x+' notificaciones más por ver ';
      let element: HTMLElement = document.getElementById('btnnoti6') as HTMLElement;
      element.click();
    }
  }

  filterVisible(){
    let n=new Array<NotificationModel>();
    for(let i in this.notificationListCurrent){
      if(!this.notificationListCurrent[i].visible){
        n.push(this.notificationListCurrent[i]);
      }
    }
    return n;
  }

  validateNotifications(){
    for(let i in this.notificationList){
      let exist:boolean=false;
      for(let j in this.notificationListCurrent){
        if(this.notificationListCurrent[j].id==this.notificationList[i].id){
          exist=true;
          break;
        }
      }
      if(!exist){
        this.notificationList[i].visible=false;
        this.notificationListCurrent.push(this.notificationList[i]);
      }
    }
  }

  setvisibleNoti(Noti:NotificationModel){
    for(let i in this.notificationListCurrent){
      if(this.notificationListCurrent[i].id==Noti.id){
        this.notificationListCurrent[i].visible=true;
        break;
      }
    }
  }

  call() {
    setInterval(() => {
      this.getCountNotification(); 
    }, 5000);
  }

  sendNotification(id){
    let notificationSend=new Array<NotificationModel>();
    let noti=this.notificationListCurrent.find(x=>x.id==id);
    noti.iduserread=this.userSesion.id;
    notificationSend.push(noti);
    this.notificationService.read_notification(notificationSend).subscribe(
      (response) => {
        this.toastService.removeforId(id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
