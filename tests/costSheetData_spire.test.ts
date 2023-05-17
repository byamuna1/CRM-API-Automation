import {expect , test} from '@playwright/test'
import { apiRequestFlatCostSheetDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest_spire';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH } from '../constants';
import { SPIRE } from '../meta';
let costSheetDetailsForomScr : any = {};
let missingCount = 1 , mismatchCount = 1, costflag = 1;
let scrCostSheet = new Map<any,any>()

test ("spire costsheet Data" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPIRE.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.MASTER_DATA);

    const workbook1 = new ExcelJS.Workbook();
    const mismatchData = workbook1.addWorksheet(EXCELS.MISMATCH_COSTSHEET);
    const noflats = workbook1.addWorksheet(EXCELS.INSYSTEM_NOTINSCR);
    const missingData = workbook1.addWorksheet(EXCELS.MISSING_COSTSHEET);
    
    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.BASIC_RATE , key : 'basicRate'},
        { header : HEADERS.BASIC_RATE_SYSTEM , key : 'basicRateSystem'},
        { header : HEADERS.BASIC_COST , key : 'basicCost'},
        { header : HEADERS.BASIC_COST_SYSTEM , key : 'basicCostSystem'},
        { header : HEADERS.FLOOR_RISE , key : 'floorRise'},
        { header : HEADERS.FLOOR_RISE_SYSTEM , key : 'floorRiseSystem'},
        { header : HEADERS.CORNER_PREMIUM, key : 'cornerPremium'},
        { header : HEADERS.CORNER_PREMIUM_SYSTEM, key : 'cornerPremiumSystem'},
        { header : HEADERS.INFRASTRUCTURE, key : 'infrastructure'},
        { header : HEADERS.INFRASTRUCTURE_SYSTEM, key : 'infrastructureFromSystem'},
        { header : HEADERS.F_A, key : 'f_a'},
        { header : HEADERS.F_A_SYSTEM, key : 'f_a_System'},
        { header : HEADERS.CAR_PArking, key : 'carParking'},
        { header : HEADERS.CAR_PArking_SYSTEM, key : 'carParkingSystem'},
        { header : HEADERS.DOCUMENTATION, key : 'documentation'},
        { header : HEADERS.DOCUMENTATION_SYSTEM, key : 'documentationSystem'},
        { header: HEADERS.TOTAL, key: 'total' },
        { header: HEADERS.TOTAL_SYSTEM, key: 'totalSystem' },
        { header: HEADERS.GST, key: 'gst' },
        { header: HEADERS.GST_SYSTEM, key: 'gstSystem' },
        { header: HEADERS.GROSSAMOUNT, key: 'grossAmount' },
        { header: HEADERS.GROSSAMOUNT_SYSTEM, key: 'grossAmount_system' },
    ]
    noflats.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
    ]
    missingData.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
    ];

    const rowcount = worksheet.rowCount;  
    
    for(let i=6; i<5000; i++)
    {
        const row = worksheet.getRow(i) ;
        costSheetDetailsForomScr = {
                sNO : row.getCell(1).value?.result??row.getCell(1).value,
                flatNumber : row.getCell(2).value,
                statusOfFLat : row.getCell(11).value,
                basicRate : row.getCell(36).value?.result??row.getCell(36).value,
                basicCost : row.getCell(37).value?.result??row.getCell(37).value,
                floorRise : row.getCell(38).value?.result??row.getCell(38).value,
                cornerPremium : row.getCell(39).value?.result??row.getCell(39).value,
                carParking : row.getCell(40).value?.result??row.getCell(40).value,
                f_A : row.getCell(41).value?.result??row.getCell(41).value,
                infrastructure : row.getCell(42).value?.result??row.getCell(42).value,
                documentation : row.getCell(43).value, 
                totalamount : row.getCell(44).value?.result??row.getCell(44).value,
                gst : row.getCell(45).value?.result??0,
                grossAmount : row.getCell(46).value?.result??0,
                }
        
        if(costSheetDetailsForomScr.statusOfFLat == RESPONSE.BOOKED || costSheetDetailsForomScr.statusOfFLat == RESPONSE.booked)
        {
            let costsheet = {
                'basicRate' : costSheetDetailsForomScr.basicRate , 
                'basicCost' : costSheetDetailsForomScr.basicCost , 
                'floorRise' : costSheetDetailsForomScr.floorRise ,
                'cornerPremium' : costSheetDetailsForomScr.cornerPremium,
                'infrastructure':costSheetDetailsForomScr.infrastructure,
                'premiumType': costSheetDetailsForomScr.premiumtype,
                'F_A' : costSheetDetailsForomScr.f_A ,
                'carParking' : costSheetDetailsForomScr.carParking ,
                'documentation' : costSheetDetailsForomScr.documentation,
                'total' : costSheetDetailsForomScr.totalamount,
                'gst' : costSheetDetailsForomScr.gst,
                'grosstotal' : costSheetDetailsForomScr.grossAmount

            }
            scrCostSheet.set(String(costSheetDetailsForomScr.flatNumber), costsheet) ;
        }
        costSheetDetailsForomScr = {}
    }
    const res = await apiRequestFlatDetails();
    for(let index=0; index<res.data.length ; index++)
    {
        let costsheet_types : any = {
            basicRate : null ,
            basicRateSystem : null , 
            basicCost : null, 
            basicCostSystem : null, 
            floorRise : null, 
            floorRiseSystem : null, 
            cornerPremium : null ,
            cornerPremiumSystem : null , 
            infrastructure : null , 
            infrastructureSystem : null,
            f_a : null, 
            f_a_System : null , 
            carParking : null, 
            carParkingSystem : null,
            documentation : null, 
            documentationSystem : null, 
            total : null, 
            totalSystem : '' , 
            gst : null, 
            gstSystem : '', 
            grossAmount : null, 
            grossAmount_system : ''
        }

        let totalsaleParticulars :number = 0;
        let flatID : string = res.data[index][RESPONSE.ID] ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        let flag = result.data.saleParticulars.otherParticulars ? 1 : 0;
        costflag = 0;
        if(flag == 0)
        {
            missingData.addRow({
                sNo: missingCount++,
                flatNo: result.data[RESPONSE.FLATNUMBER]
            });
        }
        else
        {
            if(scrCostSheet.has(String(result.data[RESPONSE.FLATNUMBER]))) 
            {
                let scr_sheet = scrCostSheet.get(String(result.data[RESPONSE.FLATNUMBER])) ;
               
                for(let c=0 ; c<result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS].length ;  c++)
                {
                    if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Basic Price'  )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]- scr_sheet.basicCost) > 4)
                        {
                           
                            costflag++ ;
                            costsheet_types.basicCostSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.basicCost = scr_sheet.basicCost;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.floorRise) > 4)
                        {
                            costflag++ ;
                            costsheet_types.floorRiseSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.floorRise = scr_sheet.floorRise ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Premium'  || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Flat Premium')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.cornerPremium) > 4)
                        {
                            costflag++;
                            costsheet_types.cornerPremiumSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.cornerPremium = scr_sheet.cornerPremium ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Infrastructure Charges' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.infrastructure) > 4)
                        {
                            costflag++;
                            costsheet_types.infrastructureSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.infrastructure = scr_sheet.infrastructure ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Facilities and Amenities' ||  result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Club Facilities & Amenities Charges')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.F_A) > 4)
                        {
                            costflag++;
                            costsheet_types.f_a_System = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.f_a = scr_sheet.F_A_SYSTEM ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (back to back)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (Individual)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME]== '1 Car and 1 Bike Parking Charges')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.carParking) > 4)
                        {
                            costflag++;
                            costsheet_types.carParkingSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.carParking = scr_sheet.carParking ; 
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Documentation' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Documentation Charges' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.documentation) > 4)
                        {
                            costflag++;
                            costsheet_types.documentationSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                            costsheet_types.documentation = scr_sheet.documentation ;
                        }
                    }
                    totalsaleParticulars = totalsaleParticulars + result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] ;
                    
                }

                if(Math.abs(scr_sheet.total - totalsaleParticulars ) > 4)
                {
                    costflag++ ;
                    costsheet_types.totalSystem = String(totalsaleParticulars)  ;
                    costsheet_types.total = scr_sheet.total
                }

                if(Math.abs(scr_sheet.gst - (totalsaleParticulars * 0.05) ) > 4)
                {
                    costflag++ ;
                    costsheet_types.gstSystem = String(totalsaleParticulars * 0.05 ) ;
                    costsheet_types.gst = scr_sheet.gst
                }
                 
               
                if(Math.abs(scr_sheet.grosstotal - ((totalsaleParticulars * 0.05) + totalsaleParticulars) ) > 4)
                {
                    costflag++;
                    costsheet_types.grossAmount_system = String((totalsaleParticulars * 0.05) + totalsaleParticulars);
                    costsheet_types.grossAmount = scr_sheet.grosstotal
                }

                if(costflag != 0)
                {

                    mismatchData.addRow({
                        sNo : mismatchCount++,
                        flatNo : result.data[RESPONSE.FLATNUMBER],
                        basicRate : costsheet_types.basicRate,
                        basicRateSystem : costsheet_types.basicRateSystem,
                        basicCost : costsheet_types.basicCost ,
                        basicCostSystem : costsheet_types.basicCostSystem,
                        floorRise : costsheet_types.floorRise,
                        floorRiseSystem : costsheet_types.floorRiseSystem,
                        cornerPremium : costsheet_types.cornerPremium,
                        cornerPremiumSystem : costsheet_types.cornerPremiumSystem,
                        infrastructure : costsheet_types.infrastructure,
                        infrastructureFromSystem  : costsheet_types.infrastructureSystem,
                        f_a : costsheet_types.f_a ,
                        f_a_System : costsheet_types.f_a_System ,
                        carParking : costsheet_types.carParking ,
                        carParkingSystem : costsheet_types.carParkingSystem ,
                        documentation : costsheet_types.documentation, 
                        documentationSystem : costsheet_types.documentationSystem ,
                        total : costsheet_types.total,
                        totalSystem :costsheet_types.totalSystem ?? '',
                        gst : costsheet_types.gst ,
                        gstSystem : costsheet_types.gstSystem,
                        grossAmount : costsheet_types.grossAmount,
                        grossAmount_system : costsheet_types.grossAmount_system

                    });
                }
                costflag = 1;
            }
            else
            {
                noflats.addRow({
                        sNo: missingCount++,
                        flatNo: result.data[RESPONSE.FLATNUMBER]
                    });
            }
        }

        flag = 0 
    }
    
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.SPIRE_COSTSHEET_EXCEL);
    await workbook1.xlsx.writeFile(filePath1);
      
}); 