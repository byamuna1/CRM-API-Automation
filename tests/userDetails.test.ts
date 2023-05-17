import {expect , test} from '@playwright/test'
import { apiRequestFlatDetails, createFolder } from '../generic/apiRequest';
import { apiRequestCollectionLogDetails } from '../generic/apiRequest';
import { HEADERS, RESPONSE, EXCELS, PATH , EXCELJS} from '../constants';
let applicant_1:  any ={};
let applicant_2 : any = {};
let j ,count = 1 ,flatNumber;

test ("UserMissingData Details" , async () => {
     const ExcelJS = require(EXCELJS);
     const workbook = new ExcelJS.Workbook();
     const sheet = workbook.addWorksheet(EXCELS.FLAT_USERS_DETAILS);
     sheet.columns = [
         { header: HEADERS.SNO, key: 'sNo' },
         { header: HEADERS.FLATNO, key: 'flatNo' },
         {header : 'Total SaleConsideration' , key : 'grossAmount'},
         { header: HEADERS.CONTACTNUMBER1, key: 'ContactNo1' },
         { header: HEADERS.CONTACTNUMBER2, key: 'ContactNo2' },
         { header: HEADERS.EMAIL1, key: 'email1' },
         { header: HEADERS.EMAIL2, key: 'email2' }
     ];
     const res = await apiRequestFlatDetails();
    
     for(let i=0; i< res.data.length ; i++)
     {
          let flatID  = res.data[i][RESPONSE.ID] ;
          const collectionLog_response = await apiRequestCollectionLogDetails(flatID);
          const result =  collectionLog_response;
          const len  = result[RESPONSE.APPLICANTS].length? result[RESPONSE.APPLICANTS].length :0;
          const total = result['saleParticulars']['grossAmount']
         for( j =0 ; j<len ; j++)
         {
          flatNumber = result[RESPONSE.FLATNUMBER]
         
             if(j == 0)
             {
                  applicant_1 = {
                    applicant1: result[RESPONSE.APPLICANTS][j][RESPONSE.FIRSTNAME] + result[RESPONSE.APPLICANTS][j][RESPONSE.LASTNAME]  ,
                    ContactNo1: result[RESPONSE.APPLICANTS][j][RESPONSE.CONTACTNUMBER] ?result[RESPONSE.APPLICANTS][j][RESPONSE.CONTACTNUMBER]:null,
                    Email1: result[RESPONSE.APPLICANTS][j][RESPONSE.EMAIL] ?result[RESPONSE.APPLICANTS][j][RESPONSE.EMAIL]:null
                 }
             }
             else 
             {
                  applicant_2 = {
                         applicant2: result[RESPONSE.APPLICANTS][j][RESPONSE.FIRSTNAME] + result[RESPONSE.APPLICANTS][j][RESPONSE.LASTNAME]  ,
                         ContactNo2: result[RESPONSE.APPLICANTS][j][RESPONSE.CONTACTNUMBER] ?result[RESPONSE.APPLICANTS][j][RESPONSE.CONTACTNUMBER]:null,
                         Email2: result[RESPONSE.APPLICANTS][j][RESPONSE.EMAIL] ?result[RESPONSE.APPLICANTS][j][RESPONSE.EMAIL]:null
                 }
             }
         }
         
         if(   !applicant_1.ContactNo1 || !applicant_1.Email1 || (j==3 &&( !applicant_2.ContactNo2  || !applicant_2.Email2)) )  {
          sheet.addRow({
               sNo: count++,
               flatNo: flatNumber,
               grossAmount : total,
               ContactNo1: applicant_1.ContactNo1,
               ContactNo2: applicant_2.ContactNo2,
               email1: applicant_1.Email1,
               email2: applicant_2.Email2,
           });
        }

             applicant_1 ={}
             applicant_2 = {}
      }
      await createFolder();
    const path = require(PATH);
    const filePath = path.join(__dirname, EXCELS.USERDETAILS_EXCEL);
    await workbook.xlsx.writeFile(filePath);
   

}); 