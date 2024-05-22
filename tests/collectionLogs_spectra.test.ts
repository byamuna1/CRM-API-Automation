import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, createFolder } from '../generic/apiRequest_spectra';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH , } from '../constants';
import { SPECTRA } from '../meta';
const fs = require('fs')
let receiptDetails : any = {};
let missingCount = 1;
let receipt_scr = new Map<any,any>() ; 
let receipts_system = new Map<any,any>() ; 

test ("Spectra ReceiptLogs Details" , async () => {
    
    const response = await apiRequestReceiptLogs('');
    for(let i =0; i< response.length;i++)
    {
       console.log(response[i])

    }
   

})