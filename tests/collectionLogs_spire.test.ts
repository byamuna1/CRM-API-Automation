import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, createFolder } from '../generic/apiRequest_spire';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH , } from '../constants';
import {  SPIRE } from '../meta';
const fs = require('fs')
let receiptDetails : any = {};
let missingCount = 1;
let misingReceiptCount = 1;
let mismatchReceiptCount =1 ;
let receipt_scr = new Map<any,any>() ; 
let receipts_system = new Map<any,any>() ; 

test ("spire ReceiptLogs Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPIRE.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.RECEIPTLOGS_DATA);

    let workbook1 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.COLECTION_LOGS);
    if(fs.existsSync(filePath1))
    {
        await workbook1.xlsx.readFile(filePath1);
    }
    const mismatchData = workbook1.addWorksheet(EXCELS.SPIRE);
    
    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.RECEIPTNUMBER , key : 'receiptNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.AMOUNT , key : 'amount'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ]

    const rowcount = worksheet.rowCount;  
    const response = await apiRequestReceiptLogs('');
    
    for(let i =0; i< response.length;i++)
    {
        const isFlatCancelled = response[i]['isCancelled']?1:0;
        if(response[i]['amountType'] == 'CREDIT' && response[i][RESPONSE.RECEIPTNUMBER] != null && isFlatCancelled != 1)
        {
            receipts_system.set(String(parseInt(response[i][RESPONSE.RECEIPTNUMBER])),{'flatNumber': response[i][RESPONSE.FLATNUMBER], 'amount' : response[i][RESPONSE.AMOUNT] , 'referenceNumber' : response[i][RESPONSE.REFERENCE_NUMBER]})
        }
    }
   
    for(let i = 6;i<5000;i++)
    {
        const row = worksheet.getRow(i) ;
        receiptDetails ={
            sNO : row.getCell(1).value?.result??row.getCell(1).value,
            date : row.getCell(2).value,
            receiptNo : row.getCell(4).value,
            flatNumber : row.getCell(5).value,
            customerName : row.getCell(7).value,
            source : row.getCell(8).value,
            milestone : row.getCell(9).value,
            bank : row.getCell(10).value,
            type:row.getCell(11).value,
            referenceNumber : row.getCell(12).value,
            amount : row.getCell(13).value
        }

        if((receiptDetails.milestone != 'Lumpsum' && receiptDetails.receiptNo != null && receiptDetails.amount != null && receiptDetails.milestone != 'Cancel') || (receiptDetails.milestone == 'Lumpsum' && receiptDetails.receiptNo != null) )
        {
            receipt_scr.set(String(parseInt(receiptDetails.receiptNo)),{'sNo':receiptDetails.sNO , 'date' : receiptDetails.date ,'flatNumber' : receiptDetails.flatNumber , 'customerName' : receiptDetails.customerName , 'source': receiptDetails.source, 'type' : receiptDetails.type , 'amount' : receiptDetails.amount , 'referenceNumber' : receiptDetails.referenceNumber})
            
        }
       
        receiptDetails ={}
    }
    
    let receiptfromSystem, receiptfromSCR ;
    for (const [key, value] of receipt_scr.entries()) {
        receiptfromSCR = value
        let receiptLogs_types = {
            receiptAmountfromscr : null ,
            receiptAmountfromSystem : null ,
            referenceNofromscr : null ,
            referenceNofromSystem : null , 
            flatNofromScr : null ,
            flatNofromSystem : null
        }

        let flag = 0;
        
        if(receipts_system.has(key))
        {
           receiptfromSystem = receipts_system.get(key) ;
           if(receiptfromSystem.flatNumber != receiptfromSCR.flatNumber)
            {
                flag = 1;
                receiptLogs_types.flatNofromScr = receiptfromSCR.flatNumber ;
                receiptLogs_types.flatNofromSystem = receiptfromSystem.flatNumber ;
            }
            if(Math.abs(receiptfromSystem.amount - receiptfromSCR.amount) > 10)
            {
                flag = 1;
                receiptLogs_types.receiptAmountfromscr = receiptfromSCR.amount ;
                receiptLogs_types.receiptAmountfromSystem = receiptfromSystem.amount ;
                mismatchData.addRow({
                    sNo : missingCount++ ,
                    flatNo :receiptfromSystem.flatNumber,
                    receiptNo : key,
                    Issue : 'mismatch-ReceiptAmount',
                    scr :  receiptLogs_types.receiptAmountfromscr,
                    system: receiptLogs_types.receiptAmountfromSystem,
               });
            }
            if(String(receiptfromSCR.referenceNumber).trim().includes(String(receiptfromSystem.referenceNumber).trim()) == false) 
            {
                flag = 1; 
                receiptLogs_types.referenceNofromscr = receiptfromSCR.referenceNumber ;
                receiptLogs_types.referenceNofromSystem = receiptfromSystem.referenceNumber ;
                mismatchData.addRow({
                    sNo : missingCount++ ,
                    flatNo :receiptfromSystem.flatNumber,
                    receiptNo : key,
                    Issue : 'mismatch-referenceNo',
                    scr : receiptLogs_types.referenceNofromscr,
                    system: receiptLogs_types.referenceNofromSystem,
               });
            }
        }
        else if(receiptfromSCR.flatNumber !=null)
        {
            mismatchData.addRow({
                sNo : missingCount++ ,
                flatNo :receiptfromSCR.flatNumber,
                receiptNo : key,
                Issue : 'Missing-Receipt',
                scr : 'present',
                system: 'missing',
                amount : receiptfromSCR.amount
           });
        }
    }

    for (const [key, value] of receipts_system.entries()) {
        const value1 = receipts_system.get(key) ;
        if(receipt_scr.has(key)== false)
        {
            mismatchData.addRow({
                sNo : missingCount++ ,
                flatNo :value1.flatNumber,
                receiptNo : key,
                Issue : 'Missing-Receipt',
                scr : 'missing',
                system: 'present',
                amount : value1.amount
           });

        }
     }

    await workbook1.xlsx.writeFile(filePath1);
      
}); 