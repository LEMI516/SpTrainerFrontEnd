import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { PanelPComponent } from './views/panel-p/panel-p.component';
import { RegisterComponent } from './views/register/register.component';
import { SystemLoginComponent } from './views/system-login/system-login.component';
import { NavbarAComponent } from './views/navbar-a/navbar-a.component';
import {FormsModule} from '@angular/forms';
import { NavbarTrainerComponent } from './views/navbar-trainer/navbar-trainer.component';
import { ManageGroupComponent } from './views/manage-group/manage-group.component';
import { UPDATEDATAComponent } from './views/update-data/update-data.component';
import { GroupNotificationsComponent } from './views/group-notifications/group-notifications.component';
import { AddGroupComponent } from './views/add-group/add-group.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { RouterPComponent } from './views/router-p/router-p.component';
import { NavbarTComponent } from './views/navbar-t/navbar-t.component';
import { ModalCreateComponent } from './views/modal-create/modal-create.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './views/toast/toast.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyGroupComponent } from './views/viewsClient/my-group/my-group.component';
import { SearchGroupComponent } from './views/viewsClient/search-group/search-group.component';
import { ManageClientComponent } from './views/manage-client/manage-client.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { defineLocale, esDoLocale } from 'ngx-bootstrap/chronos';
import { ModelGroupInfoComponent } from './views/model-group-info/model-group-info.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
defineLocale('es-do', esDoLocale); 


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelPComponent,
    RegisterComponent,
    SystemLoginComponent,
    NavbarAComponent,
    NavbarTrainerComponent,
    ManageGroupComponent,
    UPDATEDATAComponent,
    GroupNotificationsComponent,
    AddGroupComponent,
    RouterPComponent,
    NavbarTComponent,
    ModalCreateComponent,
    ToastComponent,
    MyGroupComponent,
    SearchGroupComponent,
    ManageClientComponent,
    ModelGroupInfoComponent
    
    
  ],
  imports: [
    BrowserModule,AppRoutingModule,FormsModule,NgbModule,HttpClientModule, 
    ReactiveFormsModule,NgxSpinnerModule,BrowserAnimationsModule, 
    BsDatepickerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCiL3tfouf-FqpN3oI1PHkVGJ2J6JU7SBk',
      libraries: ['places']
    }),
    TimepickerModule.forRoot(),
    FilterPipeModule
   
  ],
  entryComponents:[
    ModalCreateComponent,
    ModelGroupInfoComponent
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
