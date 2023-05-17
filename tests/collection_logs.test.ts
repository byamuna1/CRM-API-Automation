import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, createFolder } from '../generic/apiRequest';
import { EXCELS } from '../constants';
import { EXCELJS } from '../constants';
import { HEADERS } from '../constants';
import { PATH } from '../constants';
import { MAIN } from '../meta';
let receiptDetails : any = {};
let missingCount = 1;
let misingReceiptCount = 1;
let mismatchReceiptCount =1 ;
let receipt_scr = new Map<any,any>() ; 
let receipts_system = new Map<any,any>() ; 

test ("ReceiptLogs Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(MAIN.SCR_EXCEL);
    const worksheet = workbook.getWorksheet('Coll Log');

    const workbook1 = new ExcelJS.Workbook();
    const mismatchData = workbook1.addWorksheet(EXCELS.MISMATCH_RECEIPTS);
    const noReceiptNo = workbook1.addWorksheet('No-receiptNo');
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
        if(response[i]['receiptNumber'] == null || response[i]['referenceNumber'] == 'LUMPSUM' || response[i]['amountType'] == 'CANCELLED')
        {
           noReceiptNo.addRow({
                sNo : missingCount++ ,
                receiptNo : response[i]['receiptNumber'],
                flatNo : response[i]['flatNumber'],
                amount : response[i]['amount'],
                referenceNo : response[i]['referenceNumber'],
                paymenttype : response[i]['amountType']

           });
        }
        else
        {
            receipts_system.set(String(parseInt(response[i]['receiptNumber'])),{'flatNumber': response[i]['flatNumber'], 'amount' : response[i]['amount'] , 'referenceNumber' : response[i]['referenceNumber']})
           
        }
        
    }

    for(let i = 6;i<5000;i++)
    {
        const row = worksheet.getRow(i) ;
        receiptDetails ={
            sNO : row.getCell(1).value?.result??row.getCell(1).value,
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
            receipt_scr.set(String(receiptDetails.receiptNo),{'sNo':receiptDetails.sNO , 'flatNumber' : receiptDetails.flatNumber , 'customerName' : receiptDetails.customerName , 'source': receiptDetails.source, 'type' : receiptDetails.type , 'amount' : receiptDetails.amount , 'referenceNumber' : receiptDetails.referenceNumber})
        }
        receiptDetails ={}
    }
    
    let receiptfromSystem, receiptfromSCR ;
    for (const [key, value] of receipt_scr.entries()) {
        if(receipts_system.has(key))
        {
           receiptfromSystem = receipts_system.get(key) ;
           receiptfromSCR = value ;

            if(receiptfromSystem.flatNumber !=receiptfromSCR.flatNumber || Math.abs(receiptfromSystem.amount - receiptfromSCR.amount) > 10 || receiptfromSystem.referenceNumber != receiptfromSCR.referenceNumber )
            {
                mismatchData.addRow({
                    sNo : mismatchReceiptCount++,
                    receiptNo : key,
                    flatNo : receiptfromSCR.flatNumber,
                    flatNo_system : receiptfromSystem.flatNumber,
                    receiptAmountSystem : receiptfromSystem.amount,
                    amount : receiptfromSCR.amount,
                    referenceNumber : receiptfromSCR.referenceNumber,
                    referenceNumberFromSystem : receiptfromSystem.referenceNumber
                });
            }
        }
        else
        {
            receiptfromSystem = value
            missingData.addRow({
                sNo: misingReceiptCount++ ,
                flatNo: receiptfromSystem.flatNumber,
                receiptNo: key,
                amount : receiptfromSystem.amount,
                refNumber : receiptfromSystem.referenceNumber,
            });

        }
    }
    for (const [key, value] of receipts_system.entries()) {
        const value1 = receipts_system.get(key) ;
     }

    await createFolder();
    // const path = require(PATH);
    // const filePath1 = path.join(__dirname, EXCELS.SPECTRA_MISSING_RECEIPTS);
    // await workbook1.xlsx.writeFile(filePath1);
      
}); 