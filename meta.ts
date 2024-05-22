require('dotenv').config()
export const stage = process.env.stage
export const MAIN = {
    PROJECT : 'SPECTRA',
    SCR_EXCEL : 'SCR - ASBL Spectra as on 19-06-2023.xlsx',
    PROJECTID : '6348a680f18f5f2282196152',
}

export const SPRINGS = {
    PROJECT : 'SPRINGS',
    SCR_EXCEL : 'SCR - ASBL Springs as on 09-01-2024.xlsx',
    PROJECTID : '6348a680f18f5f2282196150',
}

export const SPECTRA = {
    PROJECT : 'SPECTRA',
    SCR_EXCEL : 'SCR - ASBL Spectra as on 09-01-2024.xlsx',
    PROJECTID : '6348a680f18f5f2282196152',
}

export const SPIRE = {
    PROJECT : 'SPIRE',
    SCR_EXCEL : 'SCR - ASBL Spire as on 09-01-2024.xlsx',
    PROJECTID : '6348a680f18f5f228219614e',
}

export const LOFT = {
    PROJECTID : '64ae8692f18f5f2282183683',
    PROJECT : 'LOFT'
}

export const Authorization = process.env.Authorization
export const currentUser = process.env.currentUser