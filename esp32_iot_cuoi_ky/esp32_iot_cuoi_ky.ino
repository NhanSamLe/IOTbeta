

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// WiFi cấu hình
const char* ssid = "HANTRAN";
const char* password = "1234512345";
const char* wsServer = "192.168.45.65";
const uint16_t wsPort = 3002;
const char* wsPath = "/ws";

// OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Cảm biến siêu âm
const int trigPin1 = 5, echoPin1 = 18;
const int trigPin2 = 17, echoPin2 = 4;

// Relay, LED, Buzzer
const int RelayPins[] = {13, 25, 19, 0};
const int Led1 = 16, Led2 = 27;
const int Buzzer = 23;

// Nút nhấn
const int ButtonPins[] = {26, 32, 15, 33, 14, 12};
bool ButtonStates[6] = {0};
bool LastButtonStates[6] = {1};

// Ngưỡng cảnh báo
int dangerThreshold = 15;
int warningThreshold = 25;

WebSocketsClient webSocket;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 20;
float lastD1 = 0, lastD2 = 0;

void setup() {
  Serial.begin(115200);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Connecting WiFi...");
  display.display();

  pinMode(trigPin1, OUTPUT); pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT); pinMode(echoPin2, INPUT);
  for (int i = 0; i < 4; i++) pinMode(RelayPins[i], OUTPUT);
  pinMode(Buzzer, OUTPUT); pinMode(Led1, OUTPUT); pinMode(Led2, OUTPUT);
  for (int i = 0; i < 6; i++) pinMode(ButtonPins[i], INPUT_PULLUP);

  digitalWrite(Buzzer, LOW);
  digitalWrite(Led1, HIGH); digitalWrite(Led2, HIGH);
  for (int i = 0; i < 4; i++) digitalWrite(RelayPins[i], LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300); Serial.print(".");
  }

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi Connected");
  display.println(WiFi.localIP());
  display.display();

  webSocket.begin(wsServer, wsPort, wsPath);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(3000);
}

void loop() {
  webSocket.loop();
  readButtons();

  unsigned long now = millis();
  if (now - lastSendTime >= sendInterval) {
    lastSendTime = now;

    float d1 = measureDistance(trigPin1, echoPin1);
    float d2 = measureDistance(trigPin2, echoPin2);

    if (abs(d1 - lastD1) > 0.3 || abs(d2 - lastD2) > 0.3) {
      lastD1 = d1;
      lastD2 = d2;
      sendData(d1, d2);
    }

    handleBuzzer(d1, d2);
    handleLed(d1, d2);
    updateOLED(d1, d2);
  }
}

void sendData(float d1, float d2) {
  StaticJsonDocument<200> doc;
  doc["sensor1"] = d1;
  doc["sensor2"] = d2;
  JsonArray btnArr = doc.createNestedArray("buttons");
  for (int i = 0; i < 6; i++) btnArr.add(ButtonStates[i]);
  String json;
  serializeJson(doc, json);
  webSocket.sendTXT(json);
}

void readButtons() {
  for (int i = 0; i < 6; i++) {
    bool state = digitalRead(ButtonPins[i]) == LOW;
    if (state && LastButtonStates[i] == HIGH) {
      ButtonStates[i] = !ButtonStates[i];
      applyButtonState(i, ButtonStates[i]);
    }
    LastButtonStates[i] = !state ? HIGH : LOW;
  }

  // Luôn cập nhật trạng thái LED và Buzzer
  applyButtonState(4, ButtonStates[4]);
  applyButtonState(5, ButtonStates[5]);
}

void applyButtonState(int index, bool state) {
  if (index < 4) {
    digitalWrite(RelayPins[index], state ? HIGH : LOW);
  } else if (index == 4) {
    digitalWrite(Led1, state); digitalWrite(Led2, state);
  } else if (index == 5) {
    digitalWrite(Buzzer, state);
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_TEXT) {
    StaticJsonDocument<300> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (error) return;

    if (doc.containsKey("buttons")) {
      JsonArray arr = doc["buttons"];
      for (int i = 0; i < 6 && i < arr.size(); i++) {
        ButtonStates[i] = arr[i];
        applyButtonState(i, ButtonStates[i]);
      }
    }

    if (doc.containsKey("thresholds")) {
      dangerThreshold = doc["thresholds"]["danger"] | dangerThreshold;
      warningThreshold = doc["thresholds"]["warning"] | warningThreshold;
    }
  }
}

float measureDistance(int trig, int echo) {
  digitalWrite(trig, LOW); delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long duration = pulseInLong(echo, HIGH, 15000);
  return (duration == 0) ? 999 : (duration * 0.0343) / 2.0;
}

void handleBuzzer(float d1, float d2) {
  if (!ButtonStates[5]) { digitalWrite(Buzzer, LOW); return; }

  static unsigned long prevMillis = 0;
  static bool state = false;
  unsigned long now = millis();

  if (d1 < dangerThreshold || d2 < dangerThreshold) {
    if (now - prevMillis > 200) {
      prevMillis = now;
      state = !state;
      digitalWrite(Buzzer, state);
    }
  } else if (d1 < warningThreshold || d2 < warningThreshold) {
    if (now - prevMillis > 800) {
      prevMillis = now;
      state = !state;
      digitalWrite(Buzzer, state);
    }
  } else {
    digitalWrite(Buzzer, LOW);
  }
}

void handleLed(float d1, float d2) {
  if (!ButtonStates[4]) {
    digitalWrite(Led1, LOW); digitalWrite(Led2, LOW);
    return;
  }

  static unsigned long prevMillis = 0;
  static bool ledState = false;
  unsigned long now = millis();

  if (d1 < dangerThreshold || d2 < dangerThreshold) {
    digitalWrite(Led1, LOW); digitalWrite(Led2, LOW);
  } else if (d1 < warningThreshold || d2 < warningThreshold) {
    if (now - prevMillis >= 500) {
      prevMillis = now;
      ledState = !ledState;
      digitalWrite(Led1, ledState); digitalWrite(Led2, ledState);
    }
  } else {
    digitalWrite(Led1, HIGH); digitalWrite(Led2, HIGH);
  }
}

void updateOLED(float d1, float d2) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.printf("S1: %.1fcm | S2: %.1fcm\n", d1, d2);
  display.printf("LED: %s\n", ButtonStates[4] ? "ON" : "OFF");
  display.printf("BZR: %s\n", ButtonStates[5] ? "ON" : "OFF");
  display.printf("R: %d%d%d%d\n", ButtonStates[0], ButtonStates[1], ButtonStates[2], ButtonStates[3]);
  display.display();
}

