import {expect , test} from '@playwright/test'
import {apiRequestFlatCostSheetDetails, apiRequestFlatDetails}  from '../generic/apiRequest'
import { EXCELS, HEADERS,RESPONSE ,PATH, EXCELJS} from '../constants';

test ("Flat deatils" , async () => {
    const ExcelJS = require(EXCELJS);
    const res = await apiRequestFlatDetails();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('result_data.xlsx');
    sheet.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' }
    ];
    let count =0;
    console.log(res.data.length)
    for(let i=0; i<res.data.length ; i++)
    {
        let flatID : string = res.data[i][RESPONSE.ID] ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        let flag = result.data.saleParticulars.otherParticulars ? 1 : 0;
        if(flag == 0)
        {
            sheet.addRow({
                sNo: count++,
                flatNo: result.data[RESPONSE.FLATNUMBER]
            });
        }
        flag = 0
    }
    const path = require(PATH);
    const filePath = path.join(__dirname,'excelDownloads/costsheet-missing-data.xlsx');
    await workbook.xlsx.writeFile(filePath);

}); 