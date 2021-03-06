import { Observable, bindable, bubble, LogEvent, ObservableCollection } from "@tandem/common";
import { MergedCSSStyleRule } from "./merged-style-rule";


export class HTMLExtensionStore extends Observable {
  
  @bindable(true)
  @bubble()
  public mergedStyleRule: MergedCSSStyleRule;
}