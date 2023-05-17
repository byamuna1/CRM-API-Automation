import {expect , test} from '@playwright/test'
import { apiRequestSaleParticulars, createFolder } from '../generic/apiRequest_spectra';
import { EXCELS,EXCELJS, RESPONSE,HEADERS,PATH, SHEETS } from '../constants';
import { SPECTRA } from '../meta';
let flatDetails : any = {};
let grossAmountDetails :any  = {};
let saleparticular_Details : any = {};
let grossAmount_scr = new Map<any,any>();
let count = 1;
let count1 = 1,flag = 1;
let saleParticulars_system = new Map<any,any>() ; 
let saleParticulars_scr = new Map<any,any>() ; 

test ("spectra Sale Particulars" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPECTRA.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.RECEIVABLELOGS_DATA);
    const worksheet1 = workbook.getWorksheet(SHEETS.MASTER_DATA);
    const workbook1 = new ExcelJS.Workbook();
    const missingFlats = workbook1.addWorksheet(EXCELS.MISSING_FLATS);
    const missmatchFlats = workbook1.addWorksheet(EXCELS.MISMATCH_FLATS);

    missingFlats.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
    ];
    
    missmatchFlats.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
        { header: HEADERS.TOTALAMOUNTFROMEXCEL, key: 'toatlAmountExcel' },
        { header: HEADERS.TOTALAMOUNTFROMSYSTEM, key: 'toatlAmountSystem' },
        { header: HEADERS.ACCUREDAMOUNTFROMEXCEL, key: 'accuredAmountExcel'},
        { header: HEADERS.ACCUREDAMOUNTFROMSYSTEM, key: 'accuredAmountSystem' },
        { header: HEADERS.COLLECTEDAMOUNTFROMEXCEL, key: 'collectedAmountExcel' },
        { header: HEADERS.COLLECTEDAMOUNTFROMSYSTEM, key: 'collectedAmountSystem' },
        { header: HEADERS.RECEIVABLEAMOUNTFROMEXCEL, key: 'receivableAmountExcel' },
        { header: HEADERS.RECEIVABLEAMOUNTFROMSYSTEM, key: 'receivableAmountSystem' }
    ];

    const rowcount = worksheet.rowCount;    

    for(let i=4;i<rowcount;i++)
    {
        const row = worksheet.getRow(i) ;
        flatDetails = {
                sNo : row.getCell(1).value?.result??row.getCell(1).value,
                flatNumber : row.getCell(3).value ,
                accruedAmount : row.getCell(5).value?.result??0 ,
                collectedAmount : row.getCell(6).value?.result??0  ,
                receivableAmount : row.getCell(7).value?.result??0
        }
        if(flatDetails.accruedAmount != 0)
        {
        saleParticulars_scr.set(String(flatDetails.flatNumber) , {'flatNumber' : flatDetails.flatNumber, 'accruedAmount' : flatDetails.accruedAmount , 'collectedAmount' : flatDetails.collectedAmount , 'receivableAmount' : flatDetails.receivableAmount})
    
        }
    }

    const rowcount1 = worksheet1.rowCount; 
    for(let i=6;i<rowcount;i++)
    {
        const row = worksheet1.getRow(i) ;
        grossAmountDetails = {
                flatNumber : row.getCell(3).value ,
                statusOfFLat : row.getCell(12).value,
                totalAmount : row.getCell(48).value?.result??0,
        }

        if(grossAmountDetails.statusOfFLat == RESPONSE.BOOKED || grossAmountDetails.statusOfFLat == RESPONSE.booked )
        {
            grossAmount_scr.set(String(grossAmountDetails.flatNumber) , {'flatNumber' : grossAmountDetails.flatNumber, 'totalAmount' : grossAmountDetails.totalAmount})
           
        }
    }
    
    const response = await apiRequestSaleParticulars();

    for( let index =0 ; index < response.length ; index++)
    {
        saleparticular_Details = {
            flatNumber : response[index]['flatNumber'] ,
            totalAmount : response[index]['totalAmount'],
            accruedAmount : response[index]['accruedAmount'] ,
            collectedAmount : response[index]['collectedAmount'],
            receivableAmount : response[index]['receivableAmount']
        }
       
        saleParticulars_system.set(String(response[index][RESPONSE.FLATNUMBER]), saleparticular_Details)
    }

    for(const [key, value] of saleParticulars_scr.entries())
    {
        let saleParticularSCR : any = value
        let saleParticularsTypes = {
            totalAmtExl : null, 
            accuredAmtExl: null , 
            collectedAmtExl : null , 
            recAmtExl : null ,
            totalAmtSys : null ,
            accuredAmtSys : null  , 
            collectedASys : null ,
            recAmtSys :null
        }
        if(saleParticulars_system.has(key))
         {
            let total_scr: any = {} ;
            if(grossAmount_scr.has(key))
            {
             total_scr = grossAmount_scr.get(key) ;
            }
            let saleParticularFromSystem = saleParticulars_system.get(key) ;
           
               if(Math.abs(total_scr.totalAmount - saleParticularFromSystem.totalAmount)>10 )
                {
                    flag = 0;
                    saleParticularsTypes.totalAmtExl =  total_scr.totalAmount ;
                    saleParticularsTypes.totalAmtSys =  saleParticularFromSystem.totalAmount ;
                }
                if(Math.abs(saleParticularSCR.accruedAmount- saleParticularFromSystem.accruedAmount) > 10)
                {
                    flag = 0;
                    saleParticularsTypes.accuredAmtExl = saleParticularSCR.accruedAmount
                    saleParticularsTypes.accuredAmtSys = saleParticularFromSystem.accruedAmount
                }
                if(Math.abs(saleParticularSCR.collectedAmount - saleParticularFromSystem.collectedAmount)> 10)
                {
                    flag = 0 ;
                    saleParticularsTypes.collectedAmtExl = saleParticularSCR.collectedAmount
                    saleParticularsTypes.collectedASys = saleParticularFromSystem.collectedAmount
                }
                if(Math.abs(saleParticularSCR.receivableAmount - saleParticularFromSystem.receivableAmount) > 10)
                {
                    flag = 0;
                    saleParticularsTypes.recAmtExl = saleParticularSCR.receivableAmount
                    saleParticularsTypes.recAmtSys = saleParticularFromSystem.receivableAmount
                }
                if(flag == 0)
                {
                    missmatchFlats.addRow({
                            sNo: count1++,
                            flatNo: key,
                            toatlAmountExcel: saleParticularsTypes.totalAmtExl,
                            toatlAmountSystem :saleParticularsTypes.totalAmtSys ,
                            accuredAmountExcel : saleParticularsTypes.accuredAmtExl,
                            accuredAmountSystem :saleParticularsTypes.accuredAmtSys ,
                            collectedAmountExcel : saleParticularsTypes.collectedAmtExl,
                            collectedAmountSystem : saleParticularsTypes.collectedASys ,
                            receivableAmountExcel: saleParticularsTypes.recAmtExl,
                            receivableAmountSystem: saleParticularsTypes.recAmtSys,
                            });
                }
                flag = 1;
        }
        else
        {
            if(key != 'null')
            {
                missingFlats.addRow({
                    sNo: count++,
                    flatNo: key,
                });
           }
        }
    }
        
    await createFolder();
    const path = require(PATH);
    const filePath = path.join(__dirname, EXCELS.SPECTRA_SALEPARTICULARS);
    await workbook1.xlsx.writeFile(filePath);
}); 