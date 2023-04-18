import {expect , test} from '@playwright/test'
import {apiRequestFlatCostSheetDetails, apiRequestFlatDetails}  from '../generic/apiRequest'
import { EXCELS, HEADERS,RESPONSE ,PATH, EXCELJS} from '../constants';

test ("Flat deatils" , async () => {
    const ExcelJS = require(EXCELJS);
    const res = await apiRequestFlatDetails();
    //const ress = await res.json();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('result_data.xlsx');
    sheet.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
        // { header: HEADERS.APPLICANT1, key: 'applicant1' },
        // { header: HEADERS.CONTACTNUMBER1, key: 'ContactNo1' },
        // { header: HEADERS.EMAIL1, key: 'email1' },
        // { header: HEADERS.APPLICANT2, key: 'applicant2' },
        // { header: HEADERS.CONTACTNUMBER2, key: 'ContactNo2' },
        // { header: HEADERS.EMAIL2, key: 'email2' }
    ];
    let applicant_1:  any ={};
    let applicant_2 : any = {};
    let j ,count =0;
    console.log(res.data.length)
    for(let i=0; i<res.data.length ; i++)
    {
        let flatID : string = res.data[i][RESPONSE.ID] ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        //const result = await response.json();
        console.log(i)
        let flag = result.data.saleParticulars.otherParticulars ? 1 : 0;
        if(flag == 0)
        {
            sheet.addRow({
                                sNo: count++,
                                flatNo: result.data['flatNumber']
                            });
        }
        flag = 0
       // console.log(result.data.flat['appli'])
        // for( j =0 ; j<len ; j++)
        // {
        //     if(j == 0)
        //     {
        //          applicant_1 = {
        //                 applicant1: result.data.flat['applicants'][j]['firstName'] + result.data.flat['applicants'][j]['lastName'] ,
        //                 ContactNo1: result.data.flat['applicants'][j]['contactNumber'] ,
        //                 Email1: result.data.flat['applicants'][j]['email'] 
        //         }
        //     }
        //     else 
        //     {
        //          applicant_2 = {
        //                 applicant2: result.data.flat['applicants'][j]['firstName'] + result.data.flat['applicants'][j]['lastName'] ,
        //                 ContactNo2: result.data.flat['applicants'][j]['contactNumber'] ,
        //                 Email2: result.data.flat['applicants'][j]['email'] 
        //         }
        //     }
        // }
        
        // if((applicant_1.applicant1 == RESPONSE.NA || !applicant_1.applicant1 ||  !applicant_1.ContactNo1  ||  !applicant_1.Email1)  || (j==1 && (applicant_2.applicant2 == RESPONSE.NA|| !applicant_2.applicant2 || !applicant_2.ContactNo2 || !applicant_2.Email2)))
        //     sheet.addRow({
        //                 sNo: i + 1,
        //                 flatNo: result.data.flat[RESPONSE.FLATNUMBER],
        //                 applicant1: applicant_1.applicant1,
        //                 ContactNo1: applicant_1.ContactNo1,
        //                 email1: applicant_1.Email1,
        //                 applicant2: applicant_2.applicant2,
        //                 ContactNo2: applicant_2.ContactNo2,
        //                 email2: applicant_2.Email2,
        //             });
        //     applicant_1 ={}
        //     applicant_2 = {}
            //j=0;
    }

    const path = require(PATH);
    const filePath = path.join(__dirname,'excelDownloads/costsheet-missing-data.xlsx');
    await workbook.xlsx.writeFile(filePath);

}); 