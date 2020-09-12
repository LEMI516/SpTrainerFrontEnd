import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-trainer',
  templateUrl: './navbar-trainer.component.html',
  styleUrls: ['./navbar-trainer.component.css']
})

export class NavbarTrainerComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }



}
