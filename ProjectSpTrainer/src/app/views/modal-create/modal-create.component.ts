import { Component, OnInit,AfterContentInit,  ViewChild,NgZone, ElementRef, Input } from '@angular/core';
import { MapsAPILoader,MouseEvent } from '@agm/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { GroupTrainer } from 'src/models/GroupTrainer';
import { UtilService } from 'src/service/util.service';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/util/global';
import { MemberService } from 'src/service/member.service';
import { RegistrationRequest } from 'src/models/RegistrationRequest';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css']
})
export class ModalCreateComponent implements OnInit {
  closeResult: string;
  modalOptions:NgbModalOptions;
  title: string = 'AGM project'; 
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  myVar: any;
  ubications: any;
  description : string = "";
  userSesion:any;
  onSolicitudSend:boolean=true;
  stateRequestInGroup:string = "";
 

  @Input() fromParent;
  @Input() group: GroupTrainer=new GroupTrainer;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public activeModal: NgbActiveModal,
    public utilService: UtilService,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    public memberService: MemberService,
    private localService : LocalService
  ) { }

 
  ngOnInit() {
    if(this.group.state_user_consulting!=='UNDEFINED'){
      this.onSolicitudSend=false;
    }
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.ubications=this.utilService.getListUbications(this.group.sessions);
    this.checkStatusUserInGroup();
    this.loadMap();
  }

  setFormatDate(fecha:string){
    return this.utilService.stringToDate(fecha);
  }

  checkStatusUserInGroup(){ 
    if(this.group.state_user_consulting=='UNDEFINED'){
      this.SpinnerService.show();
      this.memberService.findRegistrationByGroupIdAndUserId(this.userSesion.id,this.group.id).subscribe(
        (response) => {
          this.SpinnerService.hide(); 
          if(response!=null && response.length>0){
            if(response[0].state!='UNDEFINED'){
              this.onSolicitudSend=false;
            }
          }
        },
        (error) => {
          this.SpinnerService.hide(); 
        }
      );
    }
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

  closeModal(sendData) { 
    this.activeModal.close(sendData); 
  }

  generateSolicitud(){ 
      this.description=this.utilService.trim(this.description);
      if( this.description!=''){
        let request=new RegistrationRequest();
        request.iduser=this.userSesion.id;
        request.idgroup=this.group.id;
        request.state='CREATED';
        request.comment=this.description;
        this.SpinnerService.show();
        this.memberService.sendRegistrationRequest(request).subscribe(
          (response) => {
            this.SpinnerService.hide(); 
            console.log(response);
            this.showMsj('Exitoso!','Su solicitud fue enviada con éxito',GlobalVariable.MSJ_OK);  
            this.activeModal.close('data');
          },
          (error) => {
            this.SpinnerService.hide(); 
            console.log(error);
            this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
          }
        );        

        //this.activeModal.close('data');
      }else{
        this.showMsj('Campo en blanco',"Debe ingresar el texto de solicitud",GlobalVariable.MSJ_WRN);
      }
  }

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }    



}
