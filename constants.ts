const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newdate = year + "-" + month + "-" + day;

export const HEADERS = {
    //costsheet 
    ISSUE : 'ISSUE',
    SCR : 'SCR',
    SYSTEM : 'SYSTEM',
    STATUS : 'STATUS',
    COMMENTS : 'COMMENTS',
    //receiptlogs
    AMOUNT : 'AMOUNT',

    MISSINGCOSTSHEET : 'Csheet output',
    USER_MISSINGDATA : 'User MisisngData',
    PAYMENTTYPE : 'PAYMENT TYPE',
    SNO : 'SNO' ,
    DATE : 'date',
    FLATNO : 'FLat NO' ,
    FLATNO_SYSTEM : 'FlatNo System',
    APPLICANT1 : 'APPLICANT1',
    CONTACTNUMBER1 : 'Phone Number 1',
    EMAIL1 : 'Email ID 1',
    APPLICANT2 : 'APPLICANT2',
    CONTACTNUMBER2 : 'Phone Number 2' ,
    EMAIL2 : 'Email ID 1',
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

    RECEIPTNUMBER : 'RECEIPTNO_SCR',
    RECEIPTNUMBER_SYSTEM : 'RECEIPTNO_SYSTEM',
    RECEIPTAMOUNT : 'AMOUNT_SCR',
    RECEIPTAMOUNT_SYSTEM : 'RECEIPTAMOUNT_SYSTEM',
    RECEIPTREFERENCENO : 'REFERENCENO_SCR',
    REFERENCE_NUM_SYSTEM : 'REFERENCENO_SYSTEM',
    RECEIPTSOURCE : 'SOURCE',
    RECEIPTTYPE : 'TYPE'
}

export const RESPONSE = {
    COSTS : 'costs',
    NAME : 'name',
    TOTAL : 'total',
    BOOKED : 'Booked',
    booked : 'bokked',
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
    RECEIPTNUMBER : 'receiptNumber',
    REFERENCE_NUMBER : 'referenceNumber',
    AMOUNTTYPE : 'amountType',
    ISSUSPENSE : 'isSuspense',
    AMOUNT: 'amount',
}

export const PATH = 'path'
export const EXCELJS = 'exceljs'

export const SHEETS = {
   MASTER_DATA : 'Master Data',
   RECEIVABLELOGS_DATA : 'Rec. St',
   RECEIPTLOGS_DATA : 'Coll Log'
}

export const EXCELS = {
    //costsheeet
    SPIRE : 'SPIRE',
    SPRINGS : 'SPRINGS',
    SPECTRA : 'SPECTRA',
    USERDETAILS_EXCEL : `excelDownloads/${newdate}/spectra-userdetails.xlsx`,
    SPIRE_MISMATCH : 'SPIRE-MISMATCHDATA',
    SPECTRA_MISMATCH : 'SPECTRA-MISMATCHDATA',
    SPRINGS_MISMTACH : 'SPRINGS-MISMATCHDATA',
    FLAT_USERS_DETAILS : 'user-details.xlsx' ,
    MISMATCH_FLATS : 'mismatch-saleparticulars.xlsx',
    MISSING_FLATS : 'missing-flats-inSystem.xlsx',
    MISSING_RECEIPTS : 'missing-receipts' ,
    MISMATCH_RECEIPTS : 'mismatch-receipts',
    MISMATCH_COSTSHEET : 'mismatch costsheets',
    INSYSTEM_NOTINSCR : 'inSystemNotInSCRFlats',
    MISSING_COSTSHEET : 'missing costsheets',
    MISSING_USERDETAILS : 'missing-userdetails',
    SUSPENSE_LUMPSUM_NORECEIPTNO : 'suspense-cancelled-noreceiptno',

    SPIREFLATSALEPARTUCULARSMISMATCH : `excelDownloads/spire-flatSaleParticulars-Mismatching-Data.xlsx`,
    SPRINGSFLATSALEPARTUCULARSMISMATCH : 'excelDownloads/springs-flatSaleParticulars-Mismatching-Data.xlsx',
    SPECTRAFLATSALEPARTUCULARSMISMATCH : 'excelDownloads/spectra-flatSaleParticulars-Mismatching-Data.xlsx',

    SPECTRAUSERSMISSINGDETAILS : 'excelsDownloads/spectraUsersMissingData.xlsx',
    //RECEIPT OUTPUT EXCELS
    SPRINGS_MISSING_RECEIPTS :  `excelDownloads/${newdate}/springs-receiptsLogs.xlsx`,
    SPIRE_MISSING_RECEIPTS : `excelDownloads/${newdate}/spire-receiptsLogs.xlsx`,
    SPECTRA_MISSING_RECEIPTS : `excelDownloads/${newdate}/spectra-receiptsLogs.xlsx` ,

    //Costsheet outpu excels
    SPECTRA_COSTSHEET_EXCEL : `excelDownloads/${newdate}/spectra-costsheet.xlsx`,
    SPRINGS_COSTSHEET_EXCEL : `excelDownloads/${newdate}/springs-costsheet.xlsx`,
    SPIRE_COSTSHEET_EXCEL : `excelDownloads/${newdate}/spire-costsheet.xlsx`,
    SPECTRA_SALEPARTICULARS : `excelDownloads/${newdate}/spectra-saleparticulars.xlsx` ,
    SPIRE_SALEPARTICULARS : `excelDownloads/${newdate}/spire-saleparticulars.xlsx`  ,
    SPRINGS_SALEPARTICULARS : `excelDownloads/${newdate}/springs-saleparticulars.xlsx`,

    COSTSHEET : `excelDownloads/${newdate}/CostSheet.xlsx`,
    LOANDETAILS : `excelDownloads/${newdate}/LoanDetails.xlsx`,
    COLECTION_LOGS : `excelDownloads/${newdate}/CollectionLogs.xlsx`,
    SALE_PARTICULARS : `excelDownloads/${newdate}/SaleParticulars.xlsx`,
    FLAT_MIS_DETAILS : `excelDownloads/${newdate}/Flat-Mis-Details.xlsx`

}
