import { User } from './User';
import { SesionTrainer } from './SesionTrainer';
import { RegistrationRequest } from './RegistrationRequest';
import { Member } from './Member';
import { calification } from './calification';
import { ImageCalificate } from './ImageCalificate';

export class GroupTrainer{
    id:number;
    iduser:number;
    name:string;
    description:string;
    quantity:number;
    active:string;
    state:string;
    enddate:string;
    startdate:string;
    type_schedule:string;
    address:string;
    sitie:string;
    coordinate:string;
    colour:string;
    category:string; 
    date_publish:string;
    user: User; 
    state_user_consulting : string;
    quantity_solicitude_pending : number;
    quantity_member : number;
    sessions: SesionTrainer[];
    requests : RegistrationRequest[];
    members : Member[];
    calificationuser : calification;
    imagecalificate:Array<ImageCalificate>=new Array<ImageCalificate>();
    checked:boolean;
}