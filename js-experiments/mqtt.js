const fs = require("fs");
const path = require("path");
const mqtt = require("mqtt");

require("dotenv").config();
const { BBL_PRINTER, BBL_DEVICE_ID, BBL_ACCESS_CODE } = process.env;

const bblCA = fs.readFileSync(path.join(__dirname, "ca_cert.pem"));

function connectLocalMQTT(hostname, deviceID, accessCode) {
  return mqtt.connect({
    protocol: "mqtts",
    hostname,
    port: 8883,
    connectTimeout: 4e3,
    clean: true,
    username: "bblp",
    password: accessCode,
    servername: deviceID,
    ca: bblCA,
  });
}

let command = {
  print: {
    command: "project_file",
    url: "file:///sdcard/3DBenchy by Creative Tool.gcode.3mf",
    param: "Metadata/plate_1.gcode",
    subtask_id: "0",
    use_ams: true,
    timelapse: false,
    flow_cali: false,
    bed_leveling: true,
    layer_inspect: false,
    vibration_cali: false,
  },
};
let client = connectLocalMQTT(BBL_PRINTER, BBL_DEVICE_ID, BBL_ACCESS_CODE);
client.on("connect", () => {
  console.log("Connected to MQTT broker");
});
client.on("error", (err) => {
  console.error("MQTT error:", err);
});
client.subscribe("device/" + BBL_DEVICE_ID + "/report", (err) => {
  if (err) {
    console.error("Failed to subscribe:", err);
  } else {
    console.log("Subscribed to all topics");
    console.log("Publishing command:", command);
    client.publish(
      "device/" + BBL_DEVICE_ID + "/request",
      JSON.stringify(command)
    );
  }
});
client.on("message", (topic, message) => {
  console.log("Received message:", topic, JSON.parse(message.toString()));
});
