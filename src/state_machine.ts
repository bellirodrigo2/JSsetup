
export type ONOFF = Boolean

export type op<operation> = {
    'operation': operation,
    'isOn' : ONOFF,
}

type timed<W> = {
    'timestamp': Date,
    'record': W
}

export type op_t<operations> = timed<op<operations>>
export type states_t<states> = timed<states>

export abstract class AStateMachine<states,operations> implements StateMachine<states,op_t<operations>>
{
    constructor(
        readonly stateName:states,
        private readonly reduntant_array: op<operations>[],
        private readonly impossible_array:op<operations>[],
        private readonly change_state_array: {op: op<operations>, st: states}[],
        protected readonly make_state: stateFactory<states,op_t<operations>>
        ){}
    public OnOff(op:op_t<operations>): StateMachine<states, op_t<operations>>{

        this.checkError(op)        
        this.checkRedundancy(op)
        return this.changeState(op)

    }

    private checkError(op:op_t<operations>):void{
        if(this.reduntant_array.some(e=> e.operation == op.record.operation && e.isOn == op.record.isOn))
            throw new RedundantError(`Redundant Operation: ${this.stateName}. Time: ${op.timestamp} Operation: ${op.record.operation} isON: ${op.record.isOn}`)
    }

    private checkRedundancy(op:op_t<operations>):void{
        if(this.impossible_array.some(e=> e.operation == op.record.operation && e.isOn == op.record.isOn))
        throw new ImpossibleError(`Impossible Operation: ${this.stateName}. Time: ${op.timestamp} Operation: ${op.record.operation} isON: ${op.record.isOn}`)
    }

    private changeState(op:op_t<operations>):StateMachine<states,op_t<operations>>{
        const state = this.change_state_array.find(e=> e.op.operation == op.record.operation && e.op.isOn == op.record.isOn)

        return state ? this.make_state(state.st) : this
    }
}

export class RedundantError extends Error {
    constructor(message:string) {
      super(message);
      this.name = 'redundant'
    }
}

export class ImpossibleError extends Error {
    constructor(message:string) {
      super(message);
      this.name = 'impossible'
    }
}