import {expect , test} from '@playwright/test'
import { apiRequestDLNotshared, apiRequestFlatDetails, apiRequestReceiptLogs, apiRequestflatMilestone, apiRequestmcd, createFolder } from '../generic/apiRequest_spire';
import { EXCELS, RESPONSE, SHEETS, EXCELJS, HEADERS, PATH , } from '../constants';
import {  SPECTRA, SPIRE } from '../meta';
const fs = require('fs')
let mcdDetails : any = {};
let count_system = 1;
let misingReceiptCount = 1;
let mismatchmcdCount = 1 ;
let mcd_scr = new Map<any,any>() ; 
let mcd_system = new Map<any,any>() ; 
let spectraDL : any = {} ;


test ("spectra mcd Details" , async () => {
    const ExcelJS = require(EXCELJS);
    
    let response = await apiRequestDLNotshared('NOT_SHARED')
    for(let i =0; i< response.length;i++)
    {
        let mileston = response[i].milestone.length
        let date = new Date(response[i].date)
        if(mcd_scr.has(response[i].flat.flatNumber))
        {
           let current_flat = mcd_scr.get(response[i].flat.flatNumber)
           console.log(response[i].flat.flatNumber,date , current_flat['date'])
           if(current_flat['date'] < (date))
           {
            mcd_scr.set(String((response[i].flat.flatNumber)),{'milestone' : response[i].milestone[mileston-1] , 'date' : date, 'serial': response[i].serialNumber})
           }
        }
        else
        {
            mcd_scr.set(String((response[i].flat.flatNumber)),{'milestone' : response[i].milestone[mileston-1], 'date' : date, 'serial' : response[i].serialNumber})
        }
    }

    response = await apiRequestDLNotshared('SHARED')
    
    for(let i =0; i< 1000;i++)
    {
        let milestone = response[i].milestone.length
        if(mcd_system.has(response[i].flat.flatNumber))
        {
           let current_flat = mcd_system.get(response[i].flat.flatNumber)
           let date = new Date(response[i].date)
           console.log(response[i].flat.flatNumber,date , current_flat['date'])
           if(current_flat['date'] < (date))
           {
                mcd_system.set(String((response[i].flat.flatNumber)),{'milestone' : response[i].milestone[milestone-1] , 'date' : date, 'serial': response[i].serialNumber})
           }
        }
        else{
            let date = new Date(response[i].date)
            mcd_system.set(String((response[i].flat.flatNumber)),{'milestone' : response[i].milestone[milestone-1] , 'date' : date, 'serial': response[i].serialNumber})
        }
    }
    //console.log(mcd_system)
    // const res = await apiRequestFlatDetails();
    // for(let index=0; index< res.data.length ; index++)
    // {
    //     let flatID : string = res.data[index][RESPONSE.ID] ;
    //     const result = await apiRequestflatMilestone(flatID)
    //     for(let i = 0; i<result.length; i++ )
    //     {
            
    //         let flag = result[i].actualDate?1:0
    //         if(flag == 1)
    //         {
    //            mcd_scr.set(res.data[index].flatNumber, result[i].milestone.name )
    //         }
    //         else{
    //             flag = 0;
    //             break;
    //         }
    //     }
    // }      
    // console.log(mcd_system)
    for(const [key, value] of mcd_system.entries())
    {
        if(mcd_scr.has(key))
        {
            const dlmilestone = mcd_scr.get(key)
            if(dlmilestone['date']< value['date'])
            {
                console.log(key , 'not shared ' + dlmilestone['serial'] , 'shared ' + value['serial'] ,)// 'not shared date' + dlmilestone['date'] , 'shared date' + value['date'])
            }

        }
    }
}); 