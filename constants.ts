const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newdate = year + "-" + month + "-" + day;

export const HEADERS = {
    PAYMENTTYPE : 'PAYMENT TYPE',
    SNO : 'SNO' ,
    FLATNO : 'FLatNO' ,
    FLATNO_SYSTEM : 'FlatNo System',
    APPLICANT1 : 'APPLICANT1',
    CONTACTNUMBER1 : 'CONTACTNUMBER1',
    EMAIL1 : 'EMAIL1',
    APPLICANT2 : 'APPLICANT2',
    CONTACTNUMBER2 : 'CONTACTNUMBER2' ,
    EMAIL2 : 'EMAIL2',
    BASIC_RATE : 'Basic Rate',
    BASIC_COST : 'Basic Cost',
    FLOOR_RISE : 'Floor Rise',
    CORNER_PREMIUM : 'Corner Premium' ,
    INFRASTRUCTURE : 'Infrastructure',
    F_A : 'F and A',
    CAR_PArking : ' Car Parking',
    DOCUMENTATION : 'Documentation',
    BASIC_RATE_SYSTEM : 'Basic Rate System',
    BASIC_COST_SYSTEM : 'Basic Cost System',
    FLOOR_RISE_SYSTEM: 'Floor Rise System',
    CORNER_PREMIUM_SYSTEM : 'Corner Premium System' ,
    INFRASTRUCTURE_SYSTEM : 'Infrastructure System',
    F_A_SYSTEM : 'F and A System',
    CAR_PArking_SYSTEM : ' Car Parking System',
    DOCUMENTATION_SYSTEM : 'Documentation System',
    TOTAL : 'Total' ,
    GST : 'GST' ,
    GROSSAMOUNT : 'Gross Amount',
    TOTAL_SYSTEM : 'Total from system' ,
    GST_SYSTEM : 'GST from system' ,
    GROSSAMOUNT_SYSTEM : 'Gross Amount from system',

    TOTALAMOUNTFROMEXCEL : 'TotalAmountFromExcel',
    TOTALAMOUNTFROMSYSTEM : 'TotalAmountFromSYSTEM',
    ACCUREDAMOUNTFROMEXCEL : 'AccuredAmountFromExcel',
    ACCUREDAMOUNTFROMSYSTEM : 'AccuredAmountFromSystem',
    COLLECTEDAMOUNTFROMEXCEL : 'CollectedAmountFromExcel',
    COLLECTEDAMOUNTFROMSYSTEM : 'CollectedAmountFromSystem',
    RECEIVABLEAMOUNTFROMEXCEL : 'ReceivableAmountFromExcel',
    RECEIVABLEAMOUNTFROMSYSTEM : 'ReceivableAmountFromSystem',

    RECEIPTNUMBER : 'RECEIPTNO',
    RECEIPTNUMBER_SYSTEM : 'RECEIPT NO SYSTEM',
    RECEIPTAMOUNT : 'AMOUNT',
    RECEIPTAMOUNT_SYSTEM : 'RECEIPT AMOUNT SYSTEM',
    RECEIPTREFERENCENO : 'REFERENCENO',
    REFERENCE_NUM_SYSTEM : 'REFERENCE NO SYSTEM',
    RECEIPTSOURCE : 'SOURCE',
    RECEIPTTYPE : 'TYPE'
}

export const RESPONSE = {
    FLATNUMBER : 'flatNumber',
    APPLICANTS : 'applicants',
    FIRSTNAME : 'firstName' ,
    LASTNAME : 'lastName' ,
    CONTACTNUMBER : 'contactNumber',
    EMAIL : 'email',
    NA : 'NA' ,
    ID : '_id',
    TOTALAMOUNT : 'totalAmount',
    ACCRUEDAMOUNT : 'accruedAmount',
    COLLECTEDAMOUNT : 'collectedAmount',
    RECEIVABLEAMOUNT : 'receivableAmount',
    RECEIPT_AMOUNT : 'amount',
}

export const PATH = 'path'
export const EXCELJS = 'exceljs'

export const EXCELS = {
    SCR_SPECTRA_FLAT_SALEPARTICULARS : 'SPECTRA - Receivable Logs as on 14_4_2023.xlsx',
    SPRINGS_SCR_EXCEL : `SCR - ASBL Springs as on 25-04-2023.xlsx`,
    USERDETAILS_EXCEL : `excelDownloads/${newdate}/springs-userdetails.xlsx`,
    SCREXCELSHEET:'',
    FLAT_USERS_DETAILS : 'user-details.xlsx' ,
    MISSING_FLATS : 'missing-flats.xlsx',
    SALE_PARTICULARS : 'Flat-sale-particulars.xlsx',
    MISSING_RECEIPTS : 'missing-receipts' ,
    MISMATCH_RECEIPTS : 'mismatch-receipts',
    SPECTRA_MISSING_DATA : 'excelDownloads/spectra-Missing-Data.xlsx',
    SPIRE_MISSING_DATA : 'excelDownloads/spire-Missing-Data.xlsx',
    SPRINGS_MISSING_DATA : 'excelDownloads/springs-Missing-Data.xlsx',

    SPIRE_MISSING_FLATS : 'excelDownloads/spire-flats-Missing-Data.xlsx',
    SPRINGS_MISSING_FLATS : 'excelDownloads/springs-flats-Missing-Data.xlsx',
    SPECTRA_MISSING_FLATS : 'excelDownloads/spectra-flats-Missing-Data.xlsx',

    SPIREFLATSALEPARTUCULARSMISMATCH : `excelDownloads/spire-flatSaleParticulars-Mismatching-Data.xlsx`,
    SPRINGSFLATSALEPARTUCULARSMISMATCH : 'excelDownloads/springs-flatSaleParticulars-Mismatching-Data.xlsx',
    SPECTRAFLATSALEPARTUCULARSMISMATCH : 'excelDownloads/spectra-flatSaleParticulars-Mismatching-Data.xlsx',

    SPECTRAUSERSMISSINGDETAILS : 'excelsDownloads/spectraUsersMissingData.xlsx',
    SPECTRA_SCR_RECEIPTLOGS : 'SCR - ASBL Spectra as on 21-04-2023.xlsx',
    SPRINGS_MISSING_RECEIPTS :  `excelDownloads/${newdate}/springs-mising-receipts.xlsx`,
    SPECTRA_MISSING_RECEIPTS : `excelDownloads/${newdate}/spectra-mising-receipts.xlsx` ,
    SPECTRA_MISMATCH_RECEIPTS : `excelDownloads/${newdate}/spectra-mismtach-receipts.xlsx`,
    SPECTRA_COSTSHEET_EXCEL : `excelDownloads/${newdate}/spectra-costsheet.xlsx`,
    SPRINGS_COSTSHEET_EXCEL : `excelDownloads/${newdate}/springs-costsheet.xlsx`,
    SPIRE_COSTSHEET_EXCEL : `excelDownloads/${newdate}/spire-costsheet.xlsx`
    
}
