import {expect , test} from '@playwright/test'
import { apiRequestFlatDetails } from '../generic/apiRequest';
import { apiRequestCollectionLogDetails } from '../generic/apiRequest';
import { HEADERS } from '../constants';
import { RESPONSE } from '../constants';
import { EXCELS } from '../constants';
import { PATH } from '../constants';
import { EXCELJS } from '../constants';
let applicant_1:  any ={};
let applicant_2 : any = {};
let j ;

test ("UserMissingFlats Details" , async () => {
     const ExcelJS = require(EXCELJS);
     const workbook = new ExcelJS.Workbook();
     const sheet = workbook.addWorksheet(EXCELS.FLAT_USERS_DETAILS);
     sheet.columns = [
         { header: HEADERS.SNO, key: 'sNo' },
         { header: HEADERS.FLATNO, key: 'flatNo' },
         { header: HEADERS.APPLICANT1, key: 'applicant1' },
         { header: HEADERS.CONTACTNUMBER1, key: 'ContactNo1' },
         { header: HEADERS.EMAIL1, key: 'email1' },
         { header: HEADERS.APPLICANT2, key: 'applicant2' },
         { header: HEADERS.CONTACTNUMBER2, key: 'ContactNo2' },
         { header: HEADERS.EMAIL2, key: 'email2' }
     ];
     const res = await apiRequestFlatDetails();
     console.log('started Validation')
     let count = 1 ;
     let flatNumber;
     for(let i=0; i< res.data.length ; i++)
     {
          let flatID  = res.data[i][RESPONSE.ID] ;
          const collectionLog_response = await apiRequestCollectionLogDetails(flatID);
          const result =  collectionLog_response;
          const len  = result[RESPONSE.APPLICANTS].length? result[RESPONSE.APPLICANTS].length :0;
         for( j =0 ; j<len ; j++)
         {
          flatNumber = result[RESPONSE.FLATNUMBER]
          //console.log(flatNumber) ;
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
         
         if((applicant_1.applicant1 == RESPONSE.NA || !applicant_1.applicant1 ||  !applicant_1.ContactNo1  ||  !applicant_1.Email1)  || (len == 2 && (applicant_2.applicant2 == RESPONSE.NA || !applicant_2.applicant2 || !applicant_2.ContactNo2 || !applicant_2.Email2))){
          sheet.addRow({
               sNo: count++,
               flatNo: flatNumber,
               applicant1: applicant_1.applicant1,
               ContactNo1: applicant_1.ContactNo1,
               email1: applicant_1.Email1,
               applicant2: applicant_2.applicant2,
               ContactNo2: applicant_2.ContactNo2,
               email2: applicant_2.Email2,
           });
         }
             //excel_upload(count++ , flatNumber,applicant_1, applicant_2)
             applicant_1 ={}
             applicant_2 = {}
      }

     const path = require(PATH);
     const filePath = path.join(__dirname, EXCELS.SPECTRA_MISSING_DATA);
     await workbook.xlsx.writeFile(filePath);
      console.log('Ended Validation')

}); 