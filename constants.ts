const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newdate = year + "-" + month + "-" + day;

export const HEADERS = {
    SNO : 'SNO' ,
    FLATNO : 'FLatNO' ,
    APPLICANT1 : 'APPLICANT1',
    CONTACTNUMBER1 : 'CONTACTNUMBER1',
    EMAIL1 : 'EMAIL1',
    APPLICANT2 : 'APPLICANT2',
    CONTACTNUMBER2 : 'CONTACTNUMBER2' ,
    EMAIL2 : 'EMAIL2',

    TOTALAMOUNTFROMEXCEL : 'TotalAmountFromExcel',
    TOTALAMOUNTFROMSYSTEM : 'TotalAmountFromSYSTEM',
    ACCUREDAMOUNTFROMEXCEL : 'AccuredAmountFromExcel',
    ACCUREDAMOUNTFROMSYSTEM : 'AccuredAmountFromSystem',
    COLLECTEDAMOUNTFROMEXCEL : 'CollectedAmountFromExcel',
    COLLECTEDAMOUNTFROMSYSTEM : 'CollectedAmountFromSystem',
    RECEIVABLEAMOUNTFROMEXCEL : 'ReceivableAmountFromExcel',
    RECEIVABLEAMOUNTFROMSYSTEM : 'ReceivableAmountFromSystem',

    RECEIPTNUMBER : 'RECEIPTNO',
    RECEIPTAMOUNT : 'AMOUNT',
    RECEIPTREFERENCENO : 'REFERENCENO',
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
    SCREXCELSHEET:'',
    FLAT_USERS_DETAILS : 'user-details.xlsx' ,
    MISSING_FLATS : 'missing-flats.xlsx',
    SALE_PARTICULARS : 'Flat-sale-particulars.xlsx',
    MISSING_RECEIPTS : 'missing-receipts.xlsx' ,
    MISMATCH_RECEIPTS : 'mismatch-receipts.xlsx',
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
    SPECTRA_SCR_RECEIPTLOGS : 'SPECTRA - Receipt Logs as on 17_4_2023.xlsx',

    SPECTRA_MISSING_RECEIPTS : `excelDownloads/${newdate}/spectra-mising-receipts.xlsx` ,
    SPECTRA_MISMATCH_RECEIPTS : `excelDownloads/${newdate}/spectra-mismtach-receipts.xlsx`,
}
