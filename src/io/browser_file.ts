type browser_read_cb = (this: FileReader, ev: ProgressEvent<FileReader>) => any

export class BrowserFileReader implements reader<browser_read_cb>{

    private reader = new FileReader()

    constructor(readonly read_cb:browser_read_cb){
        this.reader.onload = read_cb
    }

    public read(input: File){
        this.reader.readAsText(input);
    }

}

class BrowserFileWriter implements writer<any>{

    write(ops:any[]){}
}

export class ConsoleWriter implements writer<any>{

    write(ops:any[]){
        for(const op of ops)
            console.log(op)
    }
}