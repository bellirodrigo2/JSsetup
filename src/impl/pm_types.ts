import {ONOFF, op, op_t, states_t} from '../state_machine'

export type PMOp = 'anyDrive' | 'stockPump' | 'paper'

export type states = 'paperProduction' | 'paperBreak' | 'noStock' | 'onOutage' | 'NOSTATE'
export type pm_op = op<PMOp>

export type pm_op_t = op_t<PMOp>    
export type pm_states_t = states_t<states>     
        
export function make_opt_t(timestamp: Date, operation:PMOp, isOn:ONOFF):pm_op_t{return {'timestamp':timestamp, 'record':{'operation':operation, 'isOn':isOn}}}
export function make_state_t(timestamp: Date,state:states):pm_states_t{return {'timestamp':timestamp, 'record':state}}
