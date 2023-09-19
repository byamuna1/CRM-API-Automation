import {expect , test} from '@playwright/test'
import { apiRequestReceiptLogs, apiRequestmcd, createFolder } from '../generic/apiRequest_spectra';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH , } from '../constants';
import {  SPECTRA, SPIRE } from '../meta';
const fs = require('fs')
let mcdDetails : any = {};
let count_system = 1;
let misingReceiptCount = 1;
let mismatchmcdCount = 1 ;
let mcd_scr = new Map<any,any>() ; 
let mcd_system = new Map<any,any>() ; 

test ("spectra mcd Details" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPECTRA.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.MCD);

    let workbook1 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.MISMATCH_MCD);
    if(fs.existsSync(filePath1))
    {
        await workbook1.xlsx.readFile(filePath1);
    }
    const mismatchData = workbook1.addWorksheet(EXCELS.SPECTRA);
    
    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.AMOUNT , key : 'amount'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ]

    const rowcount = worksheet.rowCount;  
    const response = await apiRequestmcd()
    
    for(let i =0; i< response.length;i++)
    {
        mcd_system.set(String((response[i].flatNo)),{'sNo':count_system++ ,'flatNumber' : response[i].flatNo , 'corpus_amount' : response[i].corpus.gross , 'maintaince_amount': response[i].maintenance.gross, 'movein_amount' :  response[i].moveIn.gross , 'corpus_collected' :  response[i].corpus.collected , 'maintaince_collected' :  response[i].maintenance.collected, 'movein_collected' :  response[i].moveIn.collected})
    }

    //console.log(mcd_system)
    for(let i = 6;i<20;i++)
    {
        const row = worksheet.getRow(i) ;
        mcdDetails ={
            sNO : row.getCell(1).value?.result??row.getCell(1).value,
            flatNumber : row.getCell(2).value?.result??row.getCell(2).value,
            status : row.getCell(5).value?.result??row.getCell(5).value,
            corpus_amount : row.getCell(8).value?.result??row.getCell(8).value,
            maintaince_amount : row.getCell(11).value?.result??row.getCell(11).value,
            movein_amount : row.getCell(12).value?.result??row.getCell(12).value,
            total:row.getCell(13).value?.result??row.getCell(13).value,
            corpus_collected : row.getCell(16).value?.result??row.getCell(16).value,
            maintaince_collected : row.getCell(18).value?.result??row.getCell(18).value,
            movein_collected : row.getCell(20).value?.result??row.getCell(20).value
        }

        if(mcdDetails.status == 'Booked')
        {
            mcd_scr.set(String((mcdDetails.flatNumber)),{'sNo':mcdDetails.sNO ,'flatNumber' : mcdDetails.flatNumber , 'corpus_amount' : mcdDetails.corpus_amount , 'maintaince_amount': mcdDetails.maintaince_amount, 'movein_amount' : mcdDetails.movein_amount , 'corpus_collected' : mcdDetails.corpus_collected , 'maintaince_collected' : mcdDetails.maintaince_collected, 'movein_collected' : mcdDetails.movein_collected, 'total' : mcdDetails.total})
        }
        console.log(mcdDetails)
        mcdDetails ={}
    }
    
    let mcdfromSystem, mcdfromSCR ;
    for (const [key, value] of mcd_scr.entries()) {
        mcdfromSCR = value
        let mcd_types = {
            corpusAmountfromscr : null ,
            corpusAmountfromSystem : null ,
            moveinfromscr : null ,
            moveinfromSystem : null , 
            maintaincefromScr : null ,
            maintaincefromSystem : null
        }

         let flag = 0;
        
        if(mcd_system.has(key))
        {
           mcdfromSystem = mcd_system.get(key) ;
           if(mcdfromSystem.corpus_amount != mcdfromSCR.corpus_amount)
            {
                flag = 1;
                mcd_types.corpusAmountfromscr = mcdfromSCR.corpus_amount ;
                mcd_types.corpusAmountfromSystem = mcdfromSystem.corpus_amount ;
                mismatchData.addRow({
                    sNo : mismatchmcdCount++ ,
                    flatNo :key,
                    Issue : 'mismatch-corpus amount',
                    scr :  mcd_types.corpusAmountfromscr,
                    system: mcd_types.corpusAmountfromSystem,
               });
            }
            if(mcdfromSystem.maintaince_amount != mcdfromSCR.maintaince_amount)
            {
                flag = 1;
                mcd_types.maintaincefromScr = mcdfromSCR.maintaince_amount ;
                mcd_types.maintaincefromSystem = mcdfromSystem.maintaince_amount ;
                mismatchData.addRow({
                    sNo : mismatchmcdCount++ ,
                    flatNo :key,
                    Issue : 'mismatch-maintaince amount',
                    scr :  mcd_types.maintaincefromScr,
                    system: mcd_types.maintaincefromSystem,
               });
            }
            if(mcdfromSystem.movein_amount != mcdfromSCR.movein_amount)
            {
                flag = 1;
                mcd_types.moveinfromscr = mcdfromSCR.movein_amount ;
                mcd_types.moveinfromSystem = mcdfromSystem.movein_amount ;
                mismatchData.addRow({
                    sNo : mismatchmcdCount++ ,
                    flatNo :key,
                    Issue : 'mismatch-movein amount',
                    scr :  mcd_types.moveinfromscr,
                    system: mcd_types.moveinfromSystem,
               });
            }
        }
        // else if(receiptfromSCR.flatNumber !=null)
        // {
        //     mismatchData.addRow({
        //         sNo : missingCount++ ,
        //         flatNo :receiptfromSCR.flatNumber,
        //         receiptNo : key,
        //         Issue : 'Missing-Receipt',
        //         scr : 'present',
        //         system: 'missing',
        //         amount : receiptfromSCR.amount
        //    });
        // }
    }

    await workbook1.xlsx.writeFile(filePath1);
      
}); 