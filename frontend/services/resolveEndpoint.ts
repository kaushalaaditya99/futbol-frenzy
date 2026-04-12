import Constants from "expo-constants";
// stackoverflow.com/questions/60878000/what-ip-port-is-my-expo-app-using-with-react-native
// 'manifest' is deprecated which is why 'expoConfig' 
// is used.
export default function resolveEndpoint(endpoint: string) {
    // Apparently, this method does not work on web.
    // So, I've added localhost as it refers to the device.
    const computerIPV4Address = Constants.expoConfig?.hostUri?.split(':')[0] || "localhost";
    const URL = `http://${computerIPV4Address}:8000${endpoint}`;
    // console.log("Computer's IPV4 Address: ", computerIPV4Address);
    // console.log("URL: ", URL);
    return URL;
}

/* 
    In case the whole solution doesn't make any sense,
    here is how I understand it. I've worded it in simply
    and in first-person because it helps me walk understand
    it better.

    Idea Behind 0.0.0.0 Solution:
    I am running the Django server *on my computer* at the address 127.0.0.1:8000.
    This means that the Django server is listening for requests on 127.0.0.1 (localhost) at port 8000.
    This also means that the only device that can access the server is my computer!
    This is because 127.0.0.1 is an internal address which means it is inherently not accessible by other devices.
    This is not good because my phone needs to reach the Django server (and my phone is not my computer)!
    So, as of now, my phone cannot reach the server because it does not have access to my computer's internal (or private) address by design.
    Also remember that, as of now, Django is running locally on my computer.
    So, we open up Django to other devices by having it listen on 0.0.0.0:8000, which includes (1) my computer's public WiFi interface (192.168.1.238); and (2) localhost (127.0.0.1).
    This is good because devices outside of my computer can reach 192.168.1.238 because it is public!
    So, Django is now listening on 192.168.1.238:8000.
    Great! My phone can connect to 192.168.1.238 because this address is public.
    My phone connects to 192.168.1.238:8000 where Django is listening. 

    Idea Behind resolveEndpoint Solution:
    My computer has a different public WiFi address than your computer.
    Mine is 192.168.1.238.
    Let's say that yours is 135.225.90.80.
    Using "http://192.168.1.238:8000/api/drills" to access the Django server works for me.
    This is because *on my computer*, Django is listening on 192.168.1.238:8000.
    But, if YOU were to start the server, Django would be listening on YOUR public WiFi address, which is not 192.168.1.238:8000.
    So, the function would not work!
    So, we need a way to find the public WiFi address of the device running the Django server.
    This can be done by accessing a constant.
*/