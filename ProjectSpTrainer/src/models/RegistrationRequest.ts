import { User } from './User';

export class RegistrationRequest{
    id:number;
    iduser:number;
    idgroup:number;
    state:string;
    comment:string
    dateregistration:string;
    answer:string;
    dateanswer:string;
    user:User;
    color:string;
}