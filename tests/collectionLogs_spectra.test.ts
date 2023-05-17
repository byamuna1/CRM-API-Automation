import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, createFolder } from '../generic/apiRequest_spectra';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH , } from '../constants';
import { SPECTRA } from '../meta';
let receiptDetails : any = {};
let missingCount = 1;
let misingReceiptCount = 1;
let mismatchReceiptCount =1 ;
let receipt_scr = new Map<any,any>() ; 
let receipts_system = new Map<any,any>() ; 

test ("Spectra ReceiptLogs Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPECTRA.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.RECEIPTLOGS_DATA);

    const workbook1 = new ExcelJS.Workbook();
    const mismatchData = workbook1.addWorksheet(EXCELS.MISMATCH_RECEIPTS);
    const noReceiptNo = workbook1.addWorksheet(EXCELS.SUSPENSE_LUMPSUM_NORECEIPTNO);
    const missingData = workbook1.addWorksheet(EXCELS.MISSING_RECEIPTS);
    
    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.RECEIPTNUMBER , key : 'receiptNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        {header : HEADERS.FLATNO_SYSTEM , key : 'flatNo_system'},
        { header : HEADERS.RECEIPTAMOUNT_SYSTEM, key : 'receiptAmountSystem'},
        { header: HEADERS.RECEIPTAMOUNT, key: 'amount' },
        { header: HEADERS.RECEIPTREFERENCENO, key: 'referenceNumber' },
        { header: HEADERS.REFERENCE_NUM_SYSTEM, key: 'referenceNumberFromSystem' },
    ]
    noReceiptNo.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.RECEIPTNUMBER , key : 'receiptNo'},
        { header: HEADERS.RECEIPTAMOUNT, key: 'amount' },
        { header: HEADERS.RECEIPTREFERENCENO, key: 'referenceNo' },
        { header: HEADERS.PAYMENTTYPE, key: 'paymenttype' },
    ]
    missingData.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.DATE, key: 'date' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
        { header: HEADERS.RECEIPTNUMBER, key: 'receiptNo' },
        { header: HEADERS.RECEIPTAMOUNT, key: 'amount' },
        { header: HEADERS.RECEIPTREFERENCENO, key: 'refNumber'},
        { header: HEADERS.RECEIPTSOURCE, key: 'source' },
        { header: HEADERS.RECEIPTTYPE, key: 'type' },
    ];

    const rowcount = worksheet.rowCount;  
    const response = await apiRequestReceiptLogs('');
    for(let i =0; i< response.length;i++)
    {
        if(response[i][RESPONSE.RECEIPTNUMBER] == null || response[i][RESPONSE.REFERENCE_NUMBER] == 'LUMPSUM' || response[i][RESPONSE.AMOUNTTYPE] == 'CANCELLED' || response[i][RESPONSE.ISSUSPENSE] == true)
        {
           noReceiptNo.addRow({
                sNo : missingCount++ ,
                receiptNo : response[i][RESPONSE.RECEIPTNUMBER],
                flatNo : response[i][RESPONSE.FLATNUMBER],
                amount : response[i][RESPONSE.AMOUNT],
                referenceNo : response[i][RESPONSE.REFERENCE_NUMBER],
                paymenttype : response[i][RESPONSE.AMOUNTTYPE]

           });
        }
        else
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

        if(receiptDetails.milestone != 'Lumpsum' && receiptDetails.receiptNo != null && receiptDetails.amount != null)
        {
            receipt_scr.set(String(parseInt(receiptDetails.receiptNo)),{'sNo':receiptDetails.sNO , 'date' : receiptDetails.date ,'flatNumber' : receiptDetails.flatNumber , 'customerName' : receiptDetails.customerName , 'source': receiptDetails.source, 'type' : receiptDetails.type , 'amount' : receiptDetails.amount , 'referenceNumber' : receiptDetails.referenceNumber})
            
        }
        receiptDetails ={}
    }
    
    let receiptfromSystem, receiptfromSCR ;
    for (const [key, value] of receipt_scr.entries()) 
    {
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
            }
            if(receiptfromSystem.referenceNumber != receiptfromSCR.referenceNumber) 
            {
                flag = 1; 
                receiptLogs_types.referenceNofromscr = receiptfromSCR.referenceNumber ;
                receiptLogs_types.referenceNofromSystem = receiptfromSystem.referenceNumber ;
            }
            if ( flag == 1)
            {
                mismatchData.addRow({
                    sNo : mismatchReceiptCount++,
                    receiptNo : key,
                    flatNo : receiptLogs_types.flatNofromScr,
                    flatNo_system : receiptLogs_types.flatNofromSystem,
                    receiptAmountSystem : receiptLogs_types.receiptAmountfromSystem,
                    amount : receiptLogs_types.receiptAmountfromscr,
                    referenceNumber : receiptLogs_types.referenceNofromscr,
                    referenceNumberFromSystem : receiptLogs_types.referenceNofromSystem ,
                });
            }
        }
        else if(receiptfromSCR.flatNumber !=null)
        {
            var myDate = receiptfromSCR.date.toISOString().substr(0, 10)
            missingData.addRow({
                sNo: misingReceiptCount++ ,
                date : myDate,
                flatNo: receiptfromSCR.flatNumber,
                receiptNo: key,
                amount : receiptfromSCR.amount,
                refNumber : receiptfromSCR.referenceNumber,
                source : receiptfromSCR.source,
                type : receiptfromSCR.type
            });

        }
    }

    for (const [key, value] of receipts_system.entries()) {
        const value1 = receipts_system.get(key) ;
     }

    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SPECTRA_MISSING_RECEIPTS);
    await workbook1.xlsx.writeFile(filePath1);
      
}); 