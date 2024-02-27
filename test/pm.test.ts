import { PaperMachine, pm_state_factory} from '../src/paper_machine'
import { pm_op_t, make_state_t, make_opt_t } from '../src/impl/pm_types'
import { ImpossibleError, RedundantError } from '../src/state_machine'
import {PILogger} from '../src/io/browser_pi'

//mocking the PI Logger
jest.mock('../src/io/browser_pi');
const MockedLogger = PILogger as jest.Mock<PILogger>;

let logger: PILogger;
let MockLoggerLog:(co: any[]) => void;

beforeEach(() => {
    logger = new MockedLogger()
    MockLoggerLog = MockedLogger.mock.instances[0].write;
    
});
afterEach(()=>{
    MockedLogger.mockClear();
})

const ts = new Date()

describe("Testing Base States", () => {

    const pp = pm_state_factory('paperProduction')
    const pb = pm_state_factory('paperBreak')
    const ns = pm_state_factory('noStock')
    const oo = pm_state_factory('onOutage')

    test("PaperProduction test", () => {

        //testing change state
        const breakState = pp.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':false}})
        expect(breakState.stateName).toEqual('paperBreak');

        //testing redundant errors
        expect(() => {pp.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':true}})}).toThrow(RedundantError);
        expect(() => {pp.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':true}})}).toThrow(RedundantError);
        expect(() => {pp.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':true}})}).toThrow(RedundantError);
    
        //testing impossible state errors
        expect(() => {pp.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':false}})}).toThrow(ImpossibleError);
        expect(() => {pp.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':false}})}).toThrow(ImpossibleError);
    });
    
    test("PaperBreak test", () => {

        //testing change state
        const paperState = pb.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':true}})
        expect(paperState.stateName).toEqual('paperProduction');
        const noStockState = pb.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':false}})
        expect(noStockState.stateName).toEqual('noStock');

        //testing redundant errors
        expect(() => {pb.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':true}})}).toThrow(RedundantError);
        expect(() => {pb.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':true}})}).toThrow(RedundantError);
        expect(() => {pb.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':false}})}).toThrow(RedundantError);
    
        //testing impossible state errors
        expect(() => {pb.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':false}})}).toThrow(ImpossibleError);
    });

    test("NoStock test", () => {

        //testing change state
        const paperBreakState = ns.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':true}})
        expect(paperBreakState.stateName).toEqual('paperBreak');
        const onOutageState = ns.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':false}})
        expect(onOutageState.stateName).toEqual('onOutage');

        //testing redundant errors
        expect(() => {ns.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':true}})}).toThrow(RedundantError);
        expect(() => {ns.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':false}})}).toThrow(RedundantError);
        expect(() => {ns.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':false}})}).toThrow(RedundantError);
    
        //testing impossible state errors
        expect(() => {ns.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':true}})}).toThrow(ImpossibleError);
    });
    
    test("OnOutage test", () => {

        //testing change state
        const onOutageState = oo.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':true}})
        expect(onOutageState.stateName).toEqual('noStock');

        //testing redundant errors
        expect(() => {oo.OnOff({'timestamp':ts,record: {'operation':'anyDrive','isOn':false}})}).toThrow(RedundantError);
        expect(() => {oo.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':false}})}).toThrow(RedundantError);
        expect(() => {oo.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':false}})}).toThrow(RedundantError);
    
        //testing impossible state errors
        expect(() => {oo.OnOff({'timestamp':ts,record: {'operation':'stockPump','isOn':true}})}).toThrow(ImpossibleError);
        expect(() => {oo.OnOff({'timestamp':ts,record: {'operation':'paper','isOn':true}})}).toThrow(ImpossibleError);
    });

})

describe("Testing Paper Machine States", () => {

    test("PaperProduction test change state", () => {

        const pm_pp_to_pb =  new PaperMachine('paperProduction',[],logger)

        //paper production to paper break
        pm_pp_to_pb.OnOff({'timestamp':ts, 'record':{'operation': 'paper', 'isOn':false}})

        //zero call to logger
        expect(MockLoggerLog).toHaveBeenCalledTimes(0);
    })

    test("PaperProduction test redundant", () => {

        const pm_pp =  new PaperMachine('paperProduction',[],logger)

        //redundants
        expect(()=>{pm_pp.OnOff({'timestamp':ts, 'record':{'operation': 'paper', 'isOn':true}})}).toThrow(RedundantError)
        expect(()=>{pm_pp.OnOff({'timestamp':ts, 'record':{'operation': 'stockPump', 'isOn':true}})}).toThrow(RedundantError)
        expect(()=>{pm_pp.OnOff({'timestamp':ts, 'record':{'operation': 'anyDrive', 'isOn':true}})}).toThrow(RedundantError)
        
        //expecatation on mock call - zero
        expect(MockLoggerLog).toHaveBeenCalledTimes(0);

    })

    test("PaperProduction test impossible state", () => {

        const pm_pp =  new PaperMachine('paperProduction',[],logger)

        //impossible
        expect(()=>{pm_pp.OnOff({'timestamp':ts, 'record':{'operation': 'stockPump', 'isOn':false}})}).toThrow(ImpossibleError)
        expect(()=>{pm_pp.OnOff({'timestamp':ts, 'record':{'operation': 'anyDrive', 'isOn':false}})}).toThrow(ImpossibleError)      
    
        //expectation on mock call - zero
        expect(MockLoggerLog).toHaveBeenCalledTimes(0);

    })

    test("PaperMachine change state test", () => {

        const pm_pb_to_pp =  new PaperMachine('paperProduction',[],logger)

        //paper break and back to paper production
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(0);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', true))
        expect(MockLoggerLog).toHaveBeenCalledTimes(1);
        expect(MockLoggerLog).toHaveBeenCalledWith([make_state_t(ts, 'paperBreak'),make_state_t(ts, 'paperProduction')])
        
        //paperproduction to no stock and back to paper production
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(1);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'stockPump', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(1);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'stockPump', true))
        expect(MockLoggerLog).toHaveBeenCalledTimes(1);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', true))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        expect(MockLoggerLog).toHaveBeenCalledWith([make_state_t(ts, 'noStock'), make_state_t(ts, 'paperProduction')])
        
        //paperproduction to on outage and back to paper production
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'stockPump', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'anyDrive', false))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'anyDrive', true))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'stockPump', true))
        expect(MockLoggerLog).toHaveBeenCalledTimes(2);
        pm_pb_to_pp.OnOff(make_opt_t(ts,'paper', true)) 
        expect(MockLoggerLog).toHaveBeenCalledTimes(3);
        expect(MockLoggerLog).toHaveBeenCalledWith([make_state_t(ts, 'onOutage'), make_state_t(ts, 'paperProduction')])
        
    })
})