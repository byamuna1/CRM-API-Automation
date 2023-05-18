import {expect , test} from '@playwright/test'
import { apiRequestFlatCostSheetDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest';
import { EXCELS, RESPONSE, EXCELJS, HEADERS, PATH } from '../constants';
import { MAIN } from '../meta';
let costSheetDetailsForomScr : any = {};
let missingCount = 1 , mismatchCount = 1, costflag =1;
let scrCostSheet = new Map<any,any>()

test ("costsheet Data" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(MAIN.SCR_EXCEL);
    const worksheet = workbook.getWorksheet('Master Data');

    const workbook1 = new ExcelJS.Workbook();
    const mismatchData = workbook1.addWorksheet('mismatch costsheets');
    const noflats = workbook1.addWorksheet('inSystemNotInSCRFlats');
    const missingData = workbook1.addWorksheet('missing costsheets');
    
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
        { header : HEADERS.F_A, key : 'f_a_System'},
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
        if(MAIN.PROJECT == 'SPECTRA')
        {
            costSheetDetailsForomScr = {
            sNO : row.getCell(1).value?.result??row.getCell(1).value,
            flatNumber : row.getCell(3).value,
            statusOfFLat : row.getCell(12).value,
            basicRate : row.getCell(37).value?.result??row.getCell(37).value,
            basicCost : row.getCell(38).value?.result??row.getCell(38).value,
            floorRise : row.getCell(39).value?.result??row.getCell(39).value,
            premiumtype : row.getCell(40).value?row.getCell(40).value:0,
            cornerPremium : row.getCell(41).value?.result??row.getCell(41).value,
            infrastructure : row.getCell(42).value?.result??0,
            f_A : row.getCell(43).value,
            carParking : row.getCell(44).value,
            documentation : row.getCell(45).value, 
            totalamount : row.getCell(46).value?.result??row.getCell(46).value,
            gst : row.getCell(47).value?.result??0,
            grossAmount : row.getCell(48).value?.result??0,
            }
        }
        else if(MAIN.PROJECT == 'SPRINGS' )
        {
            costSheetDetailsForomScr = {
                sNO : row.getCell(1).value?.result??row.getCell(1).value,
                flatNumber : row.getCell(2).value,
                statusOfFLat : row.getCell(11).value,
                basicRate : row.getCell(36).value?.result??row.getCell(36).value,
                basicCost : row.getCell(37).value?.result??row.getCell(37).value,
                floorRise : row.getCell(38).value?.result??row.getCell(38).value,
                cornerPremium : row.getCell(39).value?.result??row.getCell(39).value,
                infrastructure : row.getCell(40).value?.result??row.getCell(40).value,
                f_A : row.getCell(41).value?.result??row.getCell(41).value,
                carParking : row.getCell(42).value?.result??row.getCell(42).value,
                documentation : row.getCell(43).value, 
                totalamount : row.getCell(44).value?.result??row.getCell(44).value,
                gst : row.getCell(45).value?.result??0,
                grossAmount : row.getCell(46).value?.result??0,
                }
        }
        else if(MAIN.PROJECT == 'SPIRE')
        {
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
        }

        if(costSheetDetailsForomScr.statusOfFLat == 'Booked' || costSheetDetailsForomScr.statusOfFLat == 'booked')
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
        let basicRate = null ,basicRateSystem = null , basicCost = null, basicCostSystem = null, floorRise = null, floorRiseSystem = null, cornerPremium = null ,cornerPremiumSystem= null , infrastructure = null , infrastructureSystem;
        let f_a = null, f_a_System = null , carParking = null, carParkingSystem = null,documentation = null, documentationSystem = null, total = null, totalSystem :string = '' , gst = null, gstSystem = '', grossAmount = null, grossAmount_system = '';
        let totalsaleParticulars :number = 0;
        let flatID : string = res.data[index][RESPONSE.ID] ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        let flag = result.data.saleParticulars.otherParticulars ? 1 : 0;
        
        if(flag == 0)
        {
            missingData.addRow({
                sNo: missingCount++,
                flatNo: result.data[RESPONSE.FLATNUMBER]
            });
        }
        else
        {
            if(scrCostSheet.has(String(result.data['flatNumber']))) 
            {
                let scr_sheet = scrCostSheet.get(String(result.data['flatNumber'])) ;

                for(let c=0 ; c<result.data.saleParticulars.otherParticulars[0]['costs'].length ;  c++)
                {
                    if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Basic Price'  )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total']- scr_sheet.basicCost) > 4)
                        {
                           
                            costflag = 0 ;
                            basicCostSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            basicCost = scr_sheet.basicCost;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Floor Rise' || result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Floor Rise Charges' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.floorRise) > 4)
                        {
                            costflag = 0 ;
                            floorRiseSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            floorRise = scr_sheet.floorRise ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Corner Premium'  || result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Corner Flat Premium')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.cornerPremium) > 4)
                        {
                            costflag = 0 ;
                            cornerPremiumSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            cornerPremium = scr_sheet.cornerPremium ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Infrastructure Charges' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.infrastructure) > 4)
                        {
                            costflag = 0 ;
                            infrastructureSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            infrastructure = scr_sheet.infrastructure ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Facilities and Amenities' ||  result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Club Facilities & Amenities Charges')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.F_A) > 4)
                        {
                            costflag = 0 ;
                            f_a_System = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            f_a = scr_sheet.F_A_SYSTEM ;
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Car Parking (back to back)' || result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Car Parking (Individual)' || result.data.saleParticulars.otherParticulars[0]['costs'][c]['name']== '1 Car and 1 Bike Parking Charges')
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.carParking) > 4)
                        {
                            costflag = 0 ;
                            carParkingSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            carParking = scr_sheet.carParking ; 
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Documentation' || result.data.saleParticulars.otherParticulars[0]['costs'][c]['name'] == 'Documentation Charges' )
                    {
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] - scr_sheet.documentation) > 4)
                        {
                            costflag = 0 ;
                            documentationSystem = result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'];
                            documentation = scr_sheet.documentation ;
                        }
                    }
                    totalsaleParticulars = totalsaleParticulars + result.data.saleParticulars.otherParticulars[0]['costs'][c]['total'] ;
                    
                }

                if(Math.abs(scr_sheet.total - totalsaleParticulars ) > 4)
                {
                    costflag = 0 ;
                    totalSystem = String(totalsaleParticulars)  ;
                    total = scr_sheet.total
                }

                if(Math.abs(scr_sheet.gst - (totalsaleParticulars * 0.05) ) > 4)
                {
                    costflag = 0 ;
                    gstSystem = String(totalsaleParticulars * 0.05 ) ;
                    gst = scr_sheet.gst
                }
                 
               
                if(Math.abs(scr_sheet.grosstotal - ((totalsaleParticulars * 0.05) + totalsaleParticulars) ) > 4)
                {
                    costflag = 0 ;
                    grossAmount_system = String((totalsaleParticulars * 0.05) + totalsaleParticulars);
                    grossAmount = scr_sheet.grosstotal
                }

                if(costflag == 0)
                {
                    if(result.data['flatNumber'] == '706' )

                    mismatchData.addRow({
                        sNo : mismatchCount++,
                        flatNo : result.data['flatNumber'],
                        basicRate : basicRate,
                        basicRateSystem : basicRateSystem,
                        basicCost : basicCost ,
                        basicCostSystem : basicCostSystem,
                        floorRise : floorRise,
                        floorRiseSystem : floorRiseSystem,
                        cornerPremium : cornerPremium,
                        cornerPremiumSystem : cornerPremiumSystem,
                        infrastructure : infrastructure,
                        infrastructureFromSystem  : infrastructureSystem,
                        f_a : f_a ,
                        f_a_System : f_a_System ,
                        carParking : carParking ,
                        carParkingSystem : carParkingSystem ,
                        documentation : documentation, 
                        documentationSystem : documentationSystem ,
                        total : total,
                        totalSystem :totalSystem ?? '',
                        gst : gst ,
                        gstSystem : gstSystem,
                        grossAmount : grossAmount,
                        grossAmount_system : grossAmount_system

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
    // const path = require(PATH);
    // const filePath1 = path.join(__dirname, EXCELS.SPRINGS_COSTSHEET_EXCEL);
    // await workbook1.xlsx.writeFile(filePath1);
      
}); 