import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public getToken(): any {
    let token = localStorage.getItem('access_token');
    if (token == null || token == undefined) {
      return token = ''
    } else {
      return token
    }
  }

  public getEncryptionKey(): any {
    let encKey = localStorage.getItem('encryptionKey');
    if (encKey == null || encKey == undefined) {
      return encKey = ''
    } else {
      return encKey
    }
  }

}
