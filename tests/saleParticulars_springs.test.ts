import {expect , test} from '@playwright/test'
import { apiRequestSaleParticulars } from '../generic/apiRequest_springs';
import { EXCELS, RESPONSE, SHEETS, EXCELJS , HEADERS, PATH} from '../constants';
import { SPRINGS } from '../meta';
import { createFolder } from '../generic/apiRequest_springs';
const fs = require('fs')
let flatDetails : any = {};
let grossAmountDetails :any  = {};
let saleparticular_Details : any = {};
let grossAmount_scr = new Map<any,any>();
let count = 1;
let count1 = 1,flag = 1;
let saleParticulars_system = new Map<any,any>() ; 
let saleParticulars_scr = new Map<any,any>() ; 

test ("springs Sale Particulars" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPRINGS.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.RECEIVABLELOGS_DATA);
    const worksheet1 = workbook.getWorksheet(SHEETS.MASTER_DATA);

    let workbook1 = new ExcelJS.Workbook();
    let workbook2 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SALE_PARTICULARS);
    const filepath2 = path.join(__dirname , EXCELS.FLAT_MIS_DETAILS)

    if(fs.existsSync(filePath1))
        await workbook1.xlsx.readFile(filePath1);
    if(fs.existsSync(filepath2))
       await workbook2.xlsx.readFile(filepath2);

    const saleparticulars = workbook1.addWorksheet(EXCELS.SPRINGS);
    const flat_mis = workbook2.addWorksheet(EXCELS.SPRINGS);

    saleparticulars.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ];
    
    flat_mis.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ];

    const rowcount = worksheet.rowCount;    

    for(let i=4;i<rowcount;i++)
    {
        const row = worksheet.getRow(i) ;
        flatDetails = {
                sNo : row.getCell(1).value?.result??row.getCell(1).value,
                flatNumber : row.getCell(2).value ,
                accruedAmount : row.getCell(4).value?.result??0 ,
                collectedAmount : row.getCell(5).value?.result??0  ,
                receivableAmount : row.getCell(6).value?.result??0
        }
        if(flatDetails.accruedAmount != 0)
        {
        saleParticulars_scr.set(String(flatDetails.flatNumber) , {'flatNumber' : flatDetails.flatNumber, 'accruedAmount' : flatDetails.accruedAmount , 'collectedAmount' : flatDetails.collectedAmount , 'receivableAmount' : flatDetails.receivableAmount})
        }
    }

    const rowcount1 = worksheet1.rowCount; 
    for(let i=6;i<rowcount1;i++)
    {
        const row = worksheet1.getRow(i) ;
        grossAmountDetails = {
                flatNumber : row.getCell(2).value ,
                statusOfFLat : row.getCell(11).value,
                grossAmount : row.getCell(46).value?.result??0
        }

        if(grossAmountDetails.statusOfFLat == RESPONSE.BOOKED || grossAmountDetails.statusOfFLat == RESPONSE.booked )
        {
            grossAmount_scr.set(String(grossAmountDetails.flatNumber) , {'flatNumber' : grossAmountDetails.flatNumber, 'totalAmount' : grossAmountDetails.grossAmount})
        
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
        let saleParticularSCR : any = value ;
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
                    saleparticulars.addRow({
                        sNo: count1++,
                        flatNo: key,
                        Issue : 'Total Amount',
                        scr : saleParticularsTypes.totalAmtExl,
                        system : saleParticularsTypes.totalAmtSys
                        });
                }
                if(Math.abs(saleParticularSCR.accruedAmount- saleParticularFromSystem.accruedAmount) > 10)
                {
                    flag = 0;
                    saleParticularsTypes.accuredAmtExl = saleParticularSCR.accruedAmount
                    saleParticularsTypes.accuredAmtSys = saleParticularFromSystem.accruedAmount
                    saleparticulars.addRow({
                        sNo: count1++,
                        flatNo: key,
                        Issue : 'Accrued Amount',
                        scr : saleParticularsTypes.accuredAmtExl,
                        system : saleParticularsTypes.accuredAmtSys
                        });
                }
                if(Math.abs(saleParticularSCR.collectedAmount - saleParticularFromSystem.collectedAmount)> 10)
                {
                    flag = 0 ;
                    saleParticularsTypes.collectedAmtExl = saleParticularSCR.collectedAmount
                    saleParticularsTypes.collectedASys = saleParticularFromSystem.collectedAmount
                    saleparticulars.addRow({
                        sNo: count1++,
                        flatNo: key,
                        Issue : 'Collected Amount',
                        scr : saleParticularsTypes.collectedAmtExl,
                        system : saleParticularsTypes.collectedASys
                        });
                }
                if(Math.abs(saleParticularSCR.receivableAmount - saleParticularFromSystem.receivableAmount) > 10)
                {
                    flag = 0;
                    saleParticularsTypes.recAmtExl = saleParticularSCR.receivableAmount
                    saleParticularsTypes.recAmtSys = saleParticularFromSystem.receivableAmount
                    saleparticulars.addRow({
                        sNo: count1++,
                        flatNo: key,
                        Issue : 'Receivable Amount',
                        scr : saleParticularsTypes.recAmtExl,
                        system : saleParticularsTypes.recAmtSys
                        });
                }
        }
        else
        {
            if(key != 'null')
            {
                flat_mis.addRow({
                    sNo: count++,
                    flatNo: key,
                    Issue : 'Missing-FLat',
                    scr : 'present',
                    system : 'missing'
                    });
            }
        }
    }
        
    for(const [key, value] of saleParticulars_system.entries())
    {
        if(saleParticulars_scr.has(key) == false)
        {
            flat_mis.addRow({
                sNo: count++,
                flatNo: key,
                Issue : 'Missing-Flat',
                scr : 'missing',
                system : 'present'
                });
        }
    }
        
    await workbook1.xlsx.writeFile(filePath1);
    await workbook2.xlsx.writeFile(filepath2);
    
}); 