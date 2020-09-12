import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { GlobalVariable } from 'src/util/global';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sha256, sha224 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class RegisterserviceService {

  constructor(private http: HttpClient) { }

  createUser( User: User){
    let url = GlobalVariable.BASE_API_URL+"/user/save";
    return this.http.post(url,User).pipe(
        retry(1),
        catchError(this.handleError)
    );
  } 

  updateUser(User:User){
    let url = GlobalVariable.BASE_API_URL+"/user/update";
    return this.http.put(url,User).pipe(
      retry(1),
      catchError(this.handleError)
  );
    
  }

  changePassword(idUser:number,newpassword:string,oldpassword:string){
    let url = GlobalVariable.BASE_API_URL+"/user/changePassword?idUser="+idUser+"&newPassword="+newpassword+"&oldPassword="+oldpassword;
      return this.http.put(url,User).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }  

  handleError(error) {
    return throwError(error);
  }  

  sha256Encrypt(pass){
    return sha256(pass);
  }  


}
