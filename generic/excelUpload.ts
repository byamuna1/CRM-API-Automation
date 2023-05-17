   
 export const excel = (  async (sheet) =>{
    sheet.columns = [
         { header: 'SNo', key: 'sNo' },
         { header: 'Flat No', key: 'flatNo' },
         { header: 'Applicant1', key: 'applicant1' },
         { header: 'ContactNumber1', key: 'ContactNo123' },
         { header: 'Email1', key: 'email1' },
         { header: 'Applicant2', key: 'applicant2' },
         { header: 'ContactNumber2', key: 'ContactNo2' },
         { header: 'Email2', key: 'email2' }
     ];
     return sheet.columns ;
}) ;

export const excel_header = (async ( sheet ,applicant_1 :any , applicant_2 : any) => {
     console.log('in excel upload')
     sheet.addRow({
        sNo: 1,
        flatNo: 'flatNumber',
        applicant1: applicant_1.applicant1,
        ContactNo1: applicant_1.ContactNo1,
        email1: applicant_1.Email1,
        applicant2: applicant_2.applicant2,
        ContactNo2: applicant_2.ContactNo2,
        email2: applicant_2.Email2,
    });
    return sheet ;

})

