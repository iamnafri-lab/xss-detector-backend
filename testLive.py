
# capture.py
import netifaces as ni
import pyshark as py
import sys
# print('#Hello from python#')
# print('Port:'+sys.argv[1]+'#')
# print('Second param:'+sys.argv[2]+'#')


# port = sys.argv[1]
# provided_interface = sys.argv[2]

port = "port 3002"
provided_interface = 'en0'

def returnRes(src, payload):
    print('{ "src" : "%s" , "payload" : %s, "attack" : true }'%(src, payload))

capture = py.LiveCapture(
    interface=provided_interface,
    bpf_filter=port
)

local_ip = ni.ifaddresses(provided_interface)[ni.AF_INET][0]['addr'] #en0 interface for wifi card on Mac. 

capture.sniff(timeout=10, packet_count=10)
if len(capture) > 0:
    for packet in capture:
        if str(packet.ip.dst) == str(local_ip):
            try:
                if packet.tcp.payload : 
                    payload = str(packet.tcp.payload).replace(":","")
                    bytes_object = bytes.fromhex(payload)
                    payload_string = bytes_object.decode("ASCII")
                    payload_string = payload_string.replace("\n","").replace("\r","").replace("''"," ")
                    payload_string = payload_string[payload_string.find("q=0.9")+5: ]
                    payload = payload_string
                    src = packet.ip.src
                    print('{ "src" : "%s" , "payload" : %s, "attack" : true }'%(src, payload))
            except:
                pass
    exit(12)