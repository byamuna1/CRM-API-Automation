import {expect , test} from '@playwright/test'
import { apiRequestFlatCostSheetDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest_spire';
import { EXCELS,  EXCELJS, HEADERS, PATH,} from '../constants';
const moment = require('moment');
const fs = require('fs')

test ("springs costsheetValidation  Data" , async () => {

    const ExcelJS = require(EXCELJS);

    let workbook1 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.COSTSHEETValidation);
    if(fs.existsSync(filePath1))
        await workbook1.xlsx.readFile(filePath1);
    
    const mismatchData = workbook1.addWorksheet(EXCELS.SPIRE);

    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : 'Calculated', key : 'cal'},
        { header : 'DB' , key : 'db'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ]
        
    const res = await apiRequestFlatDetails();
    let len = res.data.flats.length
    for(let index=0; index< len ; index++)
    {
        let costsheet_types : any = {
            basicRate : null ,
            basicCost : null, 
            floorRise : null, 
            cornerPremium : null ,
            infrastructure : null , 
            f_a : null, 
            carParking : null, 
            documentation : null, 
            total : null,  
            gst : null, 
            grossAmount : null, 
        }

        let flatID : string = (res.data.flats[index]['flatId']).toString() ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        let lenOFOtherParticulars = result.data.saleParticulars.otherParticulars[0].costs.length
        let flatData: {} = result.data.saleParticulars.otherParticulars[0].costs
        let totalAmountWithoutGst = 0,totalAmountWithGst = 0, fAndMtotalWithGST = 0,fAndMtotalWithoutGST = 0 , moveInTotalWithGST=0, moveInTotalWithoutGST=0, corpusTotalWithGST=0,corpusTotalWithoutGST=0 ;
            for(let index = 0 ;index <lenOFOtherParticulars ; index++)
            {
                totalAmountWithoutGst += flatData[index].total;
                totalAmountWithGst += flatData[index].total *0.05 +flatData[index].total
            }
            if(totalAmountWithGst != result.data.saleParticulars.otherParticulars[0].grossAmount)
                {
                    mismatchData.addRow({
                        sNo: index+1,
                        flatNo : result.data.flat.flatNumber,
                        Issue : 'total with gst not matched',
                        cal : totalAmountWithGst,
                        db : result.data.saleParticulars.otherParticulars[0].grossAmount
                    })
                }
                if(totalAmountWithoutGst != result.data.saleParticulars.otherParticulars[0].totalAmount)
                    {
                        mismatchData.addRow({
                            sNo: index+1,
                            flatNo : result.data.flat.flatNumber,
                            Issue : 'total without gst not matched',
                            cal : totalAmountWithoutGst,
                            db : result.data.saleParticulars.otherParticulars[0].totalAmount
                        })
                    }
            let lenOFadditionalCharges = result.data.saleParticulars.otherParticulars[1].costs.length
            flatData = result.data.saleParticulars.otherParticulars[1].costs
            let TotalOFFandMandMoveInWithGST = 0, TotalOFFandMandMoveInWithoutGST = 0
            for(let index = 0 ;index < lenOFadditionalCharges ;index++)
            {
                TotalOFFandMandMoveInWithGST += flatData[index].total *0.18 + flatData[index].total
                TotalOFFandMandMoveInWithoutGST += flatData[index].total
                if(flatData[index].type == 'FACILITIES_MAINTENANCE')
                {
                    fAndMtotalWithGST = flatData[index].total *0.18 + flatData[index].total
                    fAndMtotalWithoutGST = flatData[index].total
                }
                else if(flatData[index].type == 'MOVE_IN_CHARGES')
                    {
                    moveInTotalWithGST = flatData[index].total *0.18 + flatData[index].total
                    moveInTotalWithoutGST = flatData[index].total
                    }
            }
            if((fAndMtotalWithGST + moveInTotalWithGST) != result.data.saleParticulars.otherParticulars[1].grossAmount)
                {
                    mismatchData.addRow({
                        sNo: index+1,
                        flatNo : result.data.flat.flatNumber,
                        Issue : 'facilty with gst not matched',
                        cal : fAndMtotalWithGST +moveInTotalWithGST,
                        db : result.data.saleParticulars.otherParticulars[1].grossAmount
                    })
                }
                if((fAndMtotalWithoutGST + moveInTotalWithoutGST)  != result.data.saleParticulars.otherParticulars[1].totalAmount)
                    {
                        mismatchData.addRow({
                            sNo: index+1,
                            flatNo : result.data.flat.flatNumber,
                            Issue : 'facilty without gst not matched',
                            cal : fAndMtotalWithoutGST +moveInTotalWithoutGST,
                            db : result.data.saleParticulars.otherParticulars[1].totalAmount
                        })
                    }
            corpusTotalWithGST = result.data.saleParticulars.otherParticulars[2].costs[0].totalWithGst
            corpusTotalWithoutGST = result.data.saleParticulars.otherParticulars[2].costs[0].total 
            if(corpusTotalWithGST != result.data.saleParticulars.otherParticulars[2].grossAmount)
                {
                    mismatchData.addRow({
                        sNo: index+1,
                        flatNo : result.data.flat.flatNumber,
                        Issue : 'corpus with gst not matched',
                        cal : corpusTotalWithGST,
                        db : result.data.saleParticulars.otherParticulars[2].grossAmount
                    })
                }
                if(corpusTotalWithoutGST != result.data.saleParticulars.otherParticulars[2].totalAmount)
                    {
                        mismatchData.addRow({
                            sNo: index+1,
                            flatNo : result.data.flat.flatNumber,
                            Issue : 'corpus without gst not matched',
                            cal : corpusTotalWithoutGST,
                            db : result.data.saleParticulars.otherParticulars[2].totalAmount
                        })
                    }
            


        }

        //bank details validation
       
   await workbook1.xlsx.writeFile(filePath1);
}); 