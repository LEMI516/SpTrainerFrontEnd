import { Injectable } from '@angular/core';
import { ImageCalificate } from 'src/models/ImageCalificate';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];  

  constructor() { }

  defineDistance(distance:number){
      if(distance>=0 && distance<=0.5){
        return "Muy Cerca";
      }else if(distance>0.5 && distance<=1.3){
        return "Cercano";
      }else if(distance>1.3 && distance<=5.3){
        return "Lejos";
      }else{
        return "Muy lejos";
      }
  }

  stringToDate(fecha:string){
    let parts=fecha.split('-');
    let mydate = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])); 
    return mydate.getDate()+" de "+this.months[mydate.getMonth()]+" de "+mydate.getFullYear();
  }

  stringToDate2(fecha:string){
    let parts=fecha.split('-');
    return parts[2]+"/"+parts[1]+"/"+parts[0];
  }  

  getDateOfString(fecha:string){
    let parts=fecha.split('-');
    let mydate = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])); 
    return mydate;    
  }

  getDatePublishGroup(fecha:string){
    let dateGroup = new Date(fecha);
    let currentDate = new Date();
    var diasdif= currentDate.getTime()-dateGroup.getTime();
    var contdias = Math.round(diasdif/(1000*60*60*24));     
    if(contdias>7 && contdias<15){
      return "Hace "+2+" semanas";
    }else if(contdias>=15 && contdias<23){
      return "Hace "+3+" semanas";
    }else if(contdias>=23 && contdias<32){
      return "Hace "+1+" mes";
    }else if(contdias>=31 && contdias<93){
      return "Hace "+3+" mes";
    }else if(contdias>=93 && contdias<186){
      return "Hace "+6+" mes";
    }else if(contdias>=93 && contdias<187){
      return "Hace "+6+" mes";
    }else if(contdias>=187 && contdias<365){
      return "Hace "+1+" año";
    }else if(contdias>365){
      return "Hace más de una año";
    }else{
      return "Hace "+contdias+" días";
    }
  }

  getListUbications(sessions:any){
    let ubications=new Array();
    for(let i in sessions){
      let position=this.getPosition(sessions[i].coordinate);
      let marker={'lat':position.lat,'lng':position.lng,'label':sessions[i].name };
      ubications.push(marker);
    }
    return ubications;
  }

  getPosition(location:string){
    let pos=location.replace("[","");
    pos=pos.replace("]","");
    let parts=pos.split(",");
    let lat=Number(parts[0]);
    let lon=Number(parts[1]);
    return {'lat':lat,'lng':lon};
  }

  trim(txt:string){
    return txt.replace(/^\s+|\s+$/g, ''); 
  }

  ageCalculator(fecha:string){
      const convertAge = new Date(fecha);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      return age;
  }  

  getImagesCalificate(){
    let images=new Array<ImageCalificate>();
    for(let i=4;i>=0;i--){
      let im=new ImageCalificate();
      im.rating=i+1;
      im.marked=false;
      im.color='gray';
      images.push(im);
    }
    return images;
  }

  getTypeNotification(type:string){
    if(type==="REQUEST"){
      return "Solicitud de Inscripción";
    }else if(type=="GENERAL"){
      return "Nuevo Grupo";
    }else{
      return "Notificación"
    }
  }

  getDateNoti(fecha:string){
    let dateGroup = new Date(fecha);
    let currentDate = new Date();
    let diffMs = (currentDate.getTime() - dateGroup.getTime()); // milliseconds between now & Christmas
    let diffDays = Math.round(diffMs/(1000*60*60*24)); // days
    let diffHrs = Math.round(diffMs/(1000*60*60)) // hours
    let diffMins = Math.round(diffMs/(1000*60)) // minutes 
    if(diffMins<=60){
      return "Hace "+diffMins+" minuto(s)";
    }else if(diffHrs<=24){
      return "Hace "+3+" hora(s)";
    }else if(diffDays>1 && diffDays<=7){
      return "Hace "+diffDays+" día(s)";
    }else if(diffDays>7 && diffDays<15){
      return "Hace "+2+" semanas";
    }else if(diffDays>=15 && diffDays<23){
      return "Hace "+3+" semanas";
    }else if(diffDays>=31 && diffDays<93){
      return "Hace "+3+" mes";
    }else if(diffDays>=93 && diffDays<186){
      return "Hace "+6+" mes";
    }else if(diffDays>=187 && diffDays<365){
      return "Hace "+1+" año";
    }else if(diffDays>365){
      return "Hace más de una año";
    }else{
      return "Hace "+diffDays+" días";
    }
  }  
  



}
