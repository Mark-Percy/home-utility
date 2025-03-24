import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, Form} from '@angular/forms';
import { BinService, BinInterface, AbnormalWeekInterface} from '../bin.service';

@Component({
  selector: 'app-bin',
  imports: [ReactiveFormsModule],
  templateUrl: './bin.component.html',
  styleUrl: './bin.component.css'
})
export class BinComponent {

  dayNames:string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  monthsNames:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'];
  binForm: FormGroup;
  binItems: FormArray;
  abnormalWeeks: FormArray;
  months: MonthInterface[] | null = null;
  year: number;
  currDate: Date;

  constructor(private fb: FormBuilder, private binService: BinService) {
    this.binForm = this.fb.group({
      collectionDay: '',
      bins: this.fb.array([]),
      abnormalWeeks:this.fb.array([])
    })

    this.currDate = new Date();
    this.year = this.currDate.getFullYear()
    this.binItems = this.getBins();
    this.abnormalWeeks = this.getAbnormalWeeks();
    const binsDataSnap = this.getBinsData();
    binsDataSnap.then((binsData) => {
      if(binsData == null) {
        this.months = this.generateMonths();
      } else {
        const abnormalWeeksMap: Map<number, number> = this.createAbnormalWeeksMap(binsData.abnormalWeeks);
        this.months = this.generateMonths(binsData.collectionDay, binsData.bins, abnormalWeeksMap);
      }
    })
  }

  addBinsData() {
    const weekNum = this.binForm.get('collectionDay')
    if(!weekNum) {
      return
    }
    const bins: BinInterface[] = this.binForm.get('bins')?.value
    const abnormalWeeks: AbnormalWeekInterface[] = this.binForm.get('abnormalWeeks')?.value
    const abnormalWeeksMap = this.createAbnormalWeeksMap(abnormalWeeks)
    
    this.binService.addYearData(this.binForm.value, this.year)
    this.months = this.generateMonths(weekNum.value, bins, abnormalWeeksMap)
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

  generateMonths(day?: number, bins?:BinInterface[], abnormalWeeks?: Map<number, number>): MonthInterface[] | null {
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
    let weeks: WeekInterface[] = []
    let weekNum = 1
    const months: MonthInterface[] = []
    const monthsContained:number[] = []
    while(currDate.getFullYear() == currYear) {
      const currMonth: number = currDate.getMonth()
      if(!monthsContained.includes(currMonth) && currMonth != 0) {
        monthsContained.push(currMonth)
        months.push({monthNum: currMonth - 1, weeksData: weeks})
        weeks = [];
      }
      let diffNumber: number = 0
      if(day && abnormalWeeks && abnormalWeeks.has(weekNum) && abnormalWeeks.get(weekNum) != undefined){
        const dayofWeek = abnormalWeeks.get(weekNum)
        if(dayofWeek != undefined) diffNumber = dayofWeek - day
      }
      const binsForWeek: BinInterface[] = []
      bins?.forEach((bin) => {
        
        if(bin.fromWeek == weekNum && (bin.toWeek == null || bin.toWeek > weekNum)) {
          bin.fromWeek += bin.interval
          binsForWeek.push(bin);
        }
      })
      currDate.setDate(currDate.getDate() + diffNumber)
      weeks.push({weekNum: weekNum, date: new Date(currDate), bins: binsForWeek})
      weekNum += 1
      currDate.setDate(currDate.getDate() + (7 - diffNumber));
    }

    months.push({monthNum: 11, weeksData: weeks})

    return months
  }

  getBinsData() {
    return this.binService.getYearData(this.year);
  }

  createAbnormalWeeksMap(abnormalWeeks: AbnormalWeekInterface[]) {
    const abnormalWeeksMap = new Map()
    for(let i = 0; i < abnormalWeeks.length; i++) {
      abnormalWeeksMap.set(abnormalWeeks[i].weekNumber, abnormalWeeks[i].collectionDay)
    }
    return abnormalWeeksMap
  }
}


interface WeekInterface {
  date: Date;
  weekNum: number;
  bins?: BinInterface[];
}
interface MonthInterface {
  monthNum: number;
  weeksData: WeekInterface[]
}