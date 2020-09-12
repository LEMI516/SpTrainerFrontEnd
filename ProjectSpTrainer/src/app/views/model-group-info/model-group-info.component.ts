import { Component, OnInit, Input, NgZone } from '@angular/core';
import { GroupTrainer } from 'src/models/GroupTrainer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { UtilService } from 'src/service/util.service';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MemberService } from 'src/service/member.service';
import { GlobalVariable } from 'src/util/global';
import { calification } from 'src/models/calification';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-model-group-info',
  templateUrl: './model-group-info.component.html',
  styleUrls: ['./model-group-info.component.css']
})
export class ModelGroupInfoComponent implements OnInit {
  closeResult: string;
  title: string = 'AGM project'; 
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  ubications: any;
  userSesion:any;
  isQualify:boolean=false;

  @Input() fromParent;
  @Input() group: GroupTrainer=new GroupTrainer;  

  constructor(
    public activeModal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public utilService: UtilService,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    public memberService : MemberService,
    private localService : LocalService  
  ) { }

  ngOnInit() {
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    if(this.fromParent.prop1==='MYGROUP') this.isQualify=true;
    this.ubications=this.utilService.getListUbications(this.group.sessions);
    this.setCalificateTrainer();
    this.loadMap();    
  }

  closeModal(sendData) { 
    this.activeModal.close(sendData); 
  }  

  setFormatDate(fecha:string){
    return this.utilService.stringToDate(fecha);
  }

  setCalificateTrainer(){
    let calificates=this.utilService.getImagesCalificate();
    for(let j=0;j<this.group.calificationuser.score;j++){
      calificates[4-j].marked=true;
      calificates[4-j].color='#8DC349';
    } 
    this.group.imagecalificate=calificates;
  }

  getScoreCalificateTotal(cal:calification){
    let calificates=this.utilService.getImagesCalificate();
    let j=0;
    do{
      calificates[4-j].marked=true;
      calificates[4-j].color='orange';
      j++;
    }while(j<cal.score); 
    let decimal=cal.scoretotal-cal.score;
    if(decimal>0.0){
      let por=decimal*100;
      let resta=100-por; 
      calificates[4-j].marked=true;
      calificates[4-j].color='orange';
      calificates[4-j].por1=por;
      calificates[4-j].por2=resta;
    }
    return calificates;
  }

  clickCalificate(cal:number){
    let calificates=this.utilService.getImagesCalificate();
    for(let j=0;j<cal;j++){
      calificates[4-j].marked=true;
      calificates[4-j].color='orange';
    } 
    this.group.imagecalificate=calificates;
    this.group.calificationuser.score=cal;
    let calification=this.group.calificationuser;
    this.SpinnerService.show();
    this.memberService.calificateMember(calification).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        console.log(response);
        this.showMsj('Exitoso!',"Entrenador calificado",GlobalVariable.MSJ_OK);  
      },
      (error) => {
        this.SpinnerService.hide(); 
        console.log(error);
        this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
      }
    );    
  }  

  loadMap(){
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }
 
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }  

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }   

}
