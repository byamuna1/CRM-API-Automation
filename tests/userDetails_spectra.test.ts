// import {expect , test} from '@playwright/test'
// import { apiRequestCollectionLogDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest_spectra';
// import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH } from '../constants';
// import { SPECTRA } from '../meta';
// let costSheetDetailsForomScr : any = {};
// let missingCount = 1 , mismatchCount = 1, costflag =1;
// let users_data = new Map<any,any>()

// test ("spectra userDetails" , async () => {
//     const ExcelJS = require(EXCELJS);
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(SPECTRA.SCR_EXCEL);
//     const worksheet = workbook.getWorksheet(SHEETS.MASTER_DATA);

//     const workbook1 = new ExcelJS.Workbook();
//     const mismatchData = workbook1.addWorksheet(EXCELS.MISSING_USERDETAILS);
    
//     mismatchData.columns = [
//         { header : HEADERS.SNO , key : 'sNo'},
//         { header : HEADERS.FLATNO , key : 'flatNo'},
//         { header : HEADERS.USER_MISSINGDATA , key : 'users_data'},
//     ]
    
//     const response = await apiRequestFlatDetails();
//     for(let index=0; index<response.data.length; index++)
//     {
//         const flatID = response.data[index]['_id'];
//         const userdata_response = await apiRequestCollectionLogDetails(flatID);
//         console.log(userdata_response['applicants'].length)
//         for(let j = 0 ; j < userdata_response['applicants'].length ; j++)
//         {
            
//         }
//     }


        
    

      
// }); 