import * as EffectOtel from "@effect/opentelemetry"
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base"

// Set up tracing with the OpenTelemetry SDK
export function layer() {
  return EffectOtel.NodeSdk.layer(() => ({
    // resource: { serviceName: "example" },
    // Export span data to the console
    spanProcessor: new BatchSpanProcessor(
      new ConsoleSpanExporter(),
    ),
  }))
}
