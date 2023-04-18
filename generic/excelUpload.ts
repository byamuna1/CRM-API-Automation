     const ExcelJS = require('exceljs');
     const workbook = new ExcelJS.Workbook();
     const sheet = workbook.addWorksheet('result_data.xlsx');
     sheet.columns = [
         { header: 'SNo', key: 'sNo' },
         { header: 'Flat No', key: 'flatNo' },
         { header: 'Applicant1', key: 'applicant1' },
         { header: 'ContactNumber1', key: 'ContactNo1' },
         { header: 'Email1', key: 'email1' },
         { header: 'Applicant2', key: 'applicant2' },
         { header: 'ContactNumber2', key: 'ContactNo2' },
         { header: 'Email2', key: 'email2' }
     ];

export const excel_upload = (async (count,flatNumber:string ,applicant_1 :any , applicant_2 : any) => {
     console.log('in excel upload')
     sheet.addRow({
        sNo: count,
        flatNo: flatNumber,
        applicant1: applicant_1.applicant1,
        ContactNo1: applicant_1.ContactNo1,
        email1: applicant_1.Email1,
        applicant2: applicant_2.applicant2,
        ContactNo2: applicant_2.ContactNo2,
        email2: applicant_2.Email2,
    });
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'spectra-Missing-Data.xlsx');
    await workbook.xlsx.writeFile(filePath);
    
})

export const save_upload = (async() => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'spectra-Missing-Data.xlsx');
    await workbook.xlsx.writeFile(filePath);
})
