import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateComponent } from '../../modal-create/modal-create.component';
import { ToastService } from 'src/service/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GrouptrainerService } from 'src/service/grouptrainer.service';
import { ResponseGroupInitDTO } from 'src/models/ResponseGroupInitDTO';
import { UtilService } from 'src/service/util.service';
import { GlobalVariable } from 'src/util/global';
import { usersDTO } from 'src/models/usersDTO';
import { categoriesDTO } from 'src/models/categoriesDTO';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.component.html',
  styleUrls: ['./search-group.component.css']
})
export class SearchGroupComponent implements OnInit {
  coordinates: Coordinates;
  userSesion:any;
  responseGroupInit: ResponseGroupInitDTO = new ResponseGroupInitDTO();
  searchtxt:string="";
  categoriesDTO:Array<categoriesDTO>=new Array<categoriesDTO>();
  usersDTO:Array<usersDTO>=new Array<usersDTO>();
  currentPage = 1;
  itemsPerPage = 6;
  pageSize: number;
  lenghtGroup=0;


  constructor(
    private modalService: NgbModal,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    public grouptrainerService : GrouptrainerService,
    public utilService: UtilService,
    private localService : LocalService
  ) { 
    this.coordinates = {} as Coordinates; 
  }


  ngOnInit() {
    this.userSesion = JSON.parse(this.localService.getJsonValue('user'));
    this.getGroupInit();
  }

  getDatePublishGroup(fecha:string){
    return this.utilService.getDatePublishGroup(fecha);
  }

  clearSearch(){
    this.searchtxt='';
    this.getGroupInit();
  }

  getGroupInit(){
    this.lenghtGroup=0;
    this.usersDTO=new Array<usersDTO>();
    this.categoriesDTO=new Array<categoriesDTO>()
    this.SpinnerService.show();
    this.grouptrainerService.getGroupsInitList(this.userSesion.coordinate,this.userSesion.id).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        this.responseGroupInit=response;
        this.lenghtGroup=this.responseGroupInit.groups.length;
        for(let i in this.responseGroupInit.categories){
          let cat=new categoriesDTO();
          cat.name=this.responseGroupInit.categories[i].name;
          cat.quantity=this.responseGroupInit.categories[i].quantity;
          cat.checked=false;
          this.categoriesDTO.push(cat);
        }
        for(let j in this.responseGroupInit.users){
          let usr=new usersDTO();
          usr.firstname=this.responseGroupInit.users[j].firstname;
          usr.lastname=this.responseGroupInit.users[j].lastname;
          usr.id=this.responseGroupInit.users[j].id;
          usr.quantitygroup=this.responseGroupInit.users[j].quantitygroup;
          usr.checked=false;
          this.usersDTO.push(usr);
        }        

        console.log(response);
      },
      (error) => {
        this.SpinnerService.hide(); 
        console.log(error);
      }
    );    
  }   

  showDistanceMsj(distance:number){
    return this.utilService.defineDistance(distance);
  }

  filterSearchGrup(){
    this.lenghtGroup=0;
    let filter=this.utilService.trim(this.searchtxt);
    let iduser='';
    let idcategories='';
    for(let i in this.usersDTO){
      if(this.usersDTO[i].checked) iduser+=(iduser=='')?this.usersDTO[i].id:','+this.usersDTO[i].id;
    } 
    for(let j in this.categoriesDTO){
      if(this.categoriesDTO[j].checked) idcategories+=(idcategories=='')?this.categoriesDTO[j].name:','+this.categoriesDTO[j].name;
    } 
    this.SpinnerService.show();
    this.grouptrainerService.getGroupsByFilter(this.userSesion.coordinate,this.userSesion.id,
      filter,idcategories,iduser).subscribe(
      (response) => {
        this.SpinnerService.hide(); 
        this.responseGroupInit.groups=response;
        this.lenghtGroup=this.responseGroupInit.groups.length;
        console.log(response);
      },
      (error) => {
        this.SpinnerService.hide(); 
        console.log(error);
      }
    ); 
  }


  viewModal(g) {
    const modalRef = this.modalService.open(ModalCreateComponent, {
      scrollable: true,
      size: 'lg'
      // backdrop: 'static'
    });
    let data = {
      prop1: 'Some Data',
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

  /* MENSAJES */
  showMsj(title,msj,type) {
    this.toastService.show(msj, {classname: type+' text-light',delay: 4000 ,autohide: true, headertext: title});
  }  

  /* PAGINACION */
  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage*(pageNum - 1);
  }
  
  changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

}
