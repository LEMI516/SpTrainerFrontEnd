import { Component, OnInit } from '@angular/core';
import { RegisterserviceService } from 'src/service/registerservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../service/toast.service';
import { GlobalVariable } from 'src/util/global';
import { User } from 'src/models/User';
import { NgxSpinnerService } from "ngx-spinner";  
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;  
  user: User=new User;
  bsConfig: Partial<BsDatepickerConfig>;
  minEndDate: Date;
  locale = 'es-do';
  modalOptions:NgbModalOptions;
  closeResult: string; 
  patternFieldName : string = "^[A-Za-z0-9 ]{1,50}$";
  patternFieldNumber : string = "^[0-9]*$";
  patternFieldUsername : string = "[A-Za-z0-9]{1,50}$";
  patternPassword : string = "^[A-Za-z0-9 ]{8,16}$";

  constructor(
    private registerService:RegisterserviceService,
    private formBuilder: FormBuilder,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    private localeService: BsLocaleService,
    private router:Router,
    private modalService: NgbModal  
  ) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-dark-blue", dateInputFormat: 'YYYY-MM-DD' });
    this.localeService.use(this.locale);
    this.minEndDate = new Date();
  

   }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ['',[Validators.required,Validators.pattern(this.patternFieldName)]],
      lastname: ['', [Validators.required,Validators.pattern(this.patternFieldName)]],
      birthdate: ['', Validators.required],
      phone: ['', [Validators.required,Validators.pattern(this.patternFieldNumber)]],
      user: ['', [Validators.required,Validators.pattern(this.patternFieldUsername)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.patternPassword)]],
      confirmpassword: ['', Validators.required],
      sex: ['',Validators.required],
      typeuser : ['',Validators.required],
      acceptterms: [false, Validators.requiredTrue]
  });    
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.registerForm.invalid) {
          return;
      }
      if(this.registerForm.value.password!=this.registerForm.value.confirmpassword){
         this.showMsj('Error!','Las contraseñas no coinciden',GlobalVariable.MSJ_ERROR);
      }else if(this.showAge<18){
        this.showMsj('Error!','Debe ser mayor de edad',GlobalVariable.MSJ_ERROR);
      }else{
        let fecha;
        let datePipe = new DatePipe('en-US');
        fecha = datePipe.transform(this.registerForm.value.birthdate, 'yyyy-MM-dd');
        this.user.firstname=this.registerForm.value.firstname;
        this.user.lastname=this.registerForm.value.lastname;
        this.user.birthdate=fecha;
        this.user.phone=this.registerForm.value.phone;
        this.user.password=this.registerService.sha256Encrypt(this.registerForm.value.password);
        this.user.user=this.registerForm.value.user;
        this.user.email=this.registerForm.value.email;
        this.user.sex=this.registerForm.value.sex;
        this.user.rolid=this.registerForm.value.typeuser;
        this.SpinnerService.show();
        this.registerService.createUser(this.user).subscribe(
          (response) => {
            this.SpinnerService.hide(); 
            console.log(response);
            this.showMsj('Exitoso!',"Usuario registrado correctamente",GlobalVariable.MSJ_OK);  
            this.onReset();
          },
          (error) => {
            this.SpinnerService.hide(); 
            console.log(error);
            if(error.status===409){
              this.showMsj('Usuario o correo ya existe',error.error,GlobalVariable.MSJ_WRN);  
            }else{
              this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
            }
          }
        );
      }
  }

  onReset() {
      this.submitted = false;
      this.registerForm.reset();
      this.router.navigateByUrl("/LoginComponent");
  }  

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }
  /*Calcular edad*/
   showAge;
  ageCalculator(){
    
    if(this.registerForm.value.birthdate){
      const convertAge = new Date(this.registerForm.value.birthdate);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      console.log(this.showAge);
    }
  }
  modalTermCond(content){
    
 
    let m = this.modalService.open(content, this.modalOptions);
    m.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
     // this.closeResult = this.modalOptions.hide();
    });  

  }
}
