interface writer<content>{
    write(co:content[] ):void
}

interface reader<callback>{
    read(...args : any[] ):any
    read_cb:callback
}

interface async_reader<content>{
    read(...args : any[]):Promise<content[]>
}
