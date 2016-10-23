import { SyntheticLocation } from "./location";
import { SyntheticRendererAction, SyntheticBrowserAction } from "./actions";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer, NoopRenderer } from "./renderers";
import {
  Action,
  IActor,
  bindable,
  Injector,
  isMaster,
  BubbleBus,
  Observable,
  TypeWrapBus,
  ChangeAction,
  findTreeNode,
  IObservable,
  Dependencies,
  bindProperty,
  watchProperty,
  HTML_MIME_TYPE,
  MainBusDependency,
  MimeTypeDependency,
  PropertyChangeAction,
  waitForPropertyChange,
} from "@tandem/common";

import {
  Bundle,
  Bundler,
  Sandbox,
  BundlerDependency,
} from "@tandem/sandbox";

import {
  SyntheticDOMCasterDependency,
  SyntheticDOMElementClassDependency,
} from "./dependencies";

import { WrapBus } from "mesh";

export interface ISyntheticBrowser extends IObservable {
  open(url: string): Promise<any>;
  window: SyntheticWindow;
  parent?: ISyntheticBrowser;
  renderer: ISyntheticDocumentRenderer;
  document: SyntheticDocument;
  dependencies: Dependencies;
  location: SyntheticLocation;
}

export abstract class BaseSyntheticBrowser extends Observable implements ISyntheticBrowser {

  private _url: string;
  private _window: SyntheticWindow;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;

  constructor(protected _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super();

    this._renderer = isMaster ? renderer || new SyntheticDOMRenderer() : new NoopRenderer();
    this._renderer.observe(new BubbleBus(this));
  }

  get document() {
    return this.window && this.window.document;
  }

  get dependencies() {
    return this._dependencies;
  }

  get location() {
    return this._location;
  }

  get window() {
    return this._window;
  }

  protected setWindow(value: SyntheticWindow) {
    const oldWindow = this._window;
    this._window = value;
    this._renderer.document = value.document;
    this.notify(new PropertyChangeAction("window", value, oldWindow));
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  async open(url: string) {
    if (this._url && this._url === url) {
      return;
    }
    this._url = url;
    this._location = new SyntheticLocation(url);
    await this.open2(url);
  }

  protected abstract async open2(url: string);
}

export class SyntheticBrowser extends BaseSyntheticBrowser {

  private _sandbox: Sandbox;
  private _entry: Bundle;
  private _bundler: Bundler;

  constructor(dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: ISyntheticBrowser) {
    super(dependencies, renderer);
    this._bundler = BundlerDependency.getInstance(this._dependencies);

    this._sandbox    = new Sandbox(dependencies, this.createSandboxGlobals.bind(this));

    watchProperty(this._sandbox, "exports", this.onSandboxExportsChange.bind(this));
    watchProperty(this._sandbox, "global", this.setWindow.bind(this));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  async open2(url: string) {
    this._entry = await this._bundler.bundle(url);
    this._sandbox.open(this._entry);
  }

  get document() {
    return this.window && this.window.document;
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const window = new SyntheticWindow(this, this.location);
    this._registerElementClasses(window.document);
    return window;
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassDependency.findAll(this._dependencies)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  private onSandboxExportsChange(exports: any) {
    const window = this._sandbox.global as SyntheticWindow;

    let exportsElement: SyntheticDOMNode;

    if (exports.nodeType) {
      exportsElement = exports;
    } else {
      console.warn(`Exported Sandbox object is not a synthetic DOM node.`);
    }

    if (exportsElement) {
      window.document.body.appendChild(exportsElement);
    }

    this.notify(new SyntheticBrowserAction(SyntheticBrowserAction.BROWSER_LOADED));
  }
}
