import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GroupTrainer } from '../models/GroupTrainer';
import { GlobalVariable } from 'src/util/global';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SesionTrainer } from 'src/models/SesionTrainer';
import { ResponseGroupInitDTO } from 'src/models/ResponseGroupInitDTO';

@Injectable({
  providedIn: 'root'
})
export class GrouptrainerService {

  constructor(private http: HttpClient) { }

  createOrUpdateGroupTrainer(GroupTrainer: GroupTrainer, modeCreate:boolean){
    if(modeCreate){
      return this.createGroupTrainer(GroupTrainer);
    }else{
      return this.editGroupTrainer(GroupTrainer);
    }
  }

  createGroupTrainer( GroupTrainer: GroupTrainer){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/save";
    return this.http.post(url,GroupTrainer).pipe(
        retry(0),
        catchError(this.handleError)
    );
  } 

  editGroupTrainer( GroupTrainer: GroupTrainer){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/update";
    return this.http.put(url,GroupTrainer).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  publishGroupTrainer( groupid:number,userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/publish/"+groupid+"/"+userid;
    return this.http.put(url,null).pipe(
        retry(0),
        catchError(this.handleError)
    );
  } 

  getGroupsByUserId(userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbyuserid/"+userid;
    return this.http.get<GroupTrainer[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  } 

  getGroupsByUserIdForClient(userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbyuseridforclient/"+userid;
    return this.http.get<GroupTrainer[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  getGroupsByMember(userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbymember/"+userid;
    return this.http.get<GroupTrainer[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   
  
  getGroupInfoComplete(groupid:number,userid:number,coordinate:string){ 
    coordinate=coordinate.replace("[", "%5B"); 
    coordinate=coordinate.replace("]", "%5D"); 
    coordinate=coordinate.replace(",", "%2C");     
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbyidcompleteinfo/"+groupid+"/"+userid+"?coordinate="+coordinate;
    return this.http.get<GroupTrainer[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }    


  getGroupsByFilter(coordinate:string,userid:number,filter:string,categories:string,idusers:string){
    coordinate=coordinate.replace("[", "%5B"); 
    coordinate=coordinate.replace("]", "%5D"); 
    coordinate=coordinate.replace(",", "%2C"); 
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbymultiplefilter?coordinate="+coordinate
    +"&iduser="+userid
    +"&filter="+filter
    +"&categories="+categories
    +"&idusers="+idusers;
    return this.http.get<GroupTrainer[]>(url).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }  

  getGroupsInitList(coordinate:string,userid:number){
    coordinate=coordinate.replace("[", "%5B"); 
    coordinate=coordinate.replace("]", "%5D"); 
    coordinate=coordinate.replace(",", "%2C"); 
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/findbygroupinits?coordinate="+coordinate+"&iduser="+userid;
    return this.http.get<ResponseGroupInitDTO>(url).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }     

  /** SESION TRAINER **/
  createOrUpdateSessionTrainer(SesionTrainer: SesionTrainer, modeCreate:boolean){
    if(modeCreate){
      return this.createSesionTrainer(SesionTrainer);
    }else{
      return this.updateSesionTrainer(SesionTrainer);
    }
  }  

  createSesionTrainer( SesionTrainer: SesionTrainer){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/session/save";
    return this.http.post(url,SesionTrainer).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  updateSesionTrainer( SesionTrainer: SesionTrainer){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/session/update";
    return this.http.put(url,SesionTrainer).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }  

  deleteSesionTrainer(idsesion:number, groupid:number,userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/session/delete/"+idsesion+"/"+groupid+"/"+userid;
    return this.http.delete(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  getSessionByUserIdAndGroupId(groupid:number,userid:number){
    let url = GlobalVariable.BASE_API_URL+"/grouptrainer/session/findbydgroupid/"+groupid+"/"+userid;
    return this.http.get<SesionTrainer[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  handleError(error) {
    return throwError(error);
  } 

}
