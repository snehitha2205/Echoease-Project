#include <a23BD1A053C-project-1_inferencing.h>
#include <I2S.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// If your target is limited in memory remove this macro to save 10K RAM
#define EIDSP_QUANTIZE_FILTERBANK   0

#define SAMPLE_RATE 16000U
#define SAMPLE_BITS 16

DynamicJsonDocument request(200);
String str_request;
  
unsigned long lastCacheTime = 0;  // Store the last cache time
const unsigned long cacheInterval = 10000;  // 10 seconds in milliseconds

const char* ssid = "Echoease";
const char* password = "Echoease";
String serverURL = "http://192.168.0.130/post";

/** Audio buffers, pointers and selectors */
typedef struct {
    int16_t *buffer;
    uint8_t buf_ready;
    uint32_t buf_count;
    uint32_t n_samples;
} inference_t;

static inference_t inference;
static const uint32_t sample_buffer_size = 2048;
static signed short sampleBuffer[sample_buffer_size];
static bool debug_nn = false; // Set this to true to see e.g. features generated from the raw signal
static bool record_status = true;

void setupWifi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to Wi-Fi");
}

/**
 * @brief      Arduino setup function
 */
void setup() {
    Serial.begin(115200);
    while (!Serial);
    Serial.println("Edge Impulse Inferencing Demo");

    I2S.setAllPins(-1, 42, 41, -1, -1);
    if (!I2S.begin(PDM_MONO_MODE, SAMPLE_RATE, SAMPLE_BITS)) {
        Serial.println("Failed to initialize I2S!");
        while (1);
    }

    ei_printf("Inferencing settings:\n");
    ei_printf("\tInterval: ");
    ei_printf_float((float)EI_CLASSIFIER_INTERVAL_MS);
    ei_printf(" ms.\n");
    ei_printf("\tFrame size: %d\n", EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE);
    ei_printf("\tSample length: %d ms.\n", EI_CLASSIFIER_RAW_SAMPLE_COUNT / 16);
    ei_printf("\tNo. of classes: %d\n", sizeof(ei_classifier_inferencing_categories) / sizeof(ei_classifier_inferencing_categories[0]));

    ei_printf("\nStarting continuous inference in 2 seconds...\n");
    ei_sleep(2000);

    if (microphone_inference_start(EI_CLASSIFIER_RAW_SAMPLE_COUNT) == false) {
        ei_printf("ERR: Could not allocate audio buffer (size %d), this could be due to the window length of your model\r\n", EI_CLASSIFIER_RAW_SAMPLE_COUNT);
        return;
    }
    setupWifi();
    request["id"] = NULL;
    request["status"] = NULL;
    ei_printf("Recording...\n");
}

/**
 * @brief      Arduino main function. Runs the inferencing loop.
 */
void loop() {
    unsigned long currentMillis = millis();

    bool m = microphone_inference_record();
    if (!m) {
        ei_printf("ERR: Failed to record audio...\n");
        return;
    }

    signal_t signal;
    signal.total_length = EI_CLASSIFIER_RAW_SAMPLE_COUNT;
    signal.get_data = &microphone_audio_signal_get_data;
    ei_impulse_result_t result = { 0 };

    EI_IMPULSE_ERROR r = run_classifier(&signal, &result, debug_nn);
    if (r != EI_IMPULSE_OK) {
        ei_printf("ERR: Failed to run classifier (%d)\n", r);
        return;
    }

    // Print the predictions
    ei_printf("Predictions ");
    ei_printf("(DSP: %d ms., Classification: %d ms., Anomaly: %d ms.)",
               result.timing.dsp, result.timing.classification, result.timing.anomaly);
    ei_printf(": \n");
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
        ei_printf("    %s: ", result.classification[ix].label);
        ei_printf_float(result.classification[ix].value);
        ei_printf("\n");
    }

    if (result.classification[3].value > 0.6) {
        request["id"] = 1;
        request["status"] = "ON";
    } else if (result.classification[2].value > 0.6) {
        request["id"] = 1;
        request["status"] = "OFF";
    }

    if (request["id"] != NULL && request["status"] != NULL) {
        serializeJson(request, str_request);

        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");

        int httpResponseCode = http.POST(str_request);
        if (httpResponseCode == 200) {
            Serial.println("Command sent successfully");
        } else {
            Serial.println("Error sending command: " + String(httpResponseCode));
        }
        http.end();

        request["id"] = NULL;
        request["status"] = NULL;
    } else if ((request["id"] != NULL || request["status"] != NULL) && (currentMillis - lastCacheTime >= cacheInterval)) {
        request["id"] = NULL;
        request["status"] = NULL;
        lastCacheTime = currentMillis;
    }

#if EI_CLASSIFIER_HAS_ANOMALY == 1
    ei_printf("    anomaly score: ");
    ei_printf_float(result.anomaly);
    ei_printf("\n");
#endif
}

// Remaining functions unchanged (microphone_inference_start, microphone_inference_record, etc.)
// ...

static void audio_inference_callback(uint32_t n_bytes)
{
    for(int i = 0; i < n_bytes>>1; i++) {
        inference.buffer[inference.buf_count++] = sampleBuffer[i];

        if(inference.buf_count >= inference.n_samples) {
          inference.buf_count = 0;
          inference.buf_ready = 1;
        }
    }
}

static void capture_samples(void* arg) {

  const int32_t i2s_bytes_to_read = (uint32_t)arg;
  size_t bytes_read = i2s_bytes_to_read;

  while (record_status) {

    /* read data at once from i2s */
    esp_i2s::i2s_read(esp_i2s::I2S_NUM_0, (void*)sampleBuffer, i2s_bytes_to_read, &bytes_read, 100);

    if (bytes_read <= 0) {
      ei_printf("Error in I2S read : %d", bytes_read);
    }
    else {
        if (bytes_read < i2s_bytes_to_read) {
        ei_printf("Partial I2S read");
        }

        // scale the data (otherwise the sound is too quiet)
        for (int x = 0; x < i2s_bytes_to_read/2; x++) {
            sampleBuffer[x] = (int16_t)(sampleBuffer[x]) * 8;
        }

        if (record_status) {
            audio_inference_callback(i2s_bytes_to_read);
        }
        else {
            break;
        }
    }
  }
  vTaskDelete(NULL);
}

/**
 * @brief      Init inferencing struct and setup/start PDM
 *
 * @param[in]  n_samples  The n samples
 *
 * @return     { description_of_the_return_value }
 */
static bool microphone_inference_start(uint32_t n_samples)
{
    inference.buffer = (int16_t *)malloc(n_samples * sizeof(int16_t));

    if(inference.buffer == NULL) {
        return false;
    }

    inference.buf_count  = 0;
    inference.n_samples  = n_samples;
    inference.buf_ready  = 0;

//    if (i2s_init(EI_CLASSIFIER_FREQUENCY)) {
//        ei_printf("Failed to start I2S!");
//    }

    ei_sleep(100);

    record_status = true;

    xTaskCreate(capture_samples, "CaptureSamples", 1024 * 32, (void*)sample_buffer_size, 10, NULL);

    return true;
}

/**
 * @brief      Wait on new data
 *
 * @return     True when finished
 */
static bool microphone_inference_record(void)
{
    bool ret = true;

    while (inference.buf_ready == 0) {
        delay(10);
    }

    inference.buf_ready = 0;
    return ret;
}

/**
 * Get raw audio signal data
 */
static int microphone_audio_signal_get_data(size_t offset, size_t length, float *out_ptr)
{
    numpy::int16_to_float(&inference.buffer[offset], out_ptr, length);

    return 0;
}

/**
 * @brief      Stop PDM and release buffers
 */
static void microphone_inference_end(void)
{
    free(sampleBuffer);
    ei_free(inference.buffer);
}

//
//static int i2s_init(uint32_t sampling_rate) {
//  // Start listening for audio: MONO @ 8/16KHz
//  i2s_config_t i2s_config = {
//      .mode = (i2s_mode_t)(I2S_CHANNEL_MONO),
//      .sample_rate = sampling_rate,
//      .bits_per_sample = (i2s_bits_per_sample_t)16,
//      .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT,
//      .communication_format = I2S_COMM_FORMAT_I2S,
//      .intr_alloc_flags = 0,
//      .dma_buf_count = 8,
//      .dma_buf_len = 512,
//      .use_apll = false,
//      .tx_desc_auto_clear = false,
//      .fixed_mclk = -1,
//  };
//  i2s_pin_config_t pin_config = {
//      .bck_io_num = -1,    // IIS_SCLK 26
//      .ws_io_num = 42,     // IIS_LCLK 32
//      .data_out_num = -1,  // IIS_DSIN -1
//      .data_in_num = 41,   // IIS_DOUT 33
//  };
//  esp_err_t ret = 0;
//
//  ret = i2s_driver_install((i2s_port_t)1, &i2s_config, 0, NULL);
//  if (ret != ESP_OK) {
//    ei_printf("Error in i2s_driver_install");
//  }
//
//  ret = i2s_set_pin((i2s_port_t)1, &pin_config);
//  if (ret != ESP_OK) {
//    ei_printf("Error in i2s_set_pin");
//  }
//
//  ret = i2s_zero_dma_buffer((i2s_port_t)1);
//  if (ret != ESP_OK) {
//    ei_printf("Error in initializing dma buffer with 0");
//  }
//
//  return int(ret);
//}
//
//static int i2s_deinit(void) {
//    i2s_driver_uninstall((i2s_port_t)1); //stop & destroy i2s driver
//    return 0;
//}

#if !defined(EI_CLASSIFIER_SENSOR) || EI_CLASSIFIER_SENSOR != EI_CLASSIFIER_SENSOR_MICROPHONE
#error "Invalid model for current sensor."
#endif