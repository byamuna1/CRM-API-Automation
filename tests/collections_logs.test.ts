import {expect , test} from '@playwright/test'
import { apiRequestSaleParticulars } from '../generic/apiRequest';
import { EXCELS } from '../constants';
import { EXCELJS } from '../constants';
import { HEADERS } from '../constants';
import { RESPONSE } from '../constants';
import { PATH } from '../constants';
let flatDetails : any = {};
const promises :any =[] ;
let count = 1;
let count1 = 1;

test ("ReceiptLogs Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCELS.SPECTRASCRRECEIPTLOGS);
    const worksheet = workbook.getWorksheet('collection-logs');
    const workbook1 = new ExcelJS.Workbook();
    const sheet = workbook1.addWorksheet(EXCELS.SALEPARTICULARS);

    const workbook2 = new ExcelJS.Workbook();
    const sheet1 = workbook2.addWorksheet(EXCELS.MISSINGFLATS);

    sheet.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
    ];
    
    sheet1.columns = [
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
    //console.log(rowcount)
    for(let i=2;i<rowcount;i++)
    {
        const row = worksheet.getRow(i) ;
        flatDetails = {
            sNo : row.getCell(1).value,
            flatNumber : row.getCell(2).value ,
            totalAmount :row.getCell(3).value ,
            accruedAmount : row.getCell(4).value ,
            collectedAmount : row.getCell(5).value ,
            receivableAmount : row.getCell(6).value
        }
        let totalAmtExl= null,accuredAmtExl= null , collectedAmtExl =null , recAmtExl= null , totalAmtSys=null ,accuredAmtSys =null  , collectedASys =null , recAmtSys =null;
        const response = await apiRequestSaleParticulars(flatDetails.flatNumber);

        if(response.length == 0){
            sheet.addRow({
                sNo: count++,
                flatNo: flatDetails.flatNumber,
            });
        }
        else{
            if(flatDetails.totalAmount != response[0][RESPONSE.TOTALAMOUNT] )
            {
                totalAmtExl =  flatDetails.totalAmount ;
                totalAmtSys =  response[0][RESPONSE.TOTALAMOUNT] ;
            }
            if(flatDetails.accruedAmount != response[0][RESPONSE.ACCRUEDAMOUNT])
            {
                accuredAmtExl = flatDetails.accruedAmount
                accuredAmtSys = response[0][RESPONSE.ACCRUEDAMOUNT]
            }
            if(flatDetails.collectedAmount != response[0][RESPONSE.COLLECTEDAMOUNT])
            {
                collectedAmtExl = flatDetails.collectedAmount
                collectedASys = response[0][RESPONSE.COLLECTEDAMOUNT]
            }
            if(flatDetails.receivableAmount != response[0][RESPONSE.RECEIVABLEAMOUNT])
            {
                recAmtExl = flatDetails.receivableAmount
                recAmtSys = response[0][RESPONSE.RECEIVABLEAMOUNT]
            }
      }
        sheet1.addRow({
                sNo: count1++,
                flatNo: flatDetails.flatNumber,
                toatlAmountExcel: totalAmtExl,
                toatlAmountSystem :totalAmtSys ,
                accuredAmountExcel : accuredAmtExl,
                accuredAmountSystem :accuredAmtSys ,
                collectedAmountExcel : collectedAmtExl,
                collectedAmountSystem : collectedASys ,
                receivableAmountExcel: recAmtExl,
                receivableAmountSystem: recAmtSys,

            });
             console.log(i)
            // console.log(response)
    }

    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SPECTRAMISSINGFLATS);
    const filePath2 = path.join(__dirname, EXCELS.SPECTRAFLATSALEPARTUCULARSMISMATCH);
    await workbook1.xlsx.writeFile(filePath1);
    await workbook2.xlsx.writeFile(filePath2)
}); 