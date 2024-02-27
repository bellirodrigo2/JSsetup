import {states, pm_op} from './pm_types'


// paper production:
    // AnyDriveOn - ON -> REDUNDANTE *
    // AnyDriveOn - OFF  -> ERROR OU VAI CEHGAR 'PaperOn-OFF' E 'StockPump-OFF' EVENTO EM BREVE*
    // StockPumpOn - ON -> REDUNTANTE *,
    // StockPumpOn - OFF -> ERROR OU VAI CEHGAR 'PaperOn-OFF' EVENTO EM BREVE*
    // PaperOn - ON  -> REDUNDANTE *
    // PaperOn - OFF -> CHANGE STATE *
    
export const redundant_paperproduction: Array<pm_op> = [
    {
        operation: 'anyDrive',
        isOn: true
    },
    {        
        operation: 'stockPump',
        isOn: true
    },
    {        
        operation: 'paper',
        isOn: true
    }
]

export const impossible_paperproduction: Array<pm_op> = [
    {
        operation: 'anyDrive',
        isOn: false
    },
    {        
        operation: 'stockPump',
        isOn: false
    }
]

export const change_state_paperproduction:{op: pm_op, st: states}[] = [
    {
        op:{
            operation: 'paper',
            isOn: false
        },
        st: 'paperBreak'
    }
]

// paper break:
    // AnyDriveOn - ON -> REDUNDANTE *
    // AnyDriveOn - OFF  -> ERROR OU VAI CEHGAR 'PaperOn-OFF' E  'StockPump-OFF' EVENTO EM BREVE *
    // StockPumpOn - ON -> REDUNTANTE *
    // StockPumpOn - OFF -> CHANGE STATE  *
    // PaperOn - ON  -> CHANGE STATE *
    // PaperOn - OFF -> REDUNTANTE *

    export const redundant_paperbreak: Array<pm_op> = [
        {
            operation: 'anyDrive',
            isOn: true
        },
        {        
            operation: 'stockPump',
            isOn: true
        },
        {        
            operation: 'paper',
            isOn: false
        }
    ]
    
    export const impossible_paperbreak: Array<pm_op> = [
        {
            operation: 'anyDrive',
            isOn: false
        },
    ]
    
export const change_state_paperbreak:{op: pm_op, st: states}[] = [
    {
        op:{
            operation: 'paper',
            isOn: true
        },
        st: 'paperProduction'
    },
    {
        op:{
            operation: 'stockPump',
            isOn: false
        },
        st:'noStock'
    }
]

    // no stock:
    // AnyDriveOn - ON -> REDUNDANTE *
    // AnyDriveOn - OFF  -> CHANGE STATE *
    // StockPumpOn - ON -> CHANGE STATE *
    // StockPumpOn - OFF -> REDUNTANTE *
    // PaperOn - ON  -> ERROR OU VAI CEHGAR 'StockPump-ON' EVENTO EM BREVE *
    // PaperOn - OFF -> REDUNTANTE *
    
    export const redundant_nostock: Array<pm_op> = [
        {
            operation: 'anyDrive',
            isOn: true
        },
        {        
            operation: 'stockPump',
            isOn: false
        },
        {        
            operation: 'paper',
            isOn: false
        }
    ]
    
    export const impossible_nostock: Array<pm_op> = [
        {
            operation: 'paper',
            isOn: true
        },
    ]
    
    export const change_state_nostock:{op: pm_op, st: states}[] = [
        {
            op:{
                operation: 'anyDrive',
                isOn: false
            },
            st: 'onOutage'
        },
        {
            op:{
                operation: 'stockPump',
                isOn: true
            },
            st:'paperBreak'
        }
    ]
        
    // on outage:
    // AnyDriveOn - ON -> CHANGE STATE *
    // AnyDriveOn - OFF  -> REDUNTANTE *
    // StockPumpOn - ON -> ERRO OU VAI CHEGAR 'AnyDrive-ON ' EM BREVE, *
    // StockPumpOn - OFF -> REDUNTANTE *
    // PaperOn - ON  -> ERROR OU VAI CEHGAR 'AnyDrive-ON' E 'StockPump-ON' EVENTO EM BREVE *
    // PaperOn - OFF -> REDUNTANTE *
    
    export const redundant_onoutage: Array<pm_op> = [
        {
            operation: 'anyDrive',
            isOn: false
        },
        {        
            operation: 'stockPump',
            isOn: false
        },
        {        
            operation: 'paper',
            isOn: false
        }
    ]
    
    export const impossible_onoutage: Array<pm_op> = [
        {
            operation: 'stockPump',
            isOn: true
        },
        {
            operation: 'paper',
            isOn: true
        },
    ]
    
    export const change_state_onoutage:{op: pm_op, st: states}[] = [
        {
            op:{
                operation: 'anyDrive',
                isOn: true
            },
            st: 'noStock'
        },
        {
            op:{
                operation: 'stockPump',
                isOn: true
            },
            st:'paperBreak'
        }
    ]
