import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast.service';
import { GlobalVariable } from 'src/util/global';
import { LoginService } from 'src/service/login.service';
import { NgxSpinnerService } from "ngx-spinner";  
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalService } from 'src/service/local.service';
import { LogLogin } from 'src/models/LogLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string='';
  password:string='';
  emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  modalOptions:NgbModalOptions;
  closeResult: string; 
  constructor(
    private router:Router,
    public toastService: ToastService,
    private loginService : LoginService,
    private SpinnerService: NgxSpinnerService,
    private localService : LocalService,
    private modalService: NgbModal  ) { 

  }


  ngOnInit() {}
  
  routermenu(id:number){
    switch(id){
      case 1:
        this.router.navigateByUrl("/register");
        /*console.log(this.emailRegex.test(this.email));*/
      break;
      case 2:
        if(this.password!='' && this.email!=''){
          let passEncryp=this.loginService.sha256Encrypt(this.password);
          this.SpinnerService.show();
          this.loginService.loginUser(this.email,this.password).subscribe(
            (response) => {
              this.SpinnerService.hide(); 
              let usr=response;
              if(usr.password===passEncryp){
                  this.saveLogLogin(this.email,"OK");
                  this.localService.setJsonValue('user',JSON.stringify(usr));
                  this.router.navigateByUrl("/routerP");
              }else{
                this.showMsj('Datos incorretos','Usuario o contraseña incorrectos',GlobalVariable.MSJ_WRN);  
                this.saveLogLogin(this.email,"FAIL");
              }
            },
            (error) => {
              this.SpinnerService.hide(); 
              if(error.status===404){
                this.showMsj('Datos incorretos ','Usuario o contraseña incorrectos ',GlobalVariable.MSJ_WRN);  
              }else{
                this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
              }

            }
          )
          
        }else{
            this.showMsj('Error!','Debe ingresar usuario y contraseña',GlobalVariable.MSJ_ERROR);
        }        
      break;
    
    }
  }

  saveLogLogin(username:string,result:string){
    this.loginService.getIPAddress().subscribe((res:any)=>{  
      let logLogin=new LogLogin();
      logLogin.username=username;
      logLogin.result=result;
      logLogin.ipAddress=res.ip;
      logLogin.version="WEB";
      this.loginService.saveLogLogin(logLogin).subscribe(
        (response) => {},
        (error) => {}
      )        
    });     
  }

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }

  /*MODAL DE RECUPERAR CONTRASEÑA*/
  modalRecupCont(modalRecp){
        let m = this.modalService.open(modalRecp, this.modalOptions);
        m.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
         // this.closeResult = this.modalOptions.hide();
        });  

  }
}
