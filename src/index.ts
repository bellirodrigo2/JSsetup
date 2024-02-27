import { PaperMachine } from "./paper_machine";
import {make_opt_t, PMOp} from './impl/pm_types'
import {BrowserFileReader, ConsoleWriter} from './io/browser_file'
import {PiWebReader} from './io/browser_pi'
import { BASE_URL, PM6_WEBID } from "./io/settings";

const breader = new BrowserFileReader(readFileOnLoad)    
const pireader = new PiWebReader(placeholder, BASE_URL, PM6_WEBID)

function placeholder(){
    //get http from piweb as [ts, op, ison], fazer make_opt e depois aplicar na pm.onoff
}

//tentar unificar readFileOnLoad e placeholder

const fileForm = document.getElementById("fileForm")  as HTMLInputElement | null 
if(!fileForm) throw new Error('No myForm element')

const csvFile = document.getElementById("csvFile") as HTMLInputElement | null 
if(!csvFile) throw new Error('No csvFile element')

fileForm.addEventListener("submit", (e:Event)=>{
        
    e.preventDefault();

    if(!csvFile.files)throw new Error('No csv file selected!')
    const input = csvFile.files[0];

    breader.read(input)

});

const PIForm = document.getElementById("PIForm")  as HTMLInputElement | null
if(!PIForm) throw new Error('No PIForm element')

const st = document.getElementById("startTime")  as HTMLInputElement | null
const et = document.getElementById("endTime")  as HTMLInputElement | null

PIForm.addEventListener("submit", (e:Event)=>{

    e.preventDefault()

    if(!st?.value) throw new Error(`Wrong StartTime Value: ${st?.value}`)
    if(!et?.value) throw new Error(`Wrong EndTime Value: ${et?.value}`)

    pireader.read([st.value, et.value])
})

//DEPOIS FAZER UM WRITER COM HTTP POST PARA TAG

//MANDAR ESSE PRO FILE_RW.ts COMO READER
//FAZER UM READER PARA O PI WEB API
function readFileOnLoad(e: ProgressEvent<FileReader>){

    const pm = new PaperMachine('paperProduction', [], new ConsoleWriter())

    if(!e.target) throw new Error('No e.target on File Load Event')
    const text = e.target.result as string;

    if(!text || text === '') throw new Error(`Text null or empty string: ${text}`)
    const lines_csv = text.split('\r\n')

    if(lines_csv.length <= 1) throw new Error('Csv File has one or less lines')    
    const headers=lines_csv.shift()!.split(";");
    
    const lines = []
    for(const line of lines_csv){

        const [ts, op, ison]= line.split(';')

        if(ts=='' || op =='' || ison=='') throw new Error('empty operation')
        lines.push(make_opt_t(new Date(ts),op as PMOp, ison == 'on'))
        // lines.push([ts,op,ison])
    };
    
    for(const lin of lines){
        // console.log(lin)
        pm.OnOff(lin)
    }
}