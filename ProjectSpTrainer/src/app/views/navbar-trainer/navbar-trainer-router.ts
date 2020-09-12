import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageGroupComponent } from '../manage-group/manage-group.component';



const routes: Routes = [

    { path: '/manage-group', component: ManageGroupComponent },
 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
    })
    export class AppRoutingModule { 

        
    }
