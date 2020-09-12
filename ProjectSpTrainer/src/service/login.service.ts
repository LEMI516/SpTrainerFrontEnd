import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from 'src/util/global';
import { User } from '../models/User';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sha256, sha224 } from 'js-sha256';
import { LogLogin } from 'src/models/LogLogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser(user:string,pass:string){
    let url = GlobalVariable.BASE_API_URL+"/user/findbyuser?user="+user;
    return this.http.get<User>(url).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }   

  saveLogLogin( LogLogin: LogLogin){
    let url = GlobalVariable.BASE_API_URL+"/user/log/login/save";
    return this.http.post(url,LogLogin).pipe(
        retry(1),
        catchError(this.handleError)
    );
  }   

  getIPAddress(){  
    return this.http.get("http://api.ipify.org/?format=json");  
  }    

  handleError(error) {
    return throwError(error);
  }  

  sha256Encrypt(pass){
    return sha256(pass);
  }


  
}
