import { Component, OnInit, NgZone } from '@angular/core';
import { GroupTrainer } from 'src/models/GroupTrainer';
import { MapsAPILoader } from '@agm/core';
import { ToastService } from 'src/service/toast.service';
import { FormBuilder } from '@angular/forms';
import { GrouptrainerService } from 'src/service/grouptrainer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MemberService } from 'src/service/member.service';
import { RegistrationRequest } from 'src/models/RegistrationRequest';
import { NgbModal, NgbModalOptions, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/service/util.service';
import { GlobalVariable } from 'src/util/global';
import { Member } from 'src/models/Member';
import { ImageCalificate } from 'src/models/ImageCalificate';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.css']
})
export class ManageClientComponent implements OnInit {
  validateListGroupClient: boolean = false;
  listGroup: GroupTrainer[];
  userSesion: any;
  sizeListGroup: number = 0;
  groupTrainerSelected: GroupTrainer = new GroupTrainer();
  validatePageSolicitude: boolean = true;
  validatePageGroup: boolean = false;
  validatePageMember: boolean = true;
  stateSelected:string="CREATED";
  sizeListRequest:number=0;
  listRegistrationRequest:RegistrationRequest[];
  quantityListRegistrationRequest:number=0;
  listMember:Member[];
  quantityListMembers:number=0;
  modalOptions:NgbModalOptions;
  requestSelected:RegistrationRequest=new RegistrationRequest();
  modalClient:NgbModalRef ; 
  closeResult: string; 
  answer:string="";
  stateSelectedMember:string="ACTIVE";
  memberSelected:Member=new Member();
  titleModalConfirm:string="";
  typeModal:number=0;
  imagesCalificates:ImageCalificate[];
  messageEmpty:string = ""; 
  quantityGroups:number = 0;  

  searchText = null;
  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public toastService: ToastService,
    public grouptrainerService: GrouptrainerService,
    public memberService: MemberService,
    private SpinnerService: NgxSpinnerService,
    public utilService: UtilService,
    private localService : LocalService,
    private modalService: NgbModal) {
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit() {
    this.imagesCalificates=this.utilService.getImagesCalificate();
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.validateListGroupClient = true;
    this.loadGroupsByUser();



  }
  currentPage = 1;
  itemsPerPage = 6;
  pageSize: number;
  currentPageR = 1;
  itemsPerPageR = 6;
  pageSizeR: number;  



  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  onPageChangeR(pageNum: number): void {
    this.pageSizeR = this.itemsPerPageR * (pageNum - 1);
  }  

  changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }
  loadGroupsByUser() {

    this.SpinnerService.show();
    this.grouptrainerService.getGroupsByUserIdForClient(this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        if(response!=null){
          this.listGroup = response;
          this.sizeListGroup = this.listGroup.length;
          this.quantityGroups = this.listGroup.length;
        }
        this.showMessageEmpty();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.showMessageEmpty();
      }
    );
  }

  /////////////////////////
  openPageSolicitude(g) {
    this.stateSelected="CREATED";
    this.groupTrainerSelected = g;
    this.validatePageGroup = true;
    this.validatePageSolicitude = false;
    this.validatePageMember = true;
    this.loadRegistrationRequest();
  }

  closePageSolicitude() {
    this.validatePageGroup = false;
    this.validatePageSolicitude = true
    this.validatePageMember = true;
    this.loadGroupsByUser();
  }

  loadRegistrationRequest() {
    let state=this.stateSelected;
    this.SpinnerService.show();
    this.memberService.getRegistrationRequest(this.groupTrainerSelected.id,state).subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.listRegistrationRequest = response;
        this.quantityListRegistrationRequest = this.listRegistrationRequest.length;
        this.sizeListRequest = this.listRegistrationRequest.length;
        for(let i in this.listRegistrationRequest){
          this.listRegistrationRequest[i].color=(this.listRegistrationRequest[i].state=='CREATED')?'#F97979':'white';
        }
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );
  }  

  /*MODAL */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  openModalClient(r,content){
    this.requestSelected=r;
    this.modalClient = this.modalService.open(content, this.modalOptions);
    this.modalClient.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
  }  

  responseRequest(response:string){
    
    let rr=new RegistrationRequest();
    rr.id=this.requestSelected.id;
    rr.idgroup=this.groupTrainerSelected.id;
    rr.iduser=this.requestSelected.user.id;
    rr.state=response;
    rr.answer=this.utilService.trim(this.answer);
    if(response=='REJECTED' && rr.answer==''){
      this.showMsj('Solicitud de Inscripción','Si rechaza la solicitud debe ingresar un motivo',GlobalVariable.MSJ_WRN); 
      return;
    }
    this.SpinnerService.show();
    this.memberService.sendResponseRegistrationRequest(rr).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        this.showMsj('Exitoso!',"Respuesta enviada exitosamente",GlobalVariable.MSJ_OK);  
        this.modalClient.close();
        this.loadRegistrationRequest();
        
      },
      (error) => {
        this.SpinnerService.hide(); 
        if(error.status===409){
          this.showMsj('Advertencia','No tiene cupos disponibles para agregar nuevos miembros',GlobalVariable.MSJ_WRN);                     
        }else{
          this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR);           
        }
      }
    );    

  }  

  /* MEMBERS * */
  openPageMember(g) {
    this.groupTrainerSelected = g;
    this.validatePageGroup = true;
    this.validatePageSolicitude = true;
    this.validatePageMember = false;
    this.loadMembers();
  }  

  closePageMember() {
    this.validatePageGroup = false;
    this.validatePageSolicitude = true
    this.validatePageMember = true;
  }  

  loadMembers() {
    let state=this.stateSelectedMember;
    this.SpinnerService.show();
    this.memberService.getMembers(this.groupTrainerSelected.id,state).subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.listMember = response;
        this.quantityListMembers = this.listMember.length;
        for(let i in this.listMember){
          let calificates=this.utilService.getImagesCalificate();
          for(let j=0;j<this.listMember[i].calification.score;j++){
            calificates[4-j].marked=true;
            calificates[4-j].color='#8DC349';
          } 
          this.listMember[i].imagecalificate=calificates;
        }        
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );
  }   

  openModalMember(m,content){
    this.memberSelected=m;
    this.modalClient = this.modalService.open(content, this.modalOptions);
    this.modalClient.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
  }   

  openModalConfirm(m,title,tp,content){
    this.memberSelected=m;
    this.titleModalConfirm=title;
    this.typeModal=tp;
    this.modalClient = this.modalService.open(content, this.modalOptions);
    this.modalClient.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
  }   
  
  actionModalConfirm(){
    switch(this.typeModal){
      case 1:
        this.changeStatus('INACTIVE');
        break;
        case 2:
          this.changeStatus('ACTIVE');
          break;        
    }
 }

  changeStatus(status:string){
    this.SpinnerService.show();
    this.memberService.change_status_member(this.groupTrainerSelected.id,this.memberSelected.iduser,status).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        this.showMsj('Exitoso!',"Proceso realizado exitosamente",GlobalVariable.MSJ_OK);  
        this.modalClient.close();
        this.loadMembers();
        
      },
      (error) => {
        this.SpinnerService.hide(); 
        if(error.status===409){
          this.showMsj('Advertencia','No tiene cupos disponibles para activar miembros',GlobalVariable.MSJ_WRN);                     
        }else{
          this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
        }
      }
    );    
  }

  /** CALICATE */
  openModalCalificate(m,content){
    this.memberSelected=m;

    this.modalClient = this.modalService.open(content, this.modalOptions);
    this.modalClient.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
  }   

  clickCalificate(cal:number,m,i:number){
    let calificates=this.utilService.getImagesCalificate();
    for(let j=0;j<cal;j++){
      calificates[4-j].marked=true;
      calificates[4-j].color='orange';
    } 
    this.listMember[i].imagecalificate=calificates;
    this.listMember[i].calification.score=cal;
    let calification=this.listMember[i].calification;
    console.log(calification);
    this.SpinnerService.show();
    this.memberService.calificateMember(calification).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        console.log(response);
        this.showMsj('Exitoso!',"Miembro calificado",GlobalVariable.MSJ_OK);  
        this.loadMembers();
      },
      (error) => {
        this.SpinnerService.hide(); 
        console.log(error);
        this.showMsj('Error!','Ocurrio un error al procesar su solicitud, intentelo mas tarde',GlobalVariable.MSJ_ERROR); 
      }
    );    
  }
  
  /** UTIL **/
  getAge(fecha:string){
    return this.utilService.ageCalculator(fecha);
  }

  setFecha(fecha:string){
    return this.utilService.stringToDate(fecha);
  }

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }  

  /* Validar Contenido vacio */
  showMessageEmpty(){
    this.messageEmpty=(this.quantityGroups==0)?"No se encontraron grupos publicados":"";
  }  


}
