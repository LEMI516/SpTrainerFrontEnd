import { User } from './User';
import { GroupTrainer } from './GroupTrainer';

export class ResponseGroupInitDTO{
    categories:any;
    users:Array<User>=new Array<User>();
    groups:Array<GroupTrainer>=new Array<GroupTrainer>();
}