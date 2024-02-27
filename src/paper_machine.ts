import {PMOp, states, pm_op_t, pm_op, pm_states_t, make_state_t} from './impl/pm_types'

import {
    redundant_paperproduction, impossible_paperproduction, change_state_paperproduction,
    redundant_paperbreak, impossible_paperbreak, change_state_paperbreak,
    redundant_nostock, impossible_nostock, change_state_nostock,
    redundant_onoutage, impossible_onoutage, change_state_onoutage
} from './impl/pm_operations'

import {AStateMachine, ImpossibleError, RedundantError} from './state_machine'

    //depois rodaer webpáck


export function pm_state_factory(st:states): AStateMachine<states, PMOp>{

    if(st == 'onOutage') return new OnOutage()
    if(st == 'noStock') return new NoStock()
    if(st == 'paperBreak') return new PaperBreak()
    if(st == 'paperProduction') return new PaperProduction()
    throw new Error('Cannot create a "NOSTATE" object')
}

export class PaperMachine implements StateMachine<states, pm_op_t>{

    readonly stateName: states = 'NOSTATE'
    private PMState: StateMachine<states,pm_op_t>

    constructor(
        initial_state: states,
        private readonly opArray: pm_op_t[],
        private readonly logger:writer<pm_states_t>
    ){
        this.PMState = pm_state_factory(initial_state)
    }

    public OnOff(op:pm_op_t): StateMachine<states,pm_op_t>{

        this.PMState = this.PMState.OnOff(op) 
        this.opArray.push(op)

        // console.log(this.opArray.length, op.record, op.timestamp)

        if(this.PMState.stateName == 'paperProduction')
            this.resume(this.opArray.splice(0,this.opArray.length))

        return this
    }

    private resume(opArray:pm_op_t[]){
        if(opArray.length < 2)
            throw new Error(`opArray should have at least 2 items but has ${opArray.length}`)

        //first state change to no 'paperProduction'
        const logOp:pm_states_t = make_state_t(opArray[0].timestamp, 'NOSTATE')

        if(opArray.some(e=> e.record.operation == 'anyDrive' && !e.record.isOn))
            logOp.record = 'onOutage'

        else if(opArray.some(e=> e.record.operation == 'stockPump' && !e.record.isOn))
            logOp.record = 'noStock'

        else logOp.record = 'paperBreak'
        
        //back to 'paperProduction'
        const paper:pm_states_t = make_state_t(opArray[opArray.length-1].timestamp,'paperProduction')

        this.logger.write([logOp, paper])

    }
}

class PaperMachineState_Impl extends AStateMachine<states, PMOp>{

    constructor(stateName:states, reduntant_array: pm_op[], impossible_array:pm_op[], change_state_array: {op: pm_op, st: states}[],){
        super(stateName, reduntant_array, impossible_array, change_state_array, pm_state_factory)
    }
}

class PaperProduction extends PaperMachineState_Impl{

    constructor(){
        super('paperProduction', redundant_paperproduction, impossible_paperproduction, change_state_paperproduction)
    }
}

class PaperBreak extends PaperMachineState_Impl{

    constructor(){
        super('paperBreak', redundant_paperbreak, impossible_paperbreak, change_state_paperbreak)
    }
}

class NoStock extends PaperMachineState_Impl{

    constructor(){
        super('noStock', redundant_nostock, impossible_nostock, change_state_nostock)
    }
}

class OnOutage extends PaperMachineState_Impl{

    constructor(){
        super('onOutage', redundant_onoutage, impossible_onoutage, change_state_onoutage)
    }
}
