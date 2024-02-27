import fs, { ReadStream } from 'fs'
import {parse} from 'csv-parse'

type node_read_cb = (this:ReadStream, row:string)=>void

export class NodeFileReader implements reader<node_read_cb>{

    constructor(readonly read_cb:node_read_cb){}

    public read(input: string, delimiter: string, from_line:number){

        fs.createReadStream(input)
            .pipe(parse({ delimiter, from_line}))
            .on("data", this.read_cb)
    }
}

class NodeFileWriter implements writer<any>{

    write(ops:any[]){}
}

export class ConsoleWriter implements writer<any>{

    write(ops:any[]){
        for(const op of ops)
            console.log(op)
    }
}