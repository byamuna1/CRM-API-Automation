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
   RECEIPTLOGS_DATA : 'Coll Log',
   MCD : 'MCD'
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
    FLAT_MIS_DETAILS : `excelDownloads/${newdate}/Flat-Mis-Details.xlsx`,
    MISMATCH_MCD : `excelDownloads/${newdate}/mcd-data.xlsx`,

}

export const BANK = {
    AXIS : 'axis',
    BHFL : 'bhfl',
    HDFC : 'hdfc',
    BOB : 'bob',
    ICICI : 'icici',
    KOTAK : 'kotak',
    LICHFL : 'lichfl',
    SBI : 'sbi',
    AIR_FORCE : 'air force',
    ONGC : 'ongc',
    TCHFL : 'tchfl'
}

export const BHFL = {
    POC_NAME : 'Pavan Paladhi',
    POC_CONTACT : '+919133469900',
    POC_EMAIL : 'pavankumar.paladhi@bajajfinserv.in'
}
export const BHFL_HARISH = {
    POC_NAME : 'Harish',
    POC_CONTACT : '+919492908569',
    POC_EMAIL : 'harish.vallarapu@bajajfinserv.in'
}

export const AXIS = {
    POC_NAME : 'Rajesh',
    POC_CONTACT : '+919666369756',
    POC_EMAIL : '268585@axisbank.com'
}
export const AXIS_RAJESH = {
    POC_NAME : 'Rajesh',
    POC_CONTACT : '+919666369756',
    POC_EMAIL : '268585@axisbank.com'
}

export const AXIS_PRASANNA = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}

export const BANK_OF_BARODA = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}

export const HDFC = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}
export const HDFC_LTD = {
    POC_NAME : 'Gopala Krishna Kinnera',
    POC_CONTACT : '+919160696563',
    POC_EMAIL : 'gopalakrishna@hdfcsales.com'
}

export const ICICI = {
    POC_NAME : 'Ponnam Satish',
    POC_CONTACT : '+919000196605',
    POC_EMAIL : 'kolusu.madhavi@icicibank.com'
}
export const ICICI_SPRINGS = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}

export const KOTAK = {
    POC_NAME : 'Anil',
    POC_CONTACT : '+919505622228',
    POC_EMAIL : 'mallempati.anil@kotak.com'
}

export const KOTAK_OTHERS = {
    POC_NAME : 'Madhuri Mevada',
    POC_CONTACT : '+918977508820',
    POC_EMAIL : 'madhuri.mevada@kotak.com'
}

export const BOB = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}

export const SBI_PRASANNA = {
    POC_NAME : 'Prasanna Kumar',
    POC_CONTACT : '+919849156407',
    POC_EMAIL : 'prams321@gmail.com'
}

export const SBI_ANAND = {
    POC_NAME : 'Anand',
    POC_CONTACT : '+919493809666',
    POC_EMAIL : 'Vulpeeanandkumar@gmail.com'
}

