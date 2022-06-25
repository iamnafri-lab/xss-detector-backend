
const spawn = require("child_process").spawn;
let interfaces2 : string[]=[];

export const getInterfaces = async(parent : any, args: any,ctx : any, info : any) => {
    const pythonProcess = spawn('python3',["get_all_interfaces.py"]);
    pythonProcess.stdout.on('data', (data) => {
        let interfaces : string = data.toString();
        interfaces = interfaces.substring(1, interfaces.length - 2).replace(/\n/g, "").replace(/'/g, "").replace(/ /g,"");
        interfaces2 = interfaces.split(',');
    });
    return interfaces2;
}