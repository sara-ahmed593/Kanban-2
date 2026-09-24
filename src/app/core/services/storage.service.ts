
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  setItem(key: string, value: any): void {

    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any | null {

    const item = localStorage.getItem(key);

    if (!item) {
      return null;
    }
    return JSON.parse(item);

  }

}




