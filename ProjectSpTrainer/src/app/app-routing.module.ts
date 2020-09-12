import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { SystemLoginComponent } from './views/system-login/system-login.component';
import { NavbarTrainerComponent } from './views/navbar-trainer/navbar-trainer.component';
import { UPDATEDATAComponent } from './views/update-data/update-data.component';
import { ManageGroupComponent } from './views/manage-group/manage-group.component';
import { GroupNotificationsComponent } from './views/group-notifications/group-notifications.component';
import { RouterPComponent } from './views/router-p/router-p.component';
import { MyGroupComponent } from './views/viewsClient/my-group/my-group.component';
import { SearchGroupComponent } from './views/viewsClient/search-group/search-group.component';
import { ManageClientComponent } from './views/manage-client/manage-client.component';


const routes: Routes = [
    { path: '', redirectTo: '/LoginComponent', pathMatch: 'full' },
    { path: 'LoginComponent', component: LoginComponent },
    {path:'register',component: RegisterComponent },
    {path:'system_login',component:NavbarTrainerComponent},
   

    {path:'routerP',component:RouterPComponent,children:[  
    { path: 'UPDATE_DATA', component: UPDATEDATAComponent},
    { path: 'manage-group', component: ManageGroupComponent },
    {path:'group_notifications',component:GroupNotificationsComponent},
    { path: 'searchGroup', component: SearchGroupComponent },
    {path:'mygroup',component:MyGroupComponent},
    {path:'manage-client',component:ManageClientComponent}
    
]
    }
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
    })
    export class AppRoutingModule { }
