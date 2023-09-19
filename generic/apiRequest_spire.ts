import axios from 'axios';
import { Authorization, SPIRE , currentUser} from '../meta';

const headers = {
    'Accept': 'application/json',
    'Authorization': Authorization,
    'currentUser' : currentUser,
    'projectId' : SPIRE.PROJECTID 
}

export const apiRequestFlatDetails = async () => {
    
    const url1 = `https://test.crmadmin.inncircles.com/api/flat/list-view`
    const response = await axios.get(url1,{ headers : headers})
    return response.data
}

export const apiRequestCollectionLogDetails = (async (flatID : string) => {
      
    const url = `https://test.crmadmin.inncircles.com/api/collection-log/${flatID}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.flat);
}); 

export const apiRequestSaleParticulars = (async () => {
    const url = `https://test.crmadmin.inncircles.com/api/collection-log?sortBy=%7B%22flatId%22:1%7D&filter=%7B%7D`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.collections);
}); 

export const apiRequestFlatCostSheetDetails = (async (flatID : string) => {
      
    const url = `https://test.crmadmin.inncircles.com/api/flat-details/${flatID}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data);
}); 

export const apiRequestReceiptLogs = (async (search_term : string) => {
    const filter = `filter=%7B%22skip%22:0,%22search_term%22:%22${search_term}%22%7D`;
    const limit = 'limit=10000';
    const sortBy = 'sortBy=%7B%22date%22:1%7D';
    const url = `https://test.crmadmin.inncircles.com/api/receipt-log?${filter}&${limit}&${sortBy}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.collections);
}); 

export const apiRequestmcd = (async () => {
    const url = `https://test.crmadmin.inncircles.com/api/mcd-screen?sortBy=%7B%22_id%22:1%7D&filter=%7B%7D`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.logs);
});
export const apiRequestDLNotshared = (async (type : string) => {
    const url = `https://test.crmadmin.inncircles.com/api/demand-letter-logs?sortBy=%7B%22date%22:-1%7D&filters=%7B%22notificationStatus%22:%22${type}%22,%22skip%22:0,%22limit%22:4000%7D`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.demandLogs);
});


export const apiRequestflatMilestone = (async (flatId : string) => {
    const url = `https://test.crmadmin.inncircles.com/api/flat-milestones?flatId=${flatId}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data);
});
export const createFolder =(async()=>{
    const fs = require('fs');
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    let newdate: string= year + "-" + month + "-" + day;
    const directoryPath = `tests/excelDownloads/${newdate}`;
    await fs.mkdirSync(directoryPath, { recursive: true });
})