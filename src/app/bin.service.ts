import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class BinService {

  constructor(private fs: Firestore, private accountService: AccountService) { }

  addYearData(binData: YearInterface, year: number) {
    const user = this.accountService.getUser()
    if(!user) {
      return
    }
    const yearRef = doc(this.fs, `${user.uid}years/${year}`)
    setDoc(yearRef, binData);
  }

  async getYearData(year:number): Promise<YearInterface | null> {
    const user = this.accountService.getUser()
    if(!user) {
      return null
    }
    const yearRef = doc(this.fs, `${user.uid}years/${year}`)
    const docSnap = await getDoc(yearRef)
    if(docSnap.exists()) {
      return docSnap.data() as YearInterface
    }
    return null
  }
}


export interface BinInterface {
  colour: string;
  interval: number;
  fromWeek: number;
  toWeek: number | null;
}

export interface YearInterface {
  collectionDay: number;
  abnormalWeeks: AbnormalWeekInterface[];
  bins: BinInterface[];

}

export interface AbnormalWeekInterface {
  weekNumber: number;
  collectionDay: number;
}