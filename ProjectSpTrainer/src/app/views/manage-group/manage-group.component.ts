import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../service/toast.service';
import { GlobalVariable } from 'src/util/global';
import { NgxSpinnerService } from "ngx-spinner";
import { GroupTrainer } from 'src/models/GroupTrainer';
import { GrouptrainerService } from 'src/service/grouptrainer.service';
import { throttleTime } from 'rxjs/operators';
import { SesionTrainer } from 'src/models/SesionTrainer';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/service/util.service';
import { NotificationsService } from 'src/service/notifications.service';
import { NotificationModel } from 'src/models/NotificationModel';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker/';
import { ModelGroupInfoComponent } from '../model-group-info/model-group-info.component';
import { LocalService } from 'src/service/local.service';


@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.css']
})
export class ManageGroupComponent implements OnInit {
  validateListGroup: boolean = false;
  validateaddGroup: boolean = true;
  validateSessions: boolean = true;
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  groupcreateForm: FormGroup;
  sesionForm: FormGroup;
  submitted = false;
  submitteds = false;
  c = false;
  groupTrainer: GroupTrainer = new GroupTrainer;
  groupTrainerSelected: GroupTrainer = new GroupTrainer;
  sesion: SesionTrainer = new SesionTrainer();
  sesionSelected: SesionTrainer = new SesionTrainer();
  userSesion: any;
  listGroup: GroupTrainer[];
  listSesion: SesionTrainer[];
  modalOptions: NgbModalOptions;
  closeResult: string;
  modalConfirm: NgbModalRef;
  modeCreateGroup: boolean = false;
  modeEditGroup: boolean = false;
  modeCreateSesionGroup: boolean = false;
  modeEditSesionGroup: boolean = false;
  typeConfirmModal: number = 0;
  titleModalConfirm: string = "";
  categorys = GlobalVariable.CATEGORIES;
  bsConfig: Partial<BsDatepickerConfig>;
  minEndDate: Date;
  minEndDate2: Date ;
  mytime: Date;
  mytimeEnd: Date;
  locale = 'es-do';
  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  patternFieldName : string = "^[A-Za-z0-9 ]{1,50}$";
  patternFieldNumber : string = "^[0-9]*$"; 
  messageEmpty:string = ""; 
  quantityGroups:number = 0;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public toastService: ToastService,
    public grouptrainerService: GrouptrainerService,
    private SpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private localeService: BsLocaleService,
    public utilService: UtilService,
    public notificationService: NotificationsService,
    config: TimepickerConfig,
    public localService:LocalService
  ) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-dark-blue", dateInputFormat: 'YYYY-MM-DD' });
    this.localeService.use(this.locale);
    this.minEndDate = new Date();
    config.showSpinners = false;
    this.mytime = new Date();
    this.mytimeEnd = new Date();

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  ngOnInit() {
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.groupcreateForm = this.formBuilder.group({
      name: ['', [Validators.required,Validators.pattern(this.patternFieldName)]],
      quantity: ['', [Validators.required,Validators.pattern(this.patternFieldNumber)]],
      colour: [''],
      active: [false],
      enddate: ['', Validators.required],
      startdate: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });
    this.sesionForm = this.formBuilder.group({
      namess: ['', [Validators.required,Validators.pattern(this.patternFieldName)]],
      startday: ['-1', Validators.required],
      endday: ['-1', Validators.required],
      starthour: ['', Validators.required],
      endhour: ['', Validators.required],
      frecuenciaTrainer:['-1'],
      activesesion: [false],
      sitiedefault: [false],
      descriptionsesion: ['', Validators.required],
      directionsesion: ['', Validators.required]
    });
    this.loadGroupsByUser();
    this.loadMap();
  }

  get f() { return this.groupcreateForm.controls; }

  get sf() { return this.sesionForm.controls; }

  openAddGroup() {
    this.validateListGroup = true;
    this.validateaddGroup = false;
    this.validateSessions = true;
    this.modeCreateGroup = true;
    this.modeEditGroup = false;
    this.onReset();
  }

  openEditGroup(g) {
    this.groupTrainerSelected = g;
    this.validateListGroup = true;
    this.validateaddGroup = false;
    this.validateSessions = true;
    this.modeCreateGroup = false;
    this.modeEditGroup = true;
    this.groupcreateForm.controls.name.setValue(this.groupTrainerSelected.name);
    this.groupcreateForm.controls.description.setValue(this.groupTrainerSelected.description);
    this.groupcreateForm.controls.quantity.setValue(this.groupTrainerSelected.quantity);
    this.groupcreateForm.controls.active.setValue((this.groupTrainerSelected.active == 'true') ? true : false);
    this.groupcreateForm.controls.enddate.setValue(new Date(this.groupTrainerSelected.enddate));
    this.groupcreateForm.controls.startdate.setValue(this.groupTrainerSelected.startdate);
    this.groupcreateForm.controls.colour.setValue(this.groupTrainerSelected.colour);
    this.groupcreateForm.controls.category.setValue(this.groupTrainerSelected.category);
  }

  claseAddGroup() {
    this.validateListGroup = false;
    this.validateaddGroup = true;
    this.validateSessions = true;
    this.modeCreateGroup = false;
    this.modeEditGroup = false;
    this.onReset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.groupcreateForm.invalid) {
      return;
    }
    let startdate;
    let enddate;
    let datePipe = new DatePipe('en-US');



    enddate = datePipe.transform(this.groupcreateForm.value.enddate, 'yyyy-MM-dd');
    startdate = datePipe.transform(this.groupcreateForm.value.startdate, 'yyyy-MM-dd');
    this.groupTrainer.name = this.groupcreateForm.value.name;
    this.groupTrainer.description = this.groupcreateForm.value.description;
    this.groupTrainer.quantity = this.groupcreateForm.value.quantity;
    this.groupTrainer.active = (this.groupcreateForm.value.active) ? "true" : "false";
    this.groupTrainer.state = 'CRE';
    this.groupTrainer.enddate = enddate;
    this.groupTrainer.startdate = startdate;
    this.groupTrainer.colour = this.groupcreateForm.value.colour;
    this.groupTrainer.iduser = this.userSesion.id;
    this.groupTrainer.category = this.groupcreateForm.value.category;
    if(this.groupTrainer.quantity<=0){
      this.showMsj('Cupos', 'La cantidad de cupos debe ser mayor que 0', GlobalVariable.MSJ_WRN);
      return;
    }

    if (this.modeEditGroup) {
      this.groupTrainer.id = this.groupTrainerSelected.id;
      this.groupTrainer.state = this.groupTrainerSelected.state;
    }
    this.SpinnerService.show();
    this.grouptrainerService.createOrUpdateGroupTrainer(this.groupTrainer, this.modeCreateGroup).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        let msj = (this.modeCreateGroup) ? 'Grupo registrado correctamente' : 'Grupo modificado correctamente';
        this.showMsj('Exitoso!', msj, GlobalVariable.MSJ_OK);
        if (this.modeCreateGroup) this.onReset();
        this.loadGroupsByUser();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);

      }
    );

  }

  openModalConfirmPublish(g, content) {
    this.groupTrainerSelected = g;
    this.typeConfirmModal = 1;
    this.titleModalConfirm = "¿Esta seguro que desea publicar el grupo " + this.groupTrainerSelected.name + "?";
    this.modalConfirm = this.modalService.open(content, this.modalOptions);
    this.modalConfirm.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  publishGroup() {
    this.SpinnerService.show();
    this.grouptrainerService.publishGroupTrainer(this.groupTrainerSelected.id, this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        this.showMsj('Exitoso!', "Este grupo fue publicado exitosamente", GlobalVariable.MSJ_OK);
        this.modalConfirm.close();
        this.loadGroupsByUser();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        if (error.status === 409) {
          this.showMsj('!Oops', error.error, GlobalVariable.MSJ_WRN);
        } else {
          this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);
        }
        this.modalConfirm.close();
      }
    );

  }

  onReset() {
    this.submitted = false;
    this.groupcreateForm.reset();
  }



  /* Modal Confirm */
  actionModalConfirm() {
    switch (this.typeConfirmModal) {
      case 1:
        this.publishGroup();
        break;
      case 2:
        this.deleteSesion();
        break;


    }
  }

  /* Sesiones de Entrenamiento */

  openAdminSesion(g) {
    this.groupTrainerSelected = g;
    this.validateListGroup = true;
    this.validateaddGroup = true;
    this.validateSessions = false;
    this.modeCreateSesionGroup = true;
    this.modeEditSesionGroup = false;
    this.onResetSesion();
    this.loadSesionByGroupAndUser();
  }

  closedAdminSesion() {
    this.validateListGroup = false;
    this.validateaddGroup = true;
    this.validateSessions = true;
  }

  claseAdminSesion() {
    this.validateListGroup = false;
    this.validateaddGroup = true;
    this.validateSessions = true;
    this.modeCreateSesionGroup = true;
    this.modeEditSesionGroup = false;
  }

  editSession(s) {
     this.sesionSelected = s;
     let datePipe = new DatePipe('en-US');




    this.minEndDate2= new Date (datePipe.transform(this.sesionSelected.startday, 'yyyy-MM-dd'));
    this.modeEditSesionGroup = true;
    this.modeCreateSesionGroup = false;
    this.sesionForm.controls.namess.setValue(this.sesionSelected.name);
    this.sesionForm.controls.startday.setValue(this.sesionSelected.startday);
    this.sesionForm.controls.endday.setValue(this.endday);
   
    this.sesionForm.controls.starthour.setValue(this.sesionSelected.starthour);
    this.sesionForm.controls.endhour.setValue(this.sesionSelected.endhour);
    this.sesionForm.controls.activesesion.setValue((this.sesionSelected.active == 'true') ? true : false);
    this.sesionForm.controls.sitiedefault.setValue((this.sesionSelected.sitiedefault == 'true') ? true : false);
    this.sesionForm.controls.descriptionsesion.setValue(this.sesionSelected.description);
    this.sesionForm.controls.directionsesion.setValue(this.sesionSelected.address);
  }

  onSubmitSesion() {
    this.submitteds = true;
     let startHor;
    let endHor;
    // let datePipe = new DatePipe('en-US');


     endHor = this.sesionForm.value.endhour;
     startHor = this.sesionForm.value.starthour;
   let endH=endHor.split(':');
     let startH=startHor.split(':');
    if (this.sesionForm.invalid) {
      return;
    } 
    else if ((+startH[0]>+endH[0] ) || ( (+startH[0]==+endH[0] )&&(+startH[1])>=+endH[1] )   ) {
      this.showMsj('Hora', 'Debe validar la hora de las sesiones', GlobalVariable.MSJ_WRN);
      return;
    }

    this.sesion.idgroup = this.groupTrainerSelected.id;
    this.sesion.iduser = this.userSesion.id;
    this.sesion.name = this.sesionForm.value.namess;
    this.sesion.description = this.sesionForm.value.descriptionsesion;
    this.sesion.startday = this.sesionForm.value.startday;
    this.sesion.endday = this.endday;
    this.sesion.starthour = this.sesionForm.value.starthour;
    this.sesion.endhour = this.sesionForm.value.endhour;
    this.sesion.active = (this.sesionForm.value.activesesion) ? "true" : "false";
    this.sesion.sitiedefault = (this.sesionForm.value.sitiedefault) ? "true" : "false";
    this.sesion.address = this.sesionForm.value.directionsesion;
    this.sesion.coordinate = "[" + this.latitude + "," + this.longitude + "]";
    if (this.modeEditSesionGroup) this.sesion.id = this.sesionSelected.id;
    this.SpinnerService.show();
    this.grouptrainerService.createOrUpdateSessionTrainer(this.sesion, this.modeCreateSesionGroup).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        let msj = (this.modeCreateSesionGroup) ? 'Sesión registrada correctamente' : 'Sesión modificado correctamente';
        this.showMsj('Exitoso!', msj, GlobalVariable.MSJ_OK);
        this.onResetSesion();
        this.loadSesionByGroupAndUser();
        this.modeEditSesionGroup = false;
        this.modeCreateSesionGroup = true;
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);

      }
    );

  }

  openModalConfirmDeleteSession(s, content) {
    this.sesionSelected = s;
    this.typeConfirmModal = 2;
    this.titleModalConfirm = "¿Esta seguro que desea eliminar la sesión " + this.sesionSelected.name + "?";
    this.modalConfirm = this.modalService.open(content, this.modalOptions);
    this.modalConfirm.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteSesion() {
    this.SpinnerService.show();
    this.grouptrainerService.deleteSesionTrainer(this.sesionSelected.id, this.groupTrainerSelected.id, this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        this.showMsj('Exitoso!', "Sesión eliminada correctamente", GlobalVariable.MSJ_OK);
        this.modalConfirm.close();
        this.loadSesionByGroupAndUser();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.modalConfirm.close();
        this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);

      }
    );

  }

  onResetSesion() {
    this.submitteds = false;
    this.modeEditSesionGroup = false;
    this.modeCreateSesionGroup = true;
    this.sesionForm.reset();
    this.sesionForm.controls.endday.enable();
  }

  loadSesionByGroupAndUser() {
    this.SpinnerService.show();
    this.grouptrainerService.getSessionByUserIdAndGroupId(this.groupTrainerSelected.id, this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        this.listSesion = response;
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );
  }




  /* MENSAJES */
  showMsj(title, msj, type) {
    this.toastService.show(msj, { classname: type + ' text-light', delay: 4000, autohide: true, headertext: title });
  }

  /* Google Maps Api */
  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }


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


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
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
  sizeListGroup: number = 0;
  currentPage = 1;
  itemsPerPage = 6;
  pageSize: number;


  loadGroupsByUser() {

    this.SpinnerService.show();
    this.grouptrainerService.getGroupsByUserId(this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        if(response!=null){
          this.listGroup = response;
          this.sizeListGroup = this.listGroup.length;
          this.quantityGroups = this.listGroup.length;
        }else{
          this.showMessageEmpty();
        }
      },
      (error) => {
        this.SpinnerService.hide();
        if(error.status===204){
          this.showMessageEmpty();
        }      
      }
    );
  }

  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  onPageChangeR(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  getFormatDate(fecha: string) {
    return this.utilService.stringToDate2(fecha);
  }

  activeForDate(fecha: string) {
    let d = new Date();
    let dg = this.utilService.getDateOfString(fecha);
    return (dg >= d) ? true : false;
  }

  //NOTIFICACIONES 
  mensajeNoti: string = "";
  groupDTONOTI: Array<GroupTrainer> = new Array<GroupTrainer>();

  setListGroupNoti() {
    this.groupDTONOTI = new Array<GroupTrainer>();
    for (let i in this.listGroup) {
      let g = this.listGroup[i];
      g.checked = false;
      this.groupDTONOTI.push(g);
    }
  }

  openModalCreateNotificacion(content) {
    this.mensajeNoti = "";
    this.setListGroupNoti();
    let m = this.modalService.open(content, this.modalOptions);
    m.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  generateNotification() {
    let msj = this.utilService.trim(this.mensajeNoti);
    if (msj == '') {
      this.showMsj('Notificación', 'Debe ingresar el mensaje', GlobalVariable.MSJ_WRN);
      return;
    }
    let idgroup = '';
    for (let i in this.groupDTONOTI) {
      if (this.groupDTONOTI[i].checked) idgroup += (idgroup == '') ? this.groupDTONOTI[i].id : ',' + this.groupDTONOTI[i].id;
    }
    if (idgroup == '') {
      this.showMsj('Notificación', 'Debe seleccionar al menos un grupo', GlobalVariable.MSJ_WRN);
      return;
    }
    /////////
    let noti = new Array<NotificationModel>();
    let groupsChecked = this.groupDTONOTI.filter(x => x.checked);
    for (let i in groupsChecked) {
      let nt = new NotificationModel();
      nt.idgrup = groupsChecked[i].id;
      nt.description = msj;
      nt.type_notification = 'GROUP';
      nt.state = 'CREATED';
      nt.idusergenerate = this.userSesion.id;
      noti.push(nt);
    }
    this.SpinnerService.show();
    this.notificationService.createNotificationMasive(noti).subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.showMsj('Exitoso!', "Notificacion creada correctamente", GlobalVariable.MSJ_OK);
        this.mensajeNoti = "";
        this.setListGroupNoti();
      },
      (error) => {
        this.SpinnerService.hide();
        this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);
      }
    );
  }



  infoGroup(g){
    this.SpinnerService.show();
    this.grouptrainerService.getGroupInfoComplete(g.id,this.userSesion.id,this.userSesion.coordinate).subscribe(
      (response) => {
        this.SpinnerService.hide();
        console.log(response);
        this.viewModal(response);
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );    
  }

  //Modal
  viewModal(g) {
    const modalRef = this.modalService.open(ModelGroupInfoComponent, {
      scrollable: true,
      size: 'lg'
    });
    let data = {
      prop1: 'MANAGERGROUP',
      prop2: 'From Parent Component',
      prop3: 'This Can be anything'
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.componentInstance.group=g;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }  

  /* Validar Contenido vacio */
  showMessageEmpty(){
    this.messageEmpty=(this.quantityGroups==0)?"No se encontraron grupos registrados":"";
    console.log(this.messageEmpty);
  }
  endday="-1";
  validateDay(){
    if (this.sesionForm.value.frecuenciaTrainer=="oneS"){
      this.sesionForm.value.endday="NA";
      this.endday="NA"
      this.sesionForm.controls['endday'].disable();
    }else if (this.sesionForm.value.frecuenciaTrainer=="rangeS"){
      this.sesionForm.controls['endday'].enable();
    }else{
      this.sesionForm.value.startday="-1";
      this.showMsj('Error!', 'Ingrese primero la frecuencia', GlobalVariable.MSJ_ERROR);
    }
  }


}
