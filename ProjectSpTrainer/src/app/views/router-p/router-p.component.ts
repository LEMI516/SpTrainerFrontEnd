import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from 'src/service/local.service';

@Component({
  selector: 'app-router-p',
  templateUrl: './router-p.component.html',
  styleUrls: ['./router-p.component.css']
})
export class RouterPComponent implements OnInit {

  constructor(private router:Router,private localService : LocalService) { }
  validarol:boolean=false;

  ngOnInit() {
    let usr=this.localService.getJsonValue('user'); 
    if(usr==null){
      this.router.navigateByUrl("/LoginComponent");

    }
  }

}
