import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, apiRequestSaleParticulars, createFolder } from '../generic/apiRequest';
import { EXCELS } from '../constants';
import { EXCELJS } from '../constants';
import { HEADERS } from '../constants';
import { RESPONSE } from '../constants';
import { PATH } from '../constants';
let flatDetails : any = {};
const promises :any =[] ;
let count = 1;
let count1 = 1, flag = 1;

test ("ReceiptLogs Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCELS.SPECTRA_SCR_RECEIPTLOGS);
    const worksheet = workbook.getWorksheet('receipt-logs');

    const workbook1 = new ExcelJS.Workbook();
    const sheet = workbook1.addWorksheet(EXCELS.MISMATCH_RECEIPTS);
    
    const workbook2 = new ExcelJS.Workbook();
    const sheet1 = workbook2.addWorksheet(EXCELS.MISSING_RECEIPTS);
    
    sheet.columns = [
        { headers : HEADERS.SNO , key : 'sNo'},
        { headers : HEADERS.RECEIPTNUMBER , key : 'receiptNo'},
        { headers : HEADERS.FLATNO , key : 'flatNo'},
        { header: HEADERS.RECEIPTAMOUNT, key: 'amount' },
    ]
    sheet1.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
        { header: HEADERS.RECEIPTNUMBER, key: 'receiptNo' },
        { header: HEADERS.RECEIPTAMOUNT, key: 'amount' },
        { header: HEADERS.RECEIPTREFERENCENO, key: 'refNumber'},
        { header: HEADERS.RECEIPTSOURCE, key: 'source' },
        { header: HEADERS.RECEIPTTYPE, key: 'type' },
    ];

    const rowcount = worksheet.rowCount;    
    for(let i=2;i<10;i++)
    {
        const row = worksheet.getRow(i) ;
        flatDetails = {
            sNo : row.getCell(1).value,
            date : row.getCell(2).value ,
            receiptNo :row.getCell(3).value ,
            flatNumber : row.getCell(4).value ,
            customerName : row.getCell(5).value ,
            milestones : row.getCell(6).value,
            source : row.getCell(7).value,
            type : row.getCell(8).value,
            refNo : row.getCell(9).value,
            amount : row.getCell(10).value
        }
        let receiptAmtExl= null , receiptAmtSys=null;
        const response = await apiRequestReceiptLogs(flatDetails.receiptNo);

        if(response.length == 0){
            sheet.addRow({
                sNo: count++,
                receiptno : flatDetails.receiptNo,
                flatNo: flatDetails.flatNumber,
                amount: flatDetails.amount
            });
        }
        else{
            if(flatDetails.amount != response[0][RESPONSE.RECEIPT_AMOUNT] )
            {
                receiptAmtExl =  flatDetails.amount ;
                receiptAmtSys =  response[0][RESPONSE.RECEIPT_AMOUNT];
                flag = 0;
            }
      }
      if(flag == 0)
      {
        sheet1.addRow({
                sNo: count1++,
                flatNo: flatDetails.flatNumber,
                receiptNo: flatDetails.receiptNo,
                amount : flatDetails.amount ,
                refNumber : flatDetails.refNo,
                source : flatDetails.source ,
                type : flatDetails.type,
            });
        }
             console.log(i)
    }
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SPECTRA_MISSING_RECEIPTS);
    const filePath2 = path.join(__dirname, EXCELS.SPECTRA_MISMATCH_RECEIPTS);
    await workbook1.xlsx.writeFile(filePath1);
    await workbook2.xlsx.writeFile(filePath2);
      
}); 