import {expect , test} from '@playwright/test'
import { apiRequestFlatCostSheetDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest_spectra';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH } from '../constants';
import { SPECTRA } from '../meta';
const moment = require('moment');
const fs = require('fs')
let costSheetDetailsForomScr : any = {};
let bankDetailsFromScr : any = {};
let missingCount = 1 , mismatchCount = 1, costflag = 1;
let scrCostSheet = new Map<any,any>()
let bankDetails = new Map<any, any>();
let systemcostsheet = new Map<any, any>()

test ("spectra costsheet Data" , async () => {

    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPECTRA.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.MASTER_DATA);
    const worksheet1 = workbook.getWorksheet(SHEETS.RECEIPTLOGS_DATA)

    let workbook1 = new ExcelJS.Workbook();
    let workbook2 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.COSTSHEET);
    const filePath2 = path.join(__dirname, EXCELS.LOANDETAILS);
    if(fs.existsSync(filePath1))
        await workbook1.xlsx.readFile(filePath1);
    if(fs.existsSync(filePath2))
        await workbook1.xlsx.readFile(filePath2);
    
    const mismatchData = workbook1.addWorksheet(EXCELS.SPECTRA);
    const bank_details = workbook2.addWorksheet(EXCELS.SPECTRA)

    mismatchData.columns = [
        { header : HEADERS.SNO , key : 'sNo'},
        { header : HEADERS.FLATNO , key : 'flatNo'},
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ]
    
    bank_details.columns = [
        { header: HEADERS.SNO, key: 'sNo' },
        { header: HEADERS.FLATNO, key: 'flatNo' },
        { header : HEADERS.ISSUE , key : 'Issue'},
        { header : HEADERS.SCR , key : 'scr'},
        { header : HEADERS.SYSTEM , key : 'system'},
        { header : HEADERS.STATUS , key : 'status'},
        { header : HEADERS.COMMENTS , key : 'comments'},
    ];
    // master data reading 
    const rowcount = worksheet.rowCount;  
    
    for(let i=6; i<5000; i++)
    {
        const row = worksheet.getRow(i) ;
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
            bankName : row.getCell(84).value,
            bankPOCName : row.getCell(85).value,
            pocContact : row.getCell(86).value,
            pocEmail : row.getCell(87).value?.text??row.getCell(87).value,
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
                'grosstotal' : costSheetDetailsForomScr.grossAmount,
                'bankName' : costSheetDetailsForomScr.bankName,
                'bankPOCName' : costSheetDetailsForomScr.bankPOCName,
                'pocContact': costSheetDetailsForomScr.pocContact,
                'pocEmail' : costSheetDetailsForomScr.pocEmail

            }
            scrCostSheet.set(String(costSheetDetailsForomScr.flatNumber), costsheet) ;
        }
       
        costSheetDetailsForomScr = {}
    }

    //bank details 
    const rowCount1 = worksheet1.rowCount;
    for(let i=4; i<rowCount1; i++)
    {
        const row = worksheet1.getRow(i) ;
        bankDetailsFromScr = {
            sNo : row.getCell(1).value?.result??row.getCell(1).value,
            flatNumber : row.getCell(3).value ,
            bankName : row.getCell(9).value?.result??0,
        }

        if(bankDetailsFromScr.accruedAmount != 0)
        {
            bankDetails.set(String(bankDetailsFromScr.flatNumber) , {'bankName' : bankDetailsFromScr.bankName})
        }
        bankDetailsFromScr = {}
    }

    const res = await apiRequestFlatDetails();
    for(let index=0; index< res.data.length ; index++)
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
            grossAmount_system : '',
            bankName : null,
            bankNameSystem : null,
            bankPOCName : null,
            bankPOCNameSystem : null,
            pocContact : null,
            pocContactSystem : null,
            pocEmail : null,
            pocEmailSystem : null,
        }

        //cost sheet Validation
        let totalsaleParticulars :number = 0;
        let flatID : string = res.data[index][RESPONSE.ID] ;
        const result = await apiRequestFlatCostSheetDetails(flatID);
        let flag = result.data.saleParticulars.otherParticulars ? 1 : 0;
        
        if(flag != 0)
        {
            if(scrCostSheet.has(String(result.data[RESPONSE.FLATNUMBER]))) 
            {
                let scr_sheet = scrCostSheet.get(String(result.data[RESPONSE.FLATNUMBER])) ;
                let flat_costsheetout: string = ``;
                const basicprice = scr_sheet.basicCost;
                const floorrise = scr_sheet.floorRise ;
                const cornerPremium = scr_sheet.cornerPremium ;
                const infrastructure = scr_sheet.infrastructure ;
                const f_a = scr_sheet.F_A ;
                const carParking = scr_sheet.carParking ; 
                const documentation = scr_sheet.documentation ;

                for(let c=0 ; c<result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS].length ;  c++)
                {
                    if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Basic Price'  )
                    {
                        costsheet_types.basicCostSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.basicCost = scr_sheet.basicCost;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]- scr_sheet.basicCost) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Basic Price',
                                scr : scr_sheet.basicCost ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise Charges' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise Charges (7th Floor onwards)' )
                    {
                        costsheet_types.floorRiseSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.floorRise = scr_sheet.floorRise ;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.floorRise) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Floor Rise',
                                scr : scr_sheet.floorRise ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Premium'  || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Flat Premium' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Flat Premium Charges')
                    {
                        costsheet_types.cornerPremiumSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.cornerPremium = scr_sheet.cornerPremium ;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.cornerPremium) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Corner Premium',
                                scr : scr_sheet.cornerPremium ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Infrastructure Charges' )
                    {
                        costsheet_types.infrastructureSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.infrastructure = scr_sheet.infrastructure ;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.infrastructure) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Infrastructure Charges',
                                scr : scr_sheet.infrastructure ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Facilities and Amenities' ||  result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Club Facilities & Amenities Charges')
                    {
                        costsheet_types.f_a_System = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.f_a = scr_sheet.F_A ;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.F_A) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Facilities and Amenities',
                                scr : scr_sheet.F_A ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (back to back)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (Independent)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME]== '1 Car and 1 Bike Parking Charges')
                    {
                        costsheet_types.carParkingSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.carParking = scr_sheet.carParking ; 
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.carParking) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Car Parking (back to back)',
                                scr : scr_sheet.carParking ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Documentation' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Documentation Charges' )
                    {
                        costsheet_types.documentationSystem = result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL];
                        costsheet_types.documentation = scr_sheet.documentation ;
                        if(Math.abs(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] - scr_sheet.documentation) > 4)
                        {
                            costflag = 0 ;
                            mismatchData.addRow({
                                sNo : mismatchCount++,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Documentation',
                                scr : scr_sheet.F_A ,
                                system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                            });
                        }
                    }
                    totalsaleParticulars = totalsaleParticulars + result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL] ;
                }

                if(Math.abs(scr_sheet.total - totalsaleParticulars ) > 4)
                {
                    costflag = 0 ;
                    costsheet_types.totalSystem = String(totalsaleParticulars)  ;
                    costsheet_types.total = scr_sheet.total 
                    mismatchData.addRow({
                        sNo : mismatchCount++,
                        flatNo : result.data[RESPONSE.FLATNUMBER],
                        Issue : 'total',
                        scr : scr_sheet.total ,
                        system :costsheet_types.totalSystem
                    });
                }

                if(Math.abs(scr_sheet.gst - (totalsaleParticulars * 0.05) ) > 4)
                {
                    costflag = 0 ;
                    costsheet_types.gstSystem = String(totalsaleParticulars * 0.05 ) ;
                    costsheet_types.gst = scr_sheet.gst ;
                    mismatchData.addRow({
                        sNo : mismatchCount++,
                        flatNo : result.data[RESPONSE.FLATNUMBER],
                        Issue : 'GST',
                        scr : scr_sheet.gst ,
                        system :costsheet_types.gstSystem
                    });
                }
                 
               
                if(Math.abs(scr_sheet.grosstotal - ((totalsaleParticulars * 0.05) + totalsaleParticulars) ) > 4)
                {
                    costflag = 0 ;
                    costsheet_types.grossAmount_system = String((totalsaleParticulars * 0.05) + totalsaleParticulars);
                    costsheet_types.grossAmount = scr_sheet.grosstotal
                    mismatchData.addRow({
                        sNo : mismatchCount++,
                        flatNo : result.data[RESPONSE.FLATNUMBER],
                        Issue : 'Gross Total',
                        scr : scr_sheet.grosstotal ,
                        system :costsheet_types.grossAmount_system
                    });
                }
                
               if(costsheet_types.basicCost == null && costsheet_types.basicCostSystem == null && basicprice > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Basic Price',
                    scr : basicprice ,
                    system :'0'
                });
               }
               if( costsheet_types.floorRise == null && costsheet_types.floorRiseSystem == null && floorrise > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Floor Rise',
                    scr : floorrise ,
                    system :'0'
                });
               }
               if( costsheet_types.cornerPremium == null && costsheet_types.cornerPremiumSystem == null && cornerPremium > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Corner Premium',
                    scr : cornerPremium ,
                    system :'0'
                });
               }
               if( costsheet_types.infrastructure == null &&! costsheet_types.infrastructureSystem == null && infrastructure > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Infrastructure',
                    scr : infrastructure ,
                    system :'0'
                });
               }
               if( costsheet_types.carParking == null && costsheet_types.carParkingSystem == null && carParking > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'CarParking',
                    scr : infrastructure ,
                    system :'0'
                });
               }
               if( costsheet_types.documentation == null && costsheet_types.documentationSystem == null && documentation > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Documentation',
                    scr : documentation ,
                    system :'0'
                });
               }
               if( costsheet_types.f_a == null && costsheet_types.f_a_System == null && f_a > 0)
               {
                mismatchData.addRow({
                    sNo : mismatchCount++,
                    flatNo : result.data[RESPONSE.FLATNUMBER],
                    Issue : 'Facilities and Amenities',
                    scr : f_a ,
                    system :'0'
                });
               }
    
                costflag = 1;
            }
        }

        //bank details validation
        if(scrCostSheet.has(String(result.data[RESPONSE.FLATNUMBER])))
        {
            if(result.data.saleDetails.paymentType == 'LOAN')
            {
                let scr_sheet = scrCostSheet.get(String(result.data[RESPONSE.FLATNUMBER]))
                let bank_flag = result.data.saleDetails.bank.length;
                if(bank_flag == 0)
                {
                    console.log(scr_sheet.bankName  )
                    let bank = scr_sheet.bank ;
                    if(scr_sheet.bankName == null)
                       bank = 'No bank'
                    bank_details.addRow({
                        sNo : missingCount++ ,
                        flatNo : result.data[RESPONSE.FLATNUMBER],
                        Issue : 'missing bank in system',
                        scr : bank,
                        system : 'No bank'
                    })
                }
                else
                {
                    //console.log(scr_sheet.bankName , result.data.saleDetails.bank[0]['name'] )
                    let bank ;
                    if(String(scr_sheet.bankName).trim() == 'BHFL')
                       bank = 'BAJAJ HOUSING FINANCE LIMITED'
                    else if(String(scr_sheet.bankName).trim() == 'Axis Bank')
                        bank = 'AXIS BANK LIMITED'
                    else if(String(scr_sheet.bankName).trim() == 'HDFC Bank')
                        bank = 'HDFC LIMITED'
                    else if(String(scr_sheet.bankName).trim() == 'ICICI Bank')
                        bank = 'ICICI BANK LTD'
                    else if(String(scr_sheet.bankName).trim() == 'Kotak')
                        bank = 'KOTAK MAHINDRA BANK LTD'
                    if(bank != result.data.saleDetails.bank[0]['name'])
                    {
                        if(scr_sheet.bankName == null)
                            bank = 'No bank'
                        bank_details.addRow({
                            sNo : missingCount++ ,
                            flatNo : result.data[RESPONSE.FLATNUMBER],
                            Issue : 'mismatch bank',
                            scr : bank,
                            system : result.data.saleDetails.bank[0]['name']
                        })
                    }

                }
            }
        }
        flag = 0 
    }

    await workbook1.xlsx.writeFile(filePath1);
      
}); 