import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/models/User';
import { GlobalVariable } from 'src/util/global';
import { RegisterserviceService } from 'src/service/registerservice.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LocalService } from 'src/service/local.service';
import { NgbModal, NgbModalRef, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/service/util.service';

@Component({
  selector: 'app-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.css']
})
export class UPDATEDATAComponent implements OnInit {
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  registerForm: FormGroup;
  userjson:any;
  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  submitted = false;
  usuario: User = new User;
  bsConfig: Partial<BsDatepickerConfig>;
  minEndDate: Date;
  locale = 'es-do';
  modalChangePassword:NgbModalRef ;
  modalOptions:NgbModalOptions;
  closeResult: string; 
  patternFieldName : string = "^[A-Za-z0-9 ]{1,50}$";
  patternFieldNumber : string = "^[0-9]*$";
  patternFieldUsername : string = "[A-Za-z0-9]{1,50}$";
  patternPassword : string = "^[A-Za-z0-9 ]{8,16}$";  

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    private registerService: RegisterserviceService,
    private localeService: BsLocaleService,
    private localService : LocalService,
    private modalService: NgbModal,
    private utilService: UtilService
  ) { 
    this.bsConfig = Object.assign({}, { containerClass: "theme-dark-blue", dateInputFormat: 'YYYY-MM-DD' });
    this.localeService.use(this.locale);
    this.minEndDate = new Date();
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }

  }


  ngOnInit() {
    let usr = this.localService.getJsonValue('user'); 
    let obj = JSON.parse(usr);
    this.userjson=obj;
    this.registerForm = this.formBuilder.group({
      firstname: [obj.firstname, [Validators.required,,Validators.pattern(this.patternFieldName)]],
      lastname: [obj.lastname, [Validators.required,,Validators.pattern(this.patternFieldName)]],
      birthdate: [obj.birthdate, Validators.required],
      phone: [obj.phone, [Validators.required,Validators.pattern(this.patternFieldNumber)]],
      sex: [obj.sex, Validators.required],
      weight: [obj.weight, Validators.required],
      height: [obj.height, Validators.required],
      user: [obj.user, Validators.required],
      email: [obj.email, [Validators.required, Validators.email]],
      rolid: [obj.rolid, Validators.required],
      profile: [obj.profile, Validators.required],
      direction: [obj.direction, Validators.required],
      password: [obj.password, [Validators.required, Validators.minLength(6)]],
      id: [obj.id, Validators.required]
    });


    //load Places Autocomplete
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

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.showAge < 18) {
      this.showMsj('Error!', 'Debe ser mayor de edad', GlobalVariable.MSJ_ERROR);
    }

    else {
      this.usuario.firstname = this.registerForm.value.firstname;
      this.usuario.lastname = this.registerForm.value.lastname;
      this.usuario.birthdate = this.registerForm.value.birthdate;
      this.usuario.phone = this.registerForm.value.phone;

      this.usuario.user = this.userjson.user;
      this.usuario.email = this.userjson.email;
      this.usuario.sex = this.registerForm.value.sex;
      this.usuario.rolid = this.userjson.rolid;
      this.usuario.profile = this.registerForm.value.profile;
      this.usuario.weight = this.registerForm.value.weight;
      this.usuario.height = this.registerForm.value.height;
      this.usuario.id = this.userjson.id;
      this.usuario.coordinate="["+this.latitude+","+this.longitude+"]";
      this.usuario.direction=this.registerForm.value.direction;

      this.SpinnerService.show();
      this.registerService.updateUser(this.usuario).subscribe(
        (response) => {
          this.SpinnerService.hide();
          this.showMsj('Exitoso!', "Datos de usuario actualizado correctamente", GlobalVariable.MSJ_OK);
          this.localService.setJsonValue('user',JSON.stringify(this.usuario));
        },
        (error) => {
          this.SpinnerService.hide();
          console.log(error);
          this.showMsj('Error!', 'Ocurrio un error al procesar su solicitud, intentelo mas tarde', GlobalVariable.MSJ_ERROR);
        }
      );
    }
  }

  /* MENSAJES */
  showMsj(title, msj, type) {
    this.toastService.show(msj, { classname: type + ' text-light', delay: 4000, autohide: true, headertext: title });
  }
  /*Calcular edad*/
  showAge;
  ageCalculator() {

    if (this.registerForm.value.birthdate) {
      const convertAge = new Date(this.registerForm.value.birthdate);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      console.log(this.showAge);
    }
  }
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  /* CHANGE PASSWORD */
  oldpassword:string ="";
  newpassword:string ="";
  confirmanewpassword:string="";

  openModalChagePassword(content){
    this.oldpassword="";
    this.newpassword="";
    this.confirmanewpassword="";
    this.modalChangePassword = this.modalService.open(content, this.modalOptions);
    this.modalChangePassword.result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }  

  updatePassword(){
    this.newpassword=this.utilService.trim(this.newpassword);
    this.oldpassword=this.utilService.trim(this.oldpassword);
    this.confirmanewpassword=this.utilService.trim(this.confirmanewpassword);
    if(this.newpassword=="" || this.oldpassword=="" || this.confirmanewpassword==""){
      this.showMsj('Error!','Debe ingresar todos los campos',GlobalVariable.MSJ_ERROR);
      return;
    }
    if(this.newpassword!=this.confirmanewpassword){
      this.showMsj('Error!','Las contraseña nueva no coinciden con su confirmnación!',GlobalVariable.MSJ_ERROR);
      return;
    }    
    let reg=new RegExp(this.patternPassword);
    if(!reg.test(this.newpassword)){
      this.showMsj('Error!','La contraseña nueva debe tener entre 8 y 16 caracteres, debe contener letras miniscula, mayuscula o digitos',GlobalVariable.MSJ_ERROR);
      return;      
    }
          

    let oldpass=this.registerService.sha256Encrypt(this.oldpassword)
    let newpass=this.registerService.sha256Encrypt(this.newpassword);

    this.SpinnerService.show();
    this.registerService.changePassword(this.userjson.id,newpass,oldpass).subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.showMsj('Exitoso!', "Contraseña modificada correctamente", GlobalVariable.MSJ_OK);
        this.modalChangePassword.close();
      },
      (error) => {
        this.SpinnerService.hide();
        if(error.status===409){
          this.showMsj('Advertencia','No contraseña actual es incorrecta',GlobalVariable.MSJ_WRN);                     
        }else{
          this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR);           
        }        
      }
    );    
  }


}


