import axios from 'axios';

const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRkM2NmY2YxOGY1ZjIyODIxY2Q3ZjciLCJjb250YWN0TnVtYmVyIjoiKzkxODAwODcyMTc0NyIsIl9fdiI6MCwiY3JlYXRlZEF0IjoiMjAyMi0xMC0xN1QxMTozMTowOC45MjFaIiwiZW1haWwiOiJ5YW11bmEuYkBpbm5jaXJjbGVzLmNvbSIsImZpcnN0TmFtZSI6IllhbXVuYSIsImlzQWN0aXZlIjp0cnVlLCJsYXN0TmFtZSI6IkIiLCJtZXRhRGF0YSI6eyJkZXZpY2VzIjpbXX0sInByb2plY3RzIjpbIjYzNDhhNjgwZjE4ZjVmMjI4MjE5NjE0YyIsIjYzNDhhNjgwZjE4ZjVmMjI4MjE5NjE0ZSIsIjYzNDhhNjgwZjE4ZjVmMjI4MjE5NjE1MCIsIjYzNDhhNjgwZjE4ZjVmMjI4MjE5NjE1MiIsIjYzOWQwNjgwZjE4ZjVmMjI4MjUwOTJjZiJdLCJ1cGRhdGVkQXQiOiIyMDIyLTExLTA0VDA2OjQ3OjQxLjYxNloiLCJ1c2VyVHlwZSI6IlNZU19BRE1JTiIsInBhc3N3b3JkIjoiJDJiJDA0JGk0YWJYaTlXYmw1ekhHclBtMnZ3M3VETXBaTFE5b2dobk9ldlRlNDl3WE1FcnpOcy9jQTRHIiwiaWF0IjoxNjgxMzgzODg2LCJleHAiOjE2ODE5ODg2ODZ9.Rtqc4D7WQLL5KaCrF7nkaV0ydywEPlO-IschpTuLikg',
    'currentUser' : '634d3cfcf18f5f22821cd7f7',
    //'projectId' : '6348a680f18f5f2282196150'// springs 
     //'projectId' : '6348a680f18f5f228219614e' // spire
     'projectId' : '6348a680f18f5f2282196152' // spectra
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

export const apiRequestSaleParticulars = (async (flatNumber : string) => {
    const sortBy = `sortBy=%7B%221%22:1%7D`
    const filter = `filter=%7B%22search_term%22:%22${flatNumber}%22%7D`
    const url = `https://test.crmadmin.inncircles.com/api/collection-log?${sortBy}&${filter}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data.data.collections);
}); 

export const apiRequestFlatCostSheetDetails = (async (flatID : string) => {
      
    const url = `https://test.crmadmin.inncircles.com/api/flat-details/${flatID}`;  
    const response = await axios.get(url ,{ headers : headers});
    return ( response.data);
}); 