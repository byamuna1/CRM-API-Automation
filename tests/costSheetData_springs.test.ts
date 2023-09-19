import {expect , test} from '@playwright/test'
import { apiRequestFlatCostSheetDetails, apiRequestFlatDetails,  createFolder } from '../generic/apiRequest_springs';
import { EXCELS, RESPONSE, SHEETS , EXCELJS, HEADERS, PATH, BANK, AXIS_PRASANNA, AXIS, AXIS_RAJESH, BHFL, BHFL_HARISH, BOB, HDFC, HDFC_LTD, ICICI_SPRINGS, KOTAK, KOTAK_OTHERS, SBI_ANAND, SBI_PRASANNA } from '../constants';
import { SPRINGS } from '../meta';
const fs = require('fs')
let costSheetDetailsForomScr : any = {};
let bankDetailsFromScr : any = {};
let missingCount = 1 , mismatchCount = 1, costflag =1;
let scrCostSheet = new Map<any,any>()
let bankDetails = new Map<any, any>();
let systemcostsheet = new Map<any, any>()

test ("springs costsheet Data" , async () => {
    const ExcelJS = require(EXCELJS);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(SPRINGS.SCR_EXCEL);
    const worksheet = workbook.getWorksheet(SHEETS.MASTER_DATA);
    const worksheet1 = workbook.getWorksheet(SHEETS.RECEIVABLELOGS_DATA)

    let workbook1 = new ExcelJS.Workbook();
    let workbook2 = new ExcelJS.Workbook();
    await createFolder();
    const path = require(PATH);
    const filePath1 = path.join(__dirname, EXCELS.COSTSHEET);
    const filePath2 = path.join(__dirname, EXCELS.LOANDETAILS);
    if(fs.existsSync(filePath1))
        await workbook1.xlsx.readFile(filePath1);
    if(fs.existsSync(filePath2))
        await workbook2.xlsx.readFile(filePath2);
    
    const mismatchData = workbook1.addWorksheet(EXCELS.SPRINGS);
    const bank_details = workbook2.addWorksheet(EXCELS.SPRINGS)
    
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
    
    for(let i=6; i<rowcount; i++)
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
                infrastructure : row.getCell(40).value?.result??row.getCell(40).value,
                f_A : row.getCell(41).value?.result??row.getCell(41).value,
                carParking : row.getCell(42).value?.result??row.getCell(42).value,
                documentation : row.getCell(43).value, 
                totalamount : row.getCell(44).value?.result??row.getCell(44).value,
                gst : row.getCell(45).value?.result??0,
                grossAmount : row.getCell(46).value?.result??0,
                bankName : row.getCell(82).value,
                bankPOCName : row.getCell(83).value,
                pocContact : row.getCell(84).value,
                pocEmail : row.getCell(85).value?.text??row.getCell(85).value,
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
    for(let i=4; i< rowCount1; i++)
    {
        const row = worksheet1.getRow(i) ;
        bankDetailsFromScr = {
            sNo : row.getCell(1).value?.result??row.getCell(1).value,
            flatNumber : row.getCell(2).value ,
            accruedAmount : row.getCell(4).value?.result??0 ,
            bankName : row.getCell(8).value?.result??row.getCell(8).value,
        }

        if(bankDetailsFromScr.accruedAmount != 0 && bankDetailsFromScr.sNo >= 0)
        {
            //console.log(bankDetailsFromScr.bankName)
            bankDetails.set(String(bankDetailsFromScr.flatNumber) , {'bankName' : bankDetailsFromScr.bankName})
        }
        bankDetailsFromScr = {}
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
                                    mismatchData.addRow({
                                        sNo : mismatchCount++,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Basic Price',
                                        scr : scr_sheet.basicCost ,
                                        system : result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.TOTAL]
                                    });
                                    costflag = 0 ;
                                }
                            }
                            else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Floor Rise Charges' )
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
                            else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Premium'  || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Flat Premium' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Corner Premium Charges')
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
                                costsheet_types.f_a = scr_sheet.F_A_SYSTEM ;
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
                            else if(result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (back to back)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME] == 'Car Parking (Individual)' || result.data.saleParticulars.otherParticulars[0][RESPONSE.COSTS][c][RESPONSE.NAME]== '1 Car and 1 Bike Parking Charges')
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
                            costsheet_types.gst = scr_sheet.gst
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
                    if(result.data.saleDetails.paymentType == 'SELF') 
                    {
                        let bank_sheet = bankDetails.get(String(result.data[RESPONSE.FLATNUMBER]))
                       // console.log(bank_sheet)
                        if(bank_sheet && String(bank_sheet.bankName).trim() != 'SELF' && bank_sheet.bankName != null && bank_sheet.bankName != 'LL' && bank_sheet.bankName != '100% LL')
                        {
                            bank_details.addRow({
                                sNo : missingCount++ ,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Mismatch-Bank',
                                scr : bank_sheet.bankName,
                                system : result.data.saleDetails.paymentType
                            })
                        }
                    }
                    else if(result.data.saleDetails.paymentType == 'LOAN')
                    {
                        let bank_sheet = bankDetails.get(String(result.data[RESPONSE.FLATNUMBER]))
                        let bank_flag = result.data.saleDetails.bank.length;
                        if(bank_flag == 0 || String(bank_sheet.bankName).trim() == 'SELF' )
                        {
                            let bank = bank_sheet.bankName ;
                            if(bank_sheet.bankName == null)
                            bank = 'No bank'
                            bank_details.addRow({
                                sNo : missingCount++ ,
                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                Issue : 'Missing-Bank',
                                scr : String(bank_sheet.bankName),
                                system : 'No bank'
                            })
                        }
                        else 
                        {
                            let bank = '';
                            const bankFromScr = String(bank_sheet.bankName).toLowerCase().trim()
                            if(bankFromScr.includes(BANK.AXIS))
                            {
                                    bank = 'AXIS BANK LIMITED' ;
                                    
                                    if(result.data.loanDetails['poc'])
                                    {
                                        if(bankFromScr == 'axis-rajesh')
                                        {
                                        
                                            if(AXIS_RAJESH.POC_NAME != result.data.loanDetails['poc']['name'])
                                            {
                                                        bank_details.addRow({
                                                            sNo : missingCount++ ,
                                                            flatNo : result.data[RESPONSE.FLATNUMBER],
                                                            Issue : 'Mismatch-POCName',
                                                            scr : AXIS_RAJESH.POC_NAME,
                                                            system : result.data.loanDetails['poc']['name']
                                                        })
                                            }
                                            if(result.data.loanDetails['poc']['phoneNumber'] )
                                            {
                                                        if( AXIS_RAJESH.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                                        {
                                                            bank_details.addRow({
                                                                sNo : missingCount++ ,
                                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                                Issue : 'Mismatch-POCContact',
                                                                scr : AXIS_RAJESH.POC_CONTACT,
                                                                system : result.data.loanDetails['poc']['phoneNumber']
                                                            })
                                                        }
                                            }
                                            if(AXIS_RAJESH.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                            {
                                                        bank_details.addRow({
                                                            sNo : missingCount++ ,
                                                            flatNo : result.data[RESPONSE.FLATNUMBER],
                                                            Issue : 'Mismatch-POCEmail',
                                                            scr : AXIS_RAJESH.POC_EMAIL,
                                                            system : result.data.loanDetails['poc']['email']
                                                        })
                                            }
                                        }
                                       
                                    }
                                    else if(bankFromScr != 'axis-others' )
                                    {
                                        bank_details.addRow({
                                            sNo : missingCount++ ,
                                            flatNo : result.data[RESPONSE.FLATNUMBER],
                                            Issue : 'Poc not Tagged',
                                            scr : bank_sheet.bankName,
                                            system : 'not tagged'
                                        })
                                    }
                            }
                            else if(bankFromScr.includes(BANK.BHFL))
                            {
                                bank = 'BAJAJ HOUSING FINANCE LIMITED'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'bhfl')
                                    {
                                        
                                        if(BHFL.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : BHFL.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                           
                                            if(BHFL.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : BHFL.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(BHFL.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : BHFL.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                    else if(bankFromScr == 'bhfl-harish')
                                    {
                                        
                                        if(BHFL_HARISH.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : BHFL_HARISH.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                           
                                            if(BHFL_HARISH.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : BHFL_HARISH.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(BHFL_HARISH.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : BHFL_HARISH.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                }
                                else if( bankFromScr != 'bhfl-others')
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }
                            }
                            else if(bankFromScr.includes(BANK.BOB))
                            {
                                bank = 'BANK OF BARODA'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'bob' || bankFromScr == 'bob-prasanna')
                                    {
                                        if(BOB.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : BOB.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                            if( BOB.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : BOB.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(BOB.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : BOB.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                }
                                else if(bankFromScr != 'bob-others')
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }
                            }
                            else if(bankFromScr.includes(BANK.HDFC))
                            {
                                bank = 'HDFC LIMITED'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'hdfc-prasanna')
                                    {
                                        if(HDFC.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCName',
                                                    scr : HDFC.POC_NAME,
                                                    system : result.data.loanDetails['poc']['name']
                                                })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'] )
                                        {
                                            if(HDFC.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : HDFC.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(HDFC.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : HDFC.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                    else if(bankFromScr == 'hdfc-gopal')
                                    {
                                        if(HDFC_LTD.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCName',
                                                    scr : HDFC_LTD.POC_NAME,
                                                    system : result.data.loanDetails['poc']['name']
                                                })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'] )
                                        {
                                            if( HDFC_LTD.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                    bank_details.addRow({
                                                        sNo : missingCount++ ,
                                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                                        Issue : 'Mismatch-POCContact',
                                                        scr : HDFC_LTD.POC_CONTACT,
                                                        system : result.data.loanDetails['poc']['phoneNumber']
                                                    })
                                            }
                                        }
                                        if(HDFC_LTD.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCEmail',
                                                    scr : HDFC_LTD.POC_EMAIL,
                                                    system : result.data.loanDetails['poc']['email']
                                                })
                                        }
                                    }
                                }
                                else if(bankFromScr != 'hdfc-others' && bankFromScr != 'hdfc')
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }

                            }
                            else if(bankFromScr.includes(BANK.ICICI))
                            {
                                bank = 'ICICI BANK LTD'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'icici')
                                    {
                                        if(ICICI_SPRINGS.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : ICICI_SPRINGS.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'] )
                                        {
                                            if( ICICI_SPRINGS.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : ICICI_SPRINGS.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(ICICI_SPRINGS.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : ICICI_SPRINGS.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                }
                                else if(bankFromScr != 'icici-others')
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }
                            }
                            else if(bankFromScr.includes(BANK.KOTAK))
                            {
                                bank = 'KOTAK MAHINDRA BANK LTD'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'kotak')
                                    {
                                        if(KOTAK.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : KOTAK.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                            if( KOTAK.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : KOTAK.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                    }
                                        if(KOTAK.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : KOTAK.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                    else if( bankFromScr == 'kotak-others')
                                    {
                                        if(KOTAK_OTHERS.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : KOTAK_OTHERS.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                            if( KOTAK_OTHERS.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : KOTAK_OTHERS.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                    }
                                        if(KOTAK_OTHERS.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : KOTAK_OTHERS.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                }
                                else 
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }
                            }
                            else if(bankFromScr.includes(BANK.SBI))
                            {
                                bank = 'STATE BANK OF INDIA'
                                if(result.data.loanDetails['poc'])
                                {
                                    if(bankFromScr == 'sbi-anand' )
                                    {
                                        if(SBI_ANAND.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : SBI_ANAND.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                            if( SBI_ANAND.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : SBI_ANAND.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                    }
                                        if(SBI_ANAND.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : SBI_ANAND.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                    else if( bankFromScr == 'sbi-prasanna')
                                    {
                                    
                                        if(SBI_PRASANNA.POC_NAME != result.data.loanDetails['poc']['name'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCName',
                                                scr : SBI_PRASANNA.POC_NAME,
                                                system : result.data.loanDetails['poc']['name']
                                            })
                                        }
                                        if(result.data.loanDetails['poc']['phoneNumber'])
                                        {
                                            if( SBI_PRASANNA.POC_CONTACT != result.data.loanDetails['poc']['phoneNumber'].replaceAll(" ",""))
                                            {
                                                bank_details.addRow({
                                                    sNo : missingCount++ ,
                                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                                    Issue : 'Mismatch-POCContact',
                                                    scr : SBI_PRASANNA.POC_CONTACT,
                                                    system : result.data.loanDetails['poc']['phoneNumber']
                                                })
                                            }
                                        }
                                        if(SBI_PRASANNA.POC_EMAIL != result.data.loanDetails['poc']['email'])
                                        {
                                            bank_details.addRow({
                                                sNo : missingCount++ ,
                                                flatNo : result.data[RESPONSE.FLATNUMBER],
                                                Issue : 'Mismatch-POCEmail',
                                                scr : SBI_PRASANNA.POC_EMAIL,
                                                system : result.data.loanDetails['poc']['email']
                                            })
                                        }
                                    }
                                }
                                else if(bankFromScr != 'sbi' )
                                {
                                    bank_details.addRow({
                                        sNo : missingCount++ ,
                                        flatNo : result.data[RESPONSE.FLATNUMBER],
                                        Issue : 'Poc not Tagged',
                                        scr : bank_sheet.bankName,
                                        system : 'not tagged'
                                    })
                                }
                            }
                            else if(bankFromScr.includes(BANK.AIR_FORCE))
                            {
                                bank = 'AIR FORCE GROUP INS SOCIETY FUNDING'
                            }
                            else if(bankFromScr.includes(BANK.ONGC))
                            {
                                bank = 'ONGC'
                            }
                            else if(bankFromScr.includes(BANK.TCHFL))
                            {
                                bank = 'TCHFL'
                            }
                            
                            if(bank != result.data.saleDetails.bank[0]['name'])
                            {
                                bank_details.addRow({
                                    sNo : missingCount++ ,
                                    flatNo : result.data[RESPONSE.FLATNUMBER],
                                    Issue : 'Mismatch-Bank',
                                    scr : String(bank_sheet.bankName),
                                    system : result.data.saleDetails.bank[0]['name']
                                })
                            }

                     }
                }

            }
        }
    
    await workbook1.xlsx.writeFile(filePath1);
    await workbook2.xlsx.writeFile(filePath2);
      
}); 