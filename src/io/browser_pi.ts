//write values to PI using PI web api

//GET https://s5a9piweb01.sylvamo.com/PIwebapi/streamsets/{webId}/recorded
    //https://s5a9piweb01.sylvamo.com/PIwebapi/help/controllers/streamset/actions/getrecorded
//WebId: 
//PM6 - F1Em_v7LqlZaAkW49B2ZP1gZGgHzSUib6k7hGOrK3Ua0z4NgTU9HSSBHVUFDVVxURUNOT0xPR0lBXE1BQ0hJTkVTVEFURVxQTTZcU1RBVEU

export class PILogger implements writer<any>{

    write(co:any[] ):void{

    }        
}

export class PiWebReader implements async_reader<any>{

  private readonly headers = {
      'X-Requested-With': 'XmlHttpRequest',
      'Content-Type': 'application/json'
  }  

  constructor(
      private read_cb:(inputs: any[]) => any,
      private readonly base_url:string,
      private readonly webid:string
  ){}

  public async read(input: string[]){

      const get_http:Response = await this.get_http(input[0], input[1])

      console.log(await get_http.json())

      // const summary_array = this.make_array(get_http)

      // this.read_cb(this.remove_repeated(summary_array))

      return [get_http]
  }

  //fazer essas funções
  private remove_repeated(arr:any[]):any[]{return []}
  private make_array(rsp: Response):any[]{return []}

  private async get_http(st:string, et:string){

      const options = {
          method: 'GET',
          // headers: this.headers,
          // body: JSON.stringify(batch_request)
        }
      
        return await fetch(`${this.base_url}/streamsets/${this.webid}/recorded?startTime=${st}&endTime=${et}`, options)
  }
}



/**
 * 
 * export const BASE_URL = 'https://s5a9piweb01.sylvamo.com/piwebapi'
//const DB_URL = `${BASE_URL}/assetdatabases/F1RD_v7LqlZaAkW49B2ZP1gZGgLmZQM0zOF0WICzBl0UV-fwTU9HSSBHVUFDVVxQWVRIT05TQU5EQk9Y`
export const AF_PATH = '\\\\Mogi Guacu\\PythonSandBox\\'



const headers = {
  'X-Requested-With': 'XmlHttpRequest',
  'Content-Type': 'application/json'
}

export async function createView(url, attrs){

  ev.preventDefault()
  console.log('create view', ev.currentTarget.counter)
  // const user = ev.currentTarget.user
  // const url = `${user}/elements`

  const data = new FormData(ev.target);
  const element_name = data.get('view_title')
  const attribute = data.get('view_content')

  const json_attribute = JSON.parse(attribute)

  const body = JSON.stringify({
    'Name': element_name,
    'ExtendedProperties': {}
  })
  
  const attr1 = JSON.stringify(json_attribute)

  const batch_request = {
    "postEl": {
      "Method": "POST",
      "Resource": url,
      "Content": body,
    },
    "getEl": {
      "Method": "GET",
      "Resource": '$.postEl.Headers.Location',
      "ParentIds": [
        "postEl"
      ],
    },
    "createAttr":{
      "Method": "POST",
      "Resource": "$.getEl.Content.Links.Attributes",
      "Content": attr1,
      "ParentIds": [
        "getEl"
      ],
    }
  }
  
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(batch_request)
  }

  const response = await fetch(`${BASE_URL}/batch`, options)
  console.log(await response.json())

}

export async function getUser(){

  /*
  const batch_req = {
    'userinfo' : {
      "Method": "GET",
      "Resource": `${BASE_URL}/system/userinfo`,
    },
    'userElement':{
      "Method": "GET",
      "Resource": `${BASE_URL}/elements?path=${path}`,
      "ParentIds": [
        "userinfo"
      ]
    }
  }
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(batch_req)
  }
  
  const fetchUser = await fetch(`${BASE_URL}/system/userinfo`)
  const user = await fetchUser.json() 
  user['Name'] = user['Name'].replace("\\",'_')
  //generate fullpath for user element
  const fullpath = AF_PATH + user['Name']

  //save the element url in an variable
  const fetchUserElement = await fetch(`${BASE_URL}/elements?path=${fullpath}`)
  if(fetchUserElement.status == 404)
    console.log(`User '${user['Name']}' not identified`)
   //perguntar se quer criar um userElement

  //save the element url in an variable
  return await fetchUserElement.json()
}


export async function getAttributes(views_json, elementList){

  const elLinks = {}
  const elAttributes = {}
  const batch_attr = {}

  for(const el of views_json['Items']){
    const name = el['Name']
  
    //create an option html element for the select (drop box)
    const ele_child = document.createElement("option");
    ele_child.textContent = name
    ele_child.setAttribute('value', name)
    elementList.appendChild(ele_child)
  
    //save element webid
    elLinks[name] = el['Links']
  
    //create one request on the batch
    batch_attr[el['Name']] = {
      "Method": "GET",
      "Resource": `${el['Links']['Attributes']}`,
    }
  }
  
    //requesting Attributes for each element
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(batch_attr)
    }
    const attr = await fetch(`${BASE_URL}/batch`, options)
    const attr_json = await attr.json()
  
    for(const el in attr_json){
      const attrs = attr_json[el]['Content']['Items']
      const list_attr = []
      for(const attr of attrs)
        list_attr.push(attr['Name'])
      elAttributes[el] = list_attr
      }

    return [elLinks, elAttributes]
}

export async function getElements(parentElement){
  const views = await fetch(parentElement['Elements'])
  return await views.json()
}
 * 
 * 
 */
