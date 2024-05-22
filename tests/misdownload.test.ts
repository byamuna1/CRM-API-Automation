import {expect , test} from '@playwright/test'
import { apiRequestSaleParticulars, apiRequestmilestoneDetails, apiRequestownerDetails, createFolder } from '../generic/apiRequest_Loft';
import { EXCELS,EXCELJS, RESPONSE,HEADERS,PATH, SHEETS } from '../constants';
import { SPECTRA } from '../meta';
import { apiRequestFlatCostSheetDetails } from '../generic/apiRequest_Loft';
import moment from 'moment';
import { read } from 'xlsx';
const fs = require('fs')
let count = 1, floorRiseIndex,cornerPremiumIndex, infrastructureIndex, acCopperIndex, fandMIndex, documentationIndex, carParkingIndex;

test ("loft Sale Particulars" , async () => {
    const ExcelJS = require(EXCELJS);
    let workbook1 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SALE_PARTICULARS);

    if(fs.existsSync(filePath1))
        await workbook1.xlsx.readFile(filePath1);

    const saleparticulars = workbook1.addWorksheet(EXCELS.SPECTRA);

    saleparticulars.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : 'Facing' , key : 'Facing'},
        { header : 'Area' , key : 'Area'},
        { header : 'UDS Area' , key : 'UDS'},
        { header : 'BHK' , key : 'BHK'},
        { header : 'Parking' , key : 'Parking'},
        { header : 'P slot No' , key : 'Pslot'},
        { header : 'Share' , key : 'share'},
        { header : 'Mortage' , key : 'mortage'},
        { header : 'Status' , key : 'status'},
        { header : 'Booking Date' , key : 'Bookingdate'},
        { header : 'Source' , key : 'soucre'},
        { header : 'Sale Execute' , key : 'saleExecutive'},
        { header : 'Team Mng' , key : 'teamMng'},
        { header : 'Name' , key : 'name'},
        { header : 'Residency' , key : 'residency'},
        { header : 'DOB' , key : 'dob'},
        { header : 'PAN NO.' , key :'Pan'},
        { header : 'Aadhar No' , key : 'Aadhar'},
        { header : 'Phone No' , key : 'Phoneno'},
        { header : 'Email Id' , key : 'Emailid'},
        { header : 'Co-applicant' , key : 'CoApplicant'},
        { header : 'Co-DOB' , key : 'coDOB'},
        { header : 'Co-Aadhar' , key : 'coAadhar'},
        { header : 'CO-PAN No' , key : 'coPan'},
        { header : 'Co Aadhar' , key : 'CoAadhar'},
        { header : 'Co PhoneNumber' , key : 'CoPhonenumber'},
        { header : 'Co EmailID' , key : 'CoEmailID'},
        { header : 'Co Address' , key : 'coAddress'},
        { header : 'Occupation' , key : 'occupation'},
        { header : 'Workingfor' , key : 'workingfor'},
        { header : 'Office Address' , key : 'officeaddress'},
        { header : 'LPA' , key : 'LPA'},
        { header : 'Docs Received' , key : 'docreceived'},
        { header : 'OWN Funding %' , key : 'ownfunding'},
        { header : 'Loan Fund %' , key : 'LoanFund'},
        { header : 'AOS Status' , key : 'AosStatus'},
        { header : 'Aos Date' , key : 'aosdate'},
        { header : 'Days' , key : 'days'},
        { header : 'Basic Rate' , key : 'basicRate'},
        { header : 'Basic Cost' , key : 'basicCost'},
        { header : 'Floor Rise' , key : 'floorRise'},
        { header : 'Corner Premium' , key : 'cornerPremium'},
        { header : 'Infrastructure' , key : 'infrastructure'},
        { header : 'AC Copper piping' , key : 'acCopperPiping'},
        { header : 'Club F & A' , key : 'FandA'},
        { header : 'Legal Charges' , key : 'legalCharges'},
        { header : 'Car Parking' , key : 'carParking'},
        { header : 'Total ' , key : 'total'},
        { header : 'GST' , key : 'gst'},
        { header : 'Gross Amount' , key : 'grossAmount'},
        { header : 'Accrued Amount' , key : 'Accrued Amount'},
        { header : 'Collected Amount' , key : 'collectedAmount'},
        { header : 'Receivable amount' , key : 'receivableAmount'},
    ];
 console.log('tettete')
    const response = await apiRequestSaleParticulars();
    
    for( let index = 0 ; index < 1 ; index++)
    {
        let FlatID : string = response[index]['_id']
        let applicantcount = (response[index]['applicants']).length
        const flatDataResponse = await apiRequestFlatCostSheetDetails(FlatID)
        const costSheetExists = flatDataResponse.data.saleParticulars.otherParticulars ? 1 : 0
        
        if(costSheetExists == 1)
        {
            floorRiseIndex = (flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs']).findIndex((element => element.name == 'Floor Rise (6th floor onwards)'))
            cornerPremiumIndex = (flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs']).findIndex((element => element.name == 'Corner Premium Charges'))
            infrastructureIndex = (flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs']).findIndex((element => element.name == 'Infrastructure Charges'))
            acCopperIndex =( flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs']).findIndex(element => element.name == 'AC Copper Piping')
            fandMIndex = (flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs']).findIndex((element => element.name == 'Club Facilities and Amenities'))
            documentationIndex = flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs'].findIndex((element => element.name == 'Legal Charges'))
            carParkingIndex = flatDataResponse.data.saleParticulars?.otherParticulars[0]['costs'].findIndex((element => element.name == '2 Car Parking'))
        }
        
        const ownerDetails = await apiRequestownerDetails(FlatID)
        const milestoneDetails = await apiRequestmilestoneDetails(FlatID)
        console.log(milestoneDetails)
        applicantcount = ownerDetails.data[0]?.applicants?ownerDetails.data[0].applicants.length : 0;
        if(moment(flatDataResponse.data.saleDetails['bookingDate']).isAfter('2023-08-24') && moment(flatDataResponse.data.saleDetails['bookingDate']).isBefore('2023-09-30'))
         {
            saleparticulars.addRow({
            sNo : count++ ,
            flatNo : flatDataResponse.data['flatNumber'],
            Facing : flatDataResponse.data.details['facing'],
            Area : flatDataResponse.data.details['area'],
            UDS : flatDataResponse.data.details['uds'],
            BHK : flatDataResponse.data.details['bhks'],
            Parking : flatDataResponse.data.details['parkings'],
            Pslot : flatDataResponse.data.details['parkingSlots'],
            share : flatDataResponse.data.details['share'],
             mortage : flatDataResponse.data.details['mortage']==false ? 'No':'Yes',
             status : flatDataResponse.data.saleDetails['status'],
             Bookingdate : moment(flatDataResponse.data.saleDetails['bookingDate']).format("MMM Do YY"),
            soucre : flatDataResponse.data.leads['source'],
            saleExecutive : flatDataResponse.data.leads['salesExecutive'],
            name : applicantcount>=1 ? ownerDetails.data[0]?.applicants[0]['firstName'] + ownerDetails.data[0]?.applicants[0]['lastName'] : '',
            residency : ownerDetails.data[0]?.applicants[0]['personalInfo']['address'],
            dob : ownerDetails.data[0]?.applicants[0].personalInfo['DOB'],
            pan : ownerDetails.data[0]?.applicants[0].personalInfo['PanNo'],
            Aadhar : ownerDetails.data[0]?.applicants[0].personalInfo['AadharNo'],
            Phoneno : ownerDetails.data[0]?.applicants[0]['contactNumber'],
            Emailid : ownerDetails.data[0]?.applicants[0]['email'],
            CoApplicant : applicantcount == 2 ? ownerDetails.data[0]?.applicants[1]['firstName'] + ownerDetails.data[0]?.applicants[1]['lastName'] : '',
            coDOB : applicantcount == 2 ? ownerDetails.data[0]?.applicants[1].personalInfo['DOB']: '',
            coAadhar : applicantcount == 2 ? ownerDetails.data[0]?.applicants[0].personalInfo['AadharNo']: '',
            coPan : applicantcount == 2 ? ownerDetails.data[0]?.applicants[1].personalInfo['PanNo']: '',
            CoPhonenumber: applicantcount == 2?  ownerDetails.data[0]?.applicants[1]['contactNumber']: '',
            CoEmailID : applicantcount == 2? ownerDetails.data[0]?.applicants[1]['email']: '',
            coAddress : applicantcount == 2 ? ownerDetails.data[0]?.applicants[1]['personalInfo']['address']: '',
            occupation : ownerDetails.data[0]?.applicants[0]['personalInfo']['occupation'],
            workingfor : ownerDetails.data[0]?.applicants[0]['personalInfo']['workingFor'],
            officeaddress : ownerDetails.data[0]?.applicants[0]['personalInfo']['officeAddress'],
            LPA : ownerDetails.data[0]?.applicants[0]['personalInfo']['lpa'],
            docreceived : flatDataResponse.data.saleDetails['docReceived'] == false ? 'No': 'Yes',
            ownfunding : flatDataResponse.data.saleDetails['ownFunding'],
            LoanFund : flatDataResponse.data.saleDetails['loanFunding'],
            AosStatus : flatDataResponse.data.saleDetails['aosStatus'],
            aosdate : flatDataResponse.data.saleDetails['aosStatus'] == 'COMPLETED'? flatDataResponse.data.saleDetails['aosDate']: '',
            basicRate : flatDataResponse.data.saleParticulars['basicRate'],
            basicCost : flatDataResponse.data.saleParticulars['basicCost'],
            floorRise : floorRiseIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][floorRiseIndex]['total']: '',
            cornerPremium : cornerPremiumIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][cornerPremiumIndex]['total']: '',
            acCopperPiping : acCopperIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][acCopperIndex]['total']: '',
            infrastructure : infrastructureIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][infrastructureIndex]['total']: '',
            FandA : fandMIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][fandMIndex]['total']: '',
            legalCharges : documentationIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][documentationIndex]['total']: '',
            carParking : carParkingIndex != -1? flatDataResponse.data.saleParticulars.otherParticulars[0]['costs'][carParkingIndex]['total']: '',
            total :costSheetExists == 1? flatDataResponse.data.saleParticulars.otherParticulars[0]['totalAmount']: '',
            gst : costSheetExists == 1?  flatDataResponse.data.saleParticulars.otherParticulars[0]['gst']: '',
            grossAmount : costSheetExists == 1? flatDataResponse.data.saleParticulars.otherParticulars[0]['grossAmount']: '',
            //accruedAmount : 
            })
        }
    }

    
   await workbook1.xlsx.writeFile(filePath1);
}); 