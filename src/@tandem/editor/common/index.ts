import { ConsoleLogService, ReceiverService } from "./services";
import { ApplicationServiceProvider } from "@tandem/core";

export const createCommonEditorProviders = () => {
  return [
    new ApplicationServiceProvider("console", ConsoleLogService),
    new ApplicationServiceProvider("receiver", ReceiverService)
  ];
}

export * from "./services";
export * from "./actions";
export * from "./models";