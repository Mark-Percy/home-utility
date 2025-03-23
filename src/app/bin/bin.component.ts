import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, Form} from '@angular/forms';

@Component({
  selector: 'app-bin',
  imports: [ReactiveFormsModule],
  templateUrl: './bin.component.html',
  styleUrl: './bin.component.css'
})
export class BinComponent {

  numDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  binForm: FormGroup;
  binItems: FormArray;
  abnormalWeeks: FormArray;
  weeks: WeekInterface[];
  constructor(private fb: FormBuilder) {
    this.binForm = this.fb.group({
      collectionDay: '',
      bins: this.fb.array([]),
      abnormalWeeks:this.fb.array([])
    })

    this.binItems = this.getBins();
    this.abnormalWeeks = this.getAbnormalWeeks();
    this.weeks = this.generateWeeks();
  }

  addBinsData() {
    const weekNum = this.binForm.get('collectionDay')
    if(!weekNum) {
      return
    }
    const bins: BinInterface[] = this.binForm.get('bins')?.value
    const abnormalWeeks: AbnormalWeekInterface[] = this.binForm.get('abnormalWeeks')?.value
    const abnormalWeeksMap: Map<number, number> = new Map()
    for(let i = 0; i < abnormalWeeks.length; i++) {
      abnormalWeeksMap.set(Number(abnormalWeeks[i].weekNumber), Number(abnormalWeeks[i].collectionDay)+1)
    }
    
    this.weeks = this.generateWeeks(Number(weekNum.value)+1, bins, abnormalWeeksMap)
  }
  addBin() {
    const bins: FormArray = this.getBins();
    
    if(bins) bins.push(this.fb.group({
      colour: '',
      interval: '',
      fromWeek: '',
      toWeek: [null],
    }))
  }

  addAbnormal() {
    const abnormalWeeks: FormArray = this.getAbnormalWeeks();

    if(abnormalWeeks) abnormalWeeks.push(this.fb.group({
      weekNumber: '',
      collectionDay: ''
    }))
  }

  getBins() {
    return this.binForm.get('bins') as FormArray;
  }

  getAbnormalWeeks() {
    return this.binForm.get('abnormalWeeks') as FormArray;
  }

  generateWeeks(day?: number, bins?:BinInterface[], abnormalWeeks?: Map<number, number>): WeekInterface[] {
    let currDate: Date = new Date()
    const currYear: number = currDate.getFullYear()
    currDate.setDate(1)
    currDate.setMonth(0)
    if(day) {
      const dayOfWeek = currDate.getDay()
      let diff = (day - dayOfWeek) 
      if(diff < 0) {diff = 7 + diff}
      currDate.setDate(currDate.getDate() + diff)
    }
    const weeks: WeekInterface[] = []
    let weekNum = 1
    while(currDate.getFullYear() == currYear) {
      let diffNumber = 0
      if(day && abnormalWeeks && abnormalWeeks.has(weekNum) && abnormalWeeks.get(weekNum) != undefined){
        const dayofWeek = abnormalWeeks.get(weekNum)
        if(dayofWeek != undefined) diffNumber = dayofWeek - day
      }
      const binsForWeek: BinInterface[] = []
      bins?.forEach((bin) => {
        if(bin.fromWeek == weekNum && (bin.toWeek == null || bin.toWeek > weekNum)) {
          bin.fromWeek += bin.interval
          binsForWeek.push(bin)
        }
      })
      currDate.setDate(currDate.getDate() + diffNumber)
      weeks.push({weekNum: weekNum, date: new Date(currDate), bins: binsForWeek})
      weekNum += 1
      currDate.setDate(currDate.getDate() + (7 - diffNumber));
    }
    return weeks
  }
}


interface WeekInterface {
  date: Date;
  weekNum: number;
  bins?: BinInterface[];
}

interface BinInterface {
  colour: string;
  interval: number;
  fromWeek: number;
  toWeek: number | null;
}

interface AbnormalWeekInterface {
  weekNumber: number;
  collectionDay: number;
}