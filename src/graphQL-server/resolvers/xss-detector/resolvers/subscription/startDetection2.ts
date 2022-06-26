import { pubsub } from "../../../../../app";
import { start1 } from "./startDetection";

const spawn = require("child_process").spawn;

export function start2(port: number , _interface : string){
    console.log("Funtion 2 Started");
    const python = spawn('python3', ["liveCapture.py",port, _interface]);
    python.stdout.on('data', function (data) {
        let dataToSend = data.toString();
        let obj : any;
        try{
            obj = JSON.parse(dataToSend);
            obj.payload = JSON.stringify(obj.payload);
            pubsub.publish("results", {startDetection : obj})
        }
        catch(err){
            console.log(err);
            start1(port, _interface);
        }
    });

    python.on('close', (code) => {
        console.log(`Funtion 2 Exitting with : ${code}`)
        start1(port, _interface);
        return
    });
}