import { MimeTypes } from "../constants";
import { TSJSModule } from "./js-module";
import {
  BaseModule,
  ModuleFactoryDependency,
  MimeTypes as CommonMimeTypes
} from "@tandem/common";


export const tsDomModuleFactoryDependency = new ModuleFactoryDependency(CommonMimeTypes.HTML, MimeTypes.TS, TSJSModule);