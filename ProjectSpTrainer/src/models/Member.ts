import { User } from './User';
import { ImageCalificate } from './ImageCalificate';
import { calification } from './calification';

export class Member{
    iduser:number;
    idgroup:number;
    state:string;
    date_save:string;
    date_update:string;
    n:number;
    user:User;
    imagecalificate:Array<ImageCalificate>=new Array<ImageCalificate>();
    calification: calification;
}