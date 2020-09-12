import { Injectable, TemplateRef  } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];
 
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }
 
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  removeforId(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  removeAll(){
    this.toasts = [];
  }
}
