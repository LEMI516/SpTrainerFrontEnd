import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { GlobalVariable } from 'src/util/global';
import { RegistrationRequest } from 'src/models/RegistrationRequest';
import { retry, catchError } from 'rxjs/operators';
import { Member } from 'src/models/Member';
import { calification } from 'src/models/calification';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  sendRegistrationRequest( RegistrationRequest: RegistrationRequest){
    let url = GlobalVariable.BASE_API_URL+"/member/registration_request";
    return this.http.post(url,RegistrationRequest).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  getRegistrationRequest(groupid:number,state:string){
    let url = GlobalVariable.BASE_API_URL+"/member/findregistrationrequestbygroupidandstate/"+groupid+"/"+state;
    return this.http.get<RegistrationRequest[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  getMembers(groupid:number,state:string){
    let url = GlobalVariable.BASE_API_URL+"/member/findmemberbygroupidandstate/"+groupid+"/"+state;
    return this.http.get<Member[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }    
  
  sendResponseRegistrationRequest( RegistrationRequest: RegistrationRequest){
    let url = GlobalVariable.BASE_API_URL+"/member/response/registration_request";
    return this.http.post(url,RegistrationRequest).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  change_status_member(groupid:number,userid:number,state:string){
    let url = GlobalVariable.BASE_API_URL+"/member/update_member/"+groupid+"/"+userid+"/"+state;
    return this.http.put(url,RegistrationRequest).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }    

  calificateMember( calification: calification){
    let url = GlobalVariable.BASE_API_URL+"/member/calificate";
    return this.http.post(url,calification).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   
  
  findRegistrationByGroupIdAndUserId(userid:number,groupid:number){
    let url = GlobalVariable.BASE_API_URL+"/member/findRegistrationByUserIdAndGroupId/"+groupid+"/"+userid;
    return this.http.get<RegistrationRequest[]>(url).pipe(
        retry(0),
        catchError(this.handleError)
    );
  }   

  handleError(error) {
    return throwError(error);
  }   

}
