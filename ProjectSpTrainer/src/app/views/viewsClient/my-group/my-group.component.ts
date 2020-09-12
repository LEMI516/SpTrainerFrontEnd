import { Component, OnInit } from '@angular/core';
import { GrouptrainerService } from 'src/service/grouptrainer.service';
import { GroupTrainer } from 'src/models/GroupTrainer';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/service/util.service';
import { NgbModal, NgbModalRef, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModelGroupInfoComponent } from '../../model-group-info/model-group-info.component';
import { LocalService } from 'src/service/local.service';
import { MemberService } from 'src/service/member.service';

@Component({
  selector: 'app-my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.css']
})
export class MyGroupComponent implements OnInit {
  lenghtListMyGroup: number = 0;
  listMyGroup: GroupTrainer[];
  groupSelected: GroupTrainer;
  userSesion: any;
  // paginacion
  currentPage = 1;
  itemsPerPage = 6;
  pageSize: number;
  modalConfirm:NgbModalRef ;
  modalOptions:NgbModalOptions;  
  messageEmpty:string = ""; 
  quantityGroups:number = 0;  

  constructor(
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    public groupService: GrouptrainerService,
    public utilService: UtilService,
    private modalService: NgbModal,
    private localService : LocalService,
    private memberService : MemberService

  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }    

  }

  ngOnInit() {
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.loadMyGroup();
  }

  loadMyGroup(){
    this.SpinnerService.show();
    this.groupService.getGroupsByMember(this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide();
        if(response!=null){
          this.listMyGroup = response;
          this.lenghtListMyGroup = this.listMyGroup.length;
        }
        this.quantityGroups = this.lenghtListMyGroup;
        this.showMessageEmpty();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.showMessageEmpty();
      }
    );
  }

  infoGroup(g){
    this.SpinnerService.show();
    this.groupService.getGroupInfoComplete(g.id,this.userSesion.id,this.userSesion.coordinate).subscribe(
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
      prop1: 'MYGROUP',
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

  //Funciones

  getFormatDate(fecha:string){
    return this.utilService.stringToDate2(fecha);
  }

  activeForDate(fecha:string){
    let d=new Date();
    let dg=this.utilService.getDateOfString(fecha);
    return (dg>=d)?true:false;
  }  

  /* PAGINACION */
  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage*(pageNum - 1);
  }
  
  changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }  

  closeResult:string="";

  cancalInscription(g,content){
    this.groupSelected=g;
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
      return  `with: ${reason}`;
    }
  }    

  actionModalConfirm(){
    this.SpinnerService.show();
    this.memberService.change_status_member(this.groupSelected.id,this.userSesion.id,'DROPUP').subscribe(
      (response) => {
        this.SpinnerService.hide();
        this.modalConfirm.close();
        this.loadMyGroup();
      },
      (error) => {
        this.SpinnerService.hide();
        console.log(error);
      }
    );        
  }  

/* Validar Contenido vacio */
  showMessageEmpty(){
    this.messageEmpty=(this.quantityGroups==0)?"No encuentra inscrito en ningun grupo":"";
    console.log(this.messageEmpty);
  }  

}
