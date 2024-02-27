
interface StateMachine<state,operation> {
    readonly stateName:state,
    OnOff(op:operation): StateMachine<state,operation>
}

type stateFactory<state,operation> = (st:state)=>StateMachine<state,operation>