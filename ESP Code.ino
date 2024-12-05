#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <map>  

// Wi-Fi credentials
const char* ssid = "Echoease";
const char* password = "Echoease";

const char* websiteURL = "http://192.168.0.150:3003/appliance-status";

// Create an AsyncWebServer object on port 80
AsyncWebServer server(80);
unsigned long lastPostTime =0;

// Map device IDs to GPIO pins
std::map<int, int> deviceMap = {
    {1, 2},  // Living Room Light connected to GPIO 2
    {2, 14}, // TV connected to GPIO 14
    {3, 13}, // Oven connected to GPIO 13
    {4, 12}  // Fan connected to GPIO 12
};

// Track device status (ON/OFF)
std::map<int, String> deviceStatus = {
    {1, "OFF"},
    {2, "OFF"},
    {3, "OFF"},
    {4, "OFF"}
};

void sendStatusTowebsitePost(){
  HTTPClient http;
  http.begin(websiteURL);
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<300> doc;
  JsonArray array = doc.to<JsonArray>();

    // Add each device status to the array
    for (const auto& [id, status] : deviceStatus) {
        JsonObject obj = array.createNestedObject();
        obj["id"] = id;
        obj["status"] = status;
    }


    String jsonPayload;
    serializeJson(doc, jsonPayload);  // Serialize JSON to string
    //Serial.println(jsonPayload);
    // Send the POST request
    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
        Serial.printf("POST Response from website: %d\n", httpResponseCode);
    } else {
        Serial.printf("Error on POST request to website: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();  // Close the connection
}



void setup() {
    Serial.begin(115200);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Configure GPIO pins as output and set initial state to LOW
    for (const auto& [id, pin] : deviceMap) {
        pinMode(pin, OUTPUT);
        digitalWrite(pin, LOW);  // Initially OFF
    }

    // Define a GET route to retrieve device status
    server.on("/get", HTTP_GET, [](AsyncWebServerRequest* request) {
        AsyncResponseStream *response = request->beginResponseStream("application/json");
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        StaticJsonDocument<200> doc;
        for (const auto& [id, status] : deviceStatus) {
            doc[String(id)] = status;  // Add device status to JSON
        }

        String responseStr;
        serializeJson(doc, responseStr);  // Serialize JSON to string
        response->print(responseStr);
        request->send(response);
    });

    // Handle POST requests with JSON body
    server.on("/post", HTTP_POST, [](AsyncWebServerRequest* request) {}, nullptr, [](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
        AsyncResponseStream *response = request->beginResponseStream("text/plain");
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        Serial.println("POST request received");

        // Parse JSON data
        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, data, len);

        if (error) {
            Serial.println("Failed to parse JSON");
            response->print("Invalid JSON format");
            request->send(response);
            return;
        }

        // Extract id and status from JSON
        if (doc.containsKey("id") && doc.containsKey("status")) {
            int id = doc["id"];
            String status = doc["status"];

            auto device = deviceMap.find(id);
            if (device != deviceMap.end()) {
                if (status == "ON") {
                    digitalWrite(device->second, HIGH); // Turn the device ON
                    deviceStatus[id] = "ON";
                    Serial.printf("Device %d set to ON\n", id);
                    response->print("Device " + String(id) + " is ON");
                } else if (status == "OFF") {
                    digitalWrite(device->second, LOW); // Turn the device OFF
                    deviceStatus[id] = "OFF";
                    Serial.printf("Device %d set to OFF\n", id);
                    response->print("Device " + String(id) + " is OFF");
                } else {
                    Serial.printf("Invalid status for device %d: %s\n", id, status.c_str());
                    response->print("Invalid status: " + status);
                }
            } else {
                Serial.printf("Device with ID %d not found\n", id);
                response->print("Device ID not found: " + String(id));
            }
        } else {
            Serial.println("Missing required parameters: id or status");
            response->print("Missing parameters: id or status");
        }
        request->send(response);
    });

    // Handle OPTIONS preflight requests (for CORS)
    server.on("/post", HTTP_OPTIONS, [](AsyncWebServerRequest* request){
        AsyncResponseStream *response = request->beginResponseStream("text/plain");
        response->addHeader("Access-Control-Allow-Origin", "*");
        response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        request->send(response);
    });

    // Start the server
    server.begin();
}

void loop() {
    // Send a POST request every 5 seconds
    unsigned long currentTime = millis();
    if (currentTime - lastPostTime >= 5000) {
        lastPostTime = currentTime;
        sendStatusTowebsitePost();
    }

}