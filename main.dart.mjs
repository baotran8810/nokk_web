// Compiles a dart2wasm-generated main module from `source` which can then
// be instantiated via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm module from `bytes` which is then
// instantiable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arguments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `use-load-ids` option is passed. Each load ID maps to
  //   one or more wasm files as specified in the emitted JSON file. It also
  //   takes a callback that should be invoked for each loaded module with 2
  //   arguments: (1) the module name, (2) the loaded module in a format
  //   supported by `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  //   The callback returns a Promise that resolves when the module is
  //   instantiated.
  //   loadDeferredId should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports, {loadDeferredModules, loadDeferredId} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            AB: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      AC: Function.prototype.call.bind(DataView.prototype.setUint16),
      AD: x0 => x0.width,
      AE: x0 => new ResizeObserver(x0),
      AF: x0 => x0.key,
      AG: (x0,x1) => x0.requestAnimationFrame(x1),
      AH: (x0,x1) => x0.writeText(x1),
      AI: (x0,x1) => { x0.min = x1 },
      AJ: (x0,x1) => { x0.src = x1 },
      AK: x0 => x0.readyState,
      AL: (x0,x1) => new OffscreenCanvas(x0,x1),
      AM: x0 => x0.appId,
      AN: x0 => x0.refreshToken,
      AO: x0 => globalThis.firebase_auth.signInAnonymously(x0),
      AP: (x0,x1) => { x0.volume = x1 },
      B: s => printToConsole(s),
      BB: b => !!b,
      BC: Function.prototype.call.bind(DataView.prototype.setUint8),
      BD: x0 => x0.screen,
      BE: (x0,x1) => x0.getPropertyValue(x1),
      BF: x0 => x0.identifier,
      BG: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      BH: x0 => x0.unlock(),
      BI: (x0,x1) => { x0.max = x1 },
      BJ: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      BK: (x0,x1) => { x0.timeout = x1 },
      BL: x0 => x0.allocationSize(),
      BM: x0 => x0.messagingSenderId,
      BN: x0 => x0.photoURL,
      BO: x0 => x0.currentUser,
      BP: (x0,x1) => { x0.loop = x1 },
      C: Function.prototype.call.bind(Number.prototype.toString),
      CB: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      CC: Function.prototype.call.bind(DataView.prototype.setInt8),
      CD: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      CE: x0 => globalThis.parseFloat(x0),
      CF: x0 => x0.touches,
      CG: x0 => x0.now(),
      CH: (x0,x1) => x0.lock(x1),
      CI: (x0,x1) => { x0.disabled = x1 },
      CJ: x0 => x0.naturalHeight,
      CK: x0 => new WebSocket(x0),
      CL: (x0,x1) => x0.copyTo(x1),
      CM: x0 => x0.authDomain,
      CN: x0 => x0.phoneNumber,
      CO: x0 => x0.tenantId,
      CP: (x0,x1) => { x0.crossOrigin = x1 },
      D: Function.prototype.call.bind(BigInt.prototype.toString),
      DB: (x0,x1) => x0.focus(x1),
      DC: Function.prototype.call.bind(DataView.prototype.getInt8),
      DD: x0 => x0.tabIndex,
      DE: (x0,x1) => x0.getComputedStyle(x1),
      DF: x0 => x0.pressure,
      DG: x0 => x0.performance,
      DH: x0 => x0.orientation,
      DI: (x0,x1) => { x0.scrollLeft = x1 },
      DJ: x0 => x0.naturalWidth,
      DK: (x0,x1) => new WebSocket(x0,x1),
      DL: (x0,x1) => { x0.height = x1 },
      DM: x0 => x0.projectId,
      DN: x0 => x0.lastSignInTime,
      DO: x0 => x0.call(),
      DP: (x0,x1) => { x0.preload = x1 },
      E: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      EB: () => ({}),
      EC: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      ED: (x0,x1) => x0.contains(x1),
      EE: x0 => x0.documentElement,
      EF: x0 => x0.tiltY,
      EG: (d, digits) => d.toFixed(digits),
      EH: (x0,x1) => x0.querySelector(x1),
      EI: (x0,x1) => { x0.spellcheck = x1 },
      EJ: x0 => x0.decode(),
      EK: x0 => x0.data,
      EL: (x0,x1) => { x0.width = x1 },
      EM: x0 => x0.name,
      EN: x0 => x0.creationTime,
      EO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      EP: x0 => x0.length,
      F: () => new Error().stack,
      FB: (o, p, v) => o[p] = v,
      FC: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      FD: x0 => x0.activeElement,
      FE: x0 => x0.computedStyleMap(),
      FF: x0 => x0.tiltX,
      FG: x0 => x0.maxHeight,
      FH: (x0,x1) => { x0.title = x1 },
      FI: (x0,x1) => { x0.disabled = x1 },
      FJ: (x0,x1) => { x0.decoding = x1 },
      FK: (x0,x1) => { x0.binaryType = x1 },
      FL: (x0,x1) => x0.toDataURL(x1),
      FM: x0 => x0.message,
      FN: x0 => x0.metadata,
      FO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      FP: x0 => x0.getReader(),
      G: s => JSON.stringify(s),
      GB: () => [],
      GC: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      GD: x0 => x0.parentNode,
      GE: (x0,x1) => x0.get(x1),
      GF: x0 => x0.pointerType,
      GG: x0 => x0.maxWidth,
      GH: (x0,x1) => x0.vibrate(x1),
      GI: (x0,x1) => x0.querySelectorAll(x1),
      GJ: (x0,x1) => { x0.crossOrigin = x1 },
      GK: x0 => x0.binaryType,
      GL: (x0,x1,x2,x3) => x0.drawImage(x1,x2,x3),
      GM: x0 => x0.code,
      GN: x0 => x0.isAnonymous,
      GO: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      GP: x0 => x0.value,
      H: Function.prototype.call.bind(Number.prototype.toString),
      HB: (a, i) => a.push(i),
      HC: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      HD: x0 => x0.tagName,
      HE: (o, p) => p in o,
      HF: x0 => x0.pointerId,
      HG: x0 => x0.minHeight,
      HH: x0 => x0.arrayBuffer(),
      HI: (x0,x1,x2) => x0.insertAdjacentHTML(x1,x2),
      HJ: (x0,x1) => x0.createObjectURL(x1),
      HK: x0 => x0.close(),
      HL: (x0,x1) => x0.getContext(x1),
      HM: x0 => x0.name,
      HN: x0 => x0.emailVerified,
      HO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      HP: x0 => x0.done,
      I: Function.prototype.call.bind(String.prototype.indexOf),
      IB: x0 => new Int8Array(x0),
      IC: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      ID: x0 => x0.target,
      IE: (x0,x1) => { x0.textContent = x1 },
      IF: x0 => x0.getCoalescedEvents(),
      IG: x0 => x0.minWidth,
      IH: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof ArrayBuffer) return 1;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 2;
        }
        return 3;
      },
      II: (x0,x1) => x0.removeChild(x1),
      IJ: x0 => x0.URL,
      IK: (x0,x1) => x0.send(x1),
      IL: x0 => x0.format,
      IM: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      IN: x0 => x0.email,
      IO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      IP: x0 => x0.read(),
      J: (s, p, i) => s.lastIndexOf(p, i),
      JB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      JC: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      JD: x0 => x0.clientY,
      JE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      JF: (x0,x1) => x0.getModifierState(x1),
      JG: (x0,x1) => x0.removeProperty(x1),
      JH: x0 => x0.status,
      JI: (x0,x1) => x0.item(x1),
      JJ: x0 => new Blob(x0),
      JK: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      JL: x0 => x0.canvasKitMaximumSurfaces,
      JM: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      JN: x0 => x0.displayName,
      JO: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      JP: x0 => x0.body,
      K: o => o,
      KB: x0 => new Uint8Array(x0),
      KC: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      KD: x0 => x0.clientX,
      KE: x0 => x0.matches,
      KF: s => s.trimLeft(),
      KG: (x0,x1) => x0.add(x1),
      KH: (x0,x1) => x0.fetch(x1),
      KI: x0 => x0.length,
      KJ: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      KK: (a, s, e) => a.slice(s, e),
      KL: x0 => x0.nextSibling,
      KM: x0 => globalThis.firebase_core.initializeApp(x0),
      KN: x0 => globalThis.firebase_auth.multiFactor(x0),
      KO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      KP: x0 => x0.assetBase,
      L: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      LB: x0 => new Uint8ClampedArray(x0),
      LC: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      LD: (x0,x1,x2) => x0.setAttribute(x1,x2),
      LE: (x0,x1) => x0.matchMedia(x1),
      LF: s => s.toUpperCase(),
      LG: x0 => x0.data,
      LH: x0 => x0.content,
      LI: x0 => x0.body,
      LJ: x0 => new window.ImageDecoder(x0),
      LK: x0 => x0.size,
      LL: (x0,x1) => x0.debug(x1),
      LM: x0 => x0.storageBucket,
      LN: x0 => x0.toJSON(),
      LO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      LP: x0 => x0.loader,
      M: x0 => x0.index,
      MB: x0 => new Int16Array(x0),
      MC: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      MD: x0 => x0.getBoundingClientRect(),
      ME: x0 => x0.matches,
      MF: x0 => x0.pop(),
      MG: (x0,x1) => { x0.scrollTop = x1 },
      MH: x0 => x0.document,
      MI: () => globalThis.document,
      MJ: x0 => x0.name,
      MK: x0 => x0.send(),
      ML: x0 => x0.baseURI,
      MM: x0 => x0.databaseURL,
      MN: x0 => x0.user,
      MO: x0 => x0.token,
      MP: () => globalThis._flutter,
      N: o => String(o),
      NB: x0 => new Uint16Array(x0),
      NC: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      ND: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      NE: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      NF: x0 => x0.flags,
      NG: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      NH: () => typeof dartUseDateNowForTicks !== "undefined",
      NI: x0 => x0.head,
      NJ: x0 => x0.repetitionCount,
      NK: x0 => x0.type,
      NL: x0 => x0.hostElement,
      NM: x0 => x0.apiKey,
      NN: x0 => x0.idToken,
      NO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      O: o => o === undefined,
      OB: x0 => new Int32Array(x0),
      OC: (x0,x1) => x0.querySelector(x1),
      OD: s => new Date(s * 1000).getTimezoneOffset() * 60,
      OE: f => f.dartFunction,
      OF: (a, s) => a.join(s),
      OG: (x0,x1) => { x0.value = x1 },
      OH: () => Date.now(),
      OI: (map, o, v) => map.set(o, v),
      OJ: x0 => x0.frameCount,
      OK: x0 => x0.response,
      OL: x0 => x0.location,
      OM: x0 => x0.options,
      ON: x0 => x0.secret,
      OO: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      P: (x0,x1) => x0.exec(x1),
      PB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      PC: (x0,x1) => x0.item(x1),
      PD: Date.now,
      PE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PF: (x0,x1) => x0.error(x1),
      PG: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      PH: () => 1000 * performance.now(),
      PI: (map, o) => map.get(o),
      PJ: x0 => x0.selectedTrack,
      PK: x0 => x0.vendor,
      PL: (x0,x1) => x0.getModifierState(x1),
      PM: x0 => globalThis.firebase_core.getApp(x0),
      PN: x0 => x0.accessToken,
      PO: (x0,x1,x2) => globalThis.firebase_app_check.onTokenChanged(x0,x1,x2),
      Q: (x0,x1) => { x0.lastIndex = x1 },
      QB: x0 => new Uint32Array(x0),
      QC: x0 => x0.length,
      QD: (handle) => clearTimeout(handle),
      QE: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      QF: () => globalThis.console,
      QG: (x0,x1) => { x0.value = x1 },
      QH: x0 => x0.debugSkipFontRetryDelay,
      QI: () => new WeakMap(),
      QJ: x0 => x0.completed,
      QK: x0 => x0.navigator,
      QL: x0 => x0.metaKey,
      QM: () => globalThis.firebase_core.getApp(),
      QN: x0 => x0.signInMethod,
      QO: x0 => new firebase_app_check.ReCaptchaV3Provider(x0),
      R: o => o,
      RB: x0 => new Float32Array(x0),
      RC: (x0,x1) => x0.querySelectorAll(x1),
      RD: (x0,x1) => x0.closest(x1),
      RE: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      RF: s => s.trimRight(),
      RG: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      RH: x0 => new Uint8Array(x0),
      RI: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      RJ: x0 => x0.ready,
      RK: () => new FileReader(),
      RL: x0 => x0.altKey,
      RM: () => globalThis.firebase_core.SDK_VERSION,
      RN: x0 => x0.providerId,
      RO: x0 => new firebase_app_check.ReCaptchaEnterpriseProvider(x0),
      S: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      SB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      SC: (x0,x1) => x0.getAttribute(x1),
      SD: x0 => x0.bottom,
      SE: (o, i) => o[i],
      SF: x0 => x0.blur(),
      SG: x0 => x0.value,
      SH: (x0,x1,x2) => x0.set(x1,x2),
      SI: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      SJ: x0 => x0.tracks,
      SK: (x0,x1) => x0.readAsArrayBuffer(x1),
      SL: x0 => x0.ctrlKey,
      SM: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      SN: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      SO: x0 => ({provider: x0}),
      T: o => o instanceof RegExp,
      TB: x0 => new Float64Array(x0),
      TC: x0 => x0.remove(),
      TD: x0 => x0.top,
      TE: o => o.length,
      TF: x0 => x0.button,
      TG: x0 => x0.selectionDirection,
      TH: x0 => x0.buffer,
      TI: (o, p) => p in o,
      TJ: x0 => x0.close(),
      TK: x0 => x0.result,
      TL: x0 => x0.isComposing,
      TM: x0 => x0.sessionStorage,
      TN: x0 => x0.username,
      TO: (x0,x1) => globalThis.firebase_app_check.initializeAppCheck(x0,x1),
      U: (string, times) => string.repeat(times),
      UB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      UC: (x0,x1) => x0.appendChild(x1),
      UD: x0 => x0.right,
      UE: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      UF: x0 => x0.innerHeight,
      UG: x0 => x0.selectionStart,
      UH: x0 => x0.wasmMemory,
      UI: x0 => x0.groups,
      UJ: (x0,x1) => ({frameIndex: x0,completeFramesOnly: x1}),
      UK: (x0,x1) => x0.getRandomValues(x1),
      UL: x0 => x0.code,
      UM: (x0,x1) => x0.debug(x1),
      UN: x0 => x0.providerId,
      UO: (x0,x1) => globalThis.firebase_app_check.getToken(x0,x1),
      V: o => o,
      VB: x0 => new ArrayBuffer(x0),
      VC: (x0,x1) => x0.append(x1),
      VD: x0 => x0.left,
      VE: x0 => x0.language,
      VF: x0 => x0.innerWidth,
      VG: x0 => x0.selectionEnd,
      VH: () => globalThis.window._flutter_skwasmInstance,
      VI: (a, i) => a.splice(i, 1),
      VJ: (x0,x1) => x0.decode(x1),
      VK: () => globalThis.crypto,
      VL: x0 => x0.repeat,
      VM: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      VN: x0 => x0.profile,
      VO: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
      W: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      WB: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      WC: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      WD: x0 => x0.clientY,
      WE: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      WF: x0 => x0.height,
      WG: x0 => x0.value,
      WH: x0 => x0.fontFallbackBaseUrl,
      WI: a => a.pop(),
      WJ: x0 => x0.displayHeight,
      WK: l => new DataView(new ArrayBuffer(l)),
      WL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      WM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      WN: x0 => x0.isNewUser,
      WO: (x0,x1) => globalThis.firebase_analytics.initializeAnalytics(x0,x1),
      X: x0 => x0.dotAll,
      XB: (x0,x1,x2) => new DataView(x0,x1,x2),
      XC: x0 => x0.style,
      XD: x0 => x0.clientX,
      XE: () => globalThis.window.FinalizationRegistry,
      XF: x0 => x0.width,
      XG: x0 => x0.selectionDirection,
      XH: (x0,x1,x2) => x0.slice(x1,x2),
      XI: () => new AbortController(),
      XJ: x0 => x0.displayWidth,
      XK: x0 => x0.abort(),
      XL: x0 => x0.userAgent,
      XM: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      XN: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      XO: (x0,x1) => globalThis.firebase_analytics.setAnalyticsCollectionEnabled(x0,x1),
      Y: x0 => x0.unicode,
      YB: (o, p) => o[p],
      YC: x0 => x0.debugShowSemanticsNodes,
      YD: x0 => x0.changedTouches,
      YE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      YF: x0 => x0.clientHeight,
      YG: x0 => x0.selectionStart,
      YH: (x0,x1) => x0.decode(x1),
      YI: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      YJ: x0 => x0.duration,
      YK: (a, l) => a.length = l,
      YL: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      YM: (x0,x1,x2) => x0.createPolicy(x1,x2),
      YN: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      YO: x0 => x0.maxTouchPoints,
      Z: x0 => x0.ignoreCase,
      ZB: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      ZC: (x0,x1) => x0.warn(x1),
      ZD: x0 => x0.offsetY,
      ZE: x0 => new window.FinalizationRegistry(x0),
      ZF: x0 => x0.clientWidth,
      ZG: x0 => x0.selectionEnd,
      ZH: (x0,x1) => x0.adoptText(x1),
      ZI: (x0,x1) => globalThis.fetch(x0,x1),
      ZJ: x0 => x0.image,
      ZK: x0 => x0.decode(),
      ZL: (x0,x1) => x0.getItem(x1),
      ZM: (x0,x1) => x0.createScriptURL(x1),
      ZN: x0 => x0.session,
      ZO: x0 => x0.hardwareConcurrency,
      a: x0 => x0.multiline,
      aB: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      aC: x0 => x0.console,
      aD: x0 => x0.offsetX,
      aE: (x0,x1) => x0.unregister(x1),
      aF: (x0,x1) => { x0.content = x1 },
      aG: x0 => x0.keyCode,
      aH: x0 => x0.first(),
      aI: (x0,x1) => x0.get(x1),
      aJ: () => globalThis.window.ImageDecoder,
      aK: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      aL: x0 => x0.localStorage,
      aM: (x0,x1,x2) => x0.createScript(x1,x2),
      aN: x0 => x0.phoneNumber,
      aO: x0 => x0.vendorSub,
      b: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      bB: o => o.byteOffset,
      bC: () => globalThis.window,
      bD: x0 => x0.type,
      bE: (x0,x1) => x0.contains(x1),
      bF: (x0,x1) => { x0.name = x1 },
      bG: (x0,x1) => x0.scrollIntoView(x1),
      bH: x0 => x0.next(),
      bI: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1,x2) { return wasmFunction(f,arguments.length,x0,x1,x2) }),
      bJ: x0 => new WeakRef(x0),
      bK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      bL: (x0,x1) => x0.key(x1),
      bM: (x0,x1) => x0.appendChild(x1),
      bN: x0 => x0.uid,
      bO: x0 => x0.productSub,
      c: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      cB: o => o.buffer,
      cC: (o, c) => o instanceof c,
      cD: x0 => x0.maxTouchPoints,
      cE: (s) => +s,
      cF: x0 => x0.head,
      cG: x0 => x0.multiViewEnabled,
      cH: x0 => x0.current(),
      cI: (x0,x1) => x0.forEach(x1),
      cJ: x0 => x0.deref(),
      cK: (x0,x1,x2) => x0.addEventListener(x1,x2),
      cL: x0 => x0.length,
      cM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      cN: x0 => x0.enrollmentTime,
      cO: x0 => x0.product,
      d: (x0,x1) => x0.didCreateEngineInitializer(x1),
      dB: Function.prototype.call.bind(DataView.prototype.getUint8),
      dC: (x0,x1) => x0[x1],
      dD: x0 => x0.platform,
      dE: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      dF: (x0,x1) => x0.removeChild(x1),
      dG: (x0,x1) => x0.replaceWith(x1),
      dH: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      dI: x0 => x0.name,
      dJ: () => globalThis.WeakRef,
      dK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      dL: (x0,x1) => x0.removeItem(x1),
      dM: (o, p) => delete o[p],
      dN: x0 => x0.factorId,
      dO: x0 => x0.platform,
      e: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      eB: (b, o) => new DataView(b, o),
      eC: x0 => x0.length,
      eD: x0 => x0.body,
      eE: s => s.trim(),
      eF: x0 => x0.firstChild,
      eG: (x0,x1) => { x0.type = x1 },
      eH: x0 => x0.v8BreakIterator,
      eI: x0 => x0.statusText,
      eJ: (a, s, e) => a.splice(s, e),
      eK: x0 => x0.send(),
      eL: (x0,x1,x2) => x0.setItem(x1,x2),
      eM: (o, p, v) => o[p] = v,
      eN: x0 => x0.displayName,
      eO: x0 => x0.languages,
      f: (wasmFunction,f) => finalizeWrapper(f, function() { return wasmFunction(f,arguments.length) }),
      fB: (b, o, l) => new DataView(b, o, l),
      fC: (string, token) => string.split(token),
      fD: () => globalThis.document,
      fE: x0 => x0.classList,
      fF: x0 => x0.viewConstraints,
      fG: (x0,x1) => { x0.className = x1 },
      fH: () => globalThis.Intl,
      fI: x0 => x0.url,
      fJ: o => o.byteLength,
      fK: x0 => x0.status,
      fL: (x0,x1) => x0.canShare(x1),
      fM: (x0,x1) => { x0.text = x1 },
      fN: x0 => x0.hints,
      fO: x0 => x0.language,
      g: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      gB: Function.prototype.call.bind(DataView.prototype.getFloat64),
      gC: o => o instanceof Array,
      gD: (x0,x1,x2) => x0.addEventListener(x1,x2),
      gE: x0 => x0.preventDefault(),
      gF: x0 => x0.hostElement,
      gG: (x0,x1) => { x0.tabIndex = x1 },
      gH: (x0,x1) => x0.segment(x1),
      gI: x0 => x0.status,
      gJ: (a, i) => a.splice(i, 1)[0],
      gK: x0 => x0.response,
      gL: (x0,x1) => x0.share(x1),
      gM: (x0,x1) => { x0.text = x1 },
      gN: x0 => x0.tenantId,
      gO: x0 => x0.deviceMemory,
      h: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      hB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      hC: (a, i) => a[i],
      hD: x0 => x0.hasFocus(),
      hE: x0 => x0.parent,
      hF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      hG: (x0,x1) => { x0.name = x1 },
      hH: x0 => x0.index,
      hI: x0 => x0.getReader(),
      hJ: () => new XMLHttpRequest(),
      hK: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      hL: x0 => x0.message,
      hM: x0 => x0.trustedTypes,
      hN: x0 => x0.phoneNumber,
      hO: x0 => x0.appVersion,
      i: x0 => new Promise(x0),
      iB: Function.prototype.call.bind(DataView.prototype.setFloat64),
      iC: a => a.length,
      iD: x0 => x0.relatedTarget,
      iE: x0 => x0.timeStamp,
      iF: x0 => ({runApp: x0}),
      iG: (x0,x1) => { x0.placeholder = x1 },
      iH: x0 => x0.next(),
      iI: x0 => x0.read(),
      iJ: (x0,x1) => { x0.responseType = x1 },
      iK: (x0,x1) => { x0.responseType = x1 },
      iL: (x0,x1) => x0.createElement(x1),
      iM: () => globalThis.console,
      iN: x0 => x0.email,
      iO: x0 => x0.appName,
      j: (x0,x1,x2) => x0.call(x1,x2),
      jB: (t, s) => t.set(s),
      jC: (x0,x1) => x0.test(x1),
      jD: x0 => x0.shiftKey,
      jE: (x0,x1) => x0.hasAttribute(x1),
      jF: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      jG: (x0,x1) => { x0.autocomplete = x1 },
      jH: x0 => x0.value,
      jI: x0 => x0.value,
      jJ: x0 => x0.hostname,
      jK: () => new XMLHttpRequest(),
      jL: x0 => x0.click(),
      jM: x0 => x0.trustedTypes,
      jN: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      jO: x0 => x0.appCodeName,
      k: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      kB: Function.prototype.call.bind(DataView.prototype.setFloat32),
      kC: x0 => x0.userAgent,
      kD: (decoder, codeUnits) => decoder.decode(codeUnits),
      kE: x0 => x0.buttons,
      kF: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      kG: (x0,x1) => { x0.name = x1 },
      kH: x0 => x0.done,
      kI: x0 => x0.done,
      kJ: x0 => x0.port,
      kK: x0 => globalThis.URL.createObjectURL(x0),
      kL: x0 => x0.remove(),
      kM: (x0,x1) => { x0.crossOrigin = x1 },
      kN: x0 => x0.customData,
      kO: (x0,x1) => { x0.src = x1 },
      l: x0 => new Array(x0),
      lB: Function.prototype.call.bind(DataView.prototype.getFloat32),
      lC: x0 => x0.navigator,
      lD: () => new TextDecoder("utf-8", {fatal: true}),
      lE: x0 => x0.ctrlKey,
      lF: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      lG: (x0,x1) => { x0.placeholder = x1 },
      lH: (o, m, a) => o[m].apply(o, a),
      lI: x0 => x0.cancel(),
      lJ: x0 => x0.protocol,
      lK: x0 => ({type: x0}),
      lL: (o, a) => o + a,
      lM: (x0,x1) => { x0.type = x1 },
      lN: x0 => x0.message,
      lO: (x0,x1) => { x0.currentTime = x1 },
      m: o => [o],
      mB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      mC: Function.prototype.call.bind(String.prototype.toLowerCase),
      mD: () => new TextDecoder("utf-8", {fatal: false}),
      mE: x0 => x0.y,
      mF: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      mG: (x0,x1) => { x0.action = x1 },
      mH: x0 => x0.iterator,
      mI: x0 => x0.body,
      mJ: x0 => x0.location,
      mK: (x0,x1) => new Blob(x0,x1),
      mL: x0 => x0.children,
      mM: (x0,x1) => globalThis.firebase_auth.linkWithCredential(x0,x1),
      mN: x0 => x0.code,
      mO: x0 => x0.pause(),
      n: (o0, o1) => [o0, o1],
      nB: Function.prototype.call.bind(DataView.prototype.getUint32),
      nC: Object.is,
      nD: (a, i, v) => a[i] = v,
      nE: x0 => x0.x,
      nF: x0 => x0.history,
      nG: (x0,x1) => { x0.method = x1 },
      nH: () => globalThis.Symbol,
      nI: x0 => x0.headers,
      nJ: () => globalThis.window,
      nK: (x0,x1,x2,x3) => x0.putImageData(x1,x2,x3),
      nL: (x0,x1) => { x0.download = x1 },
      nM: (x0,x1,x2) => ({accessToken: x0,idToken: x1,rawNonce: x2}),
      nN: (x0,x1) => globalThis.firebase_auth.signInWithPopup(x0,x1),
      nO: x0 => x0.currentTime,
      o: (o0, o1, o2) => [o0, o1, o2],
      oB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      oC: x0 => x0.vendor,
      oD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      oE: x0 => x0.scrollTop,
      oF: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      oG: (x0,x1) => { x0.noValidate = x1 },
      oH: (x0,x1) => new Intl.Segmenter(x0,x1),
      oI: x0 => x0.signal,
      oJ: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      oK: x0 => x0.arrayBuffer(),
      oL: (x0,x1) => { x0.display = x1 },
      oM: (x0,x1) => x0.credential(x1),
      oN: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      oO: x0 => x0.play(),
      p: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      pB: Function.prototype.call.bind(DataView.prototype.getInt32),
      pC: (x0,x1) => x0.createTextNode(x1),
      pD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      pE: x0 => x0.offsetTop,
      pF: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      pG: (x0,x1) => x0.removeAttribute(x1),
      pH: x0 => x0.Segmenter,
      pI: x0 => x0.naturalHeight,
      pJ: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      pK: (x0,x1) => x0.transferFromImageBitmap(x1),
      pL: x0 => x0.style,
      pM: x0 => new firebase_auth.OAuthProvider(x0),
      pN: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      pO: () => new AudioContext(),
      q: (x0,x1,x2) => { x0[x1] = x2 },
      qB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      qC: (x0,x1) => { x0.id = x1 },
      qD: x0 => x0.visibilityState,
      qE: x0 => x0.scrollLeft,
      qF: o => Object.keys(o),
      qG: x0 => x0.isConnected,
      qH: () => new TextDecoder(),
      qI: x0 => x0.naturalWidth,
      qJ: (x0,x1) => x0.send(x1),
      qK: x0 => x0.height,
      qL: (x0,x1) => { x0.href = x1 },
      qM: (x0,x1) => globalThis.firebase_auth.EmailAuthProvider.credential(x0,x1),
      qN: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      qO: (x0,x1) => x0.createMediaElementSource(x1),
      r: (o, p) => o[p],
      rB: o => o instanceof Uint16Array,
      rC: (x0,x1) => { x0.nonce = x1 },
      rD: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      rE: x0 => x0.offsetLeft,
      rF: x0 => x0.state,
      rG: x0 => x0.click(),
      rH: (handle) => clearInterval(handle),
      rI: (x0,x1) => x0.createElement(x1),
      rJ: x0 => x0.abort(),
      rK: x0 => x0.width,
      rL: (x0,x1) => ({files: x0,text: x1}),
      rM: (x0,x1) => globalThis.firebase_auth.linkWithPopup(x0,x1),
      rN: () => globalThis.firebase_auth.debugErrorMap,
      rO: x0 => x0.createStereoPanner(),
      s: () => globalThis,
      sB: Function.prototype.call.bind(DataView.prototype.getUint16),
      sC: x0 => x0.nonce,
      sD: x0 => x0.disconnect(),
      sE: x0 => x0.offsetParent,
      sF: x0 => x0.state,
      sG: (x0,x1) => x0.getElementsByClassName(x1),
      sH: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      sI: (x0,x1) => { x0.pointerEvents = x1 },
      sJ: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      sK: x0 => x0.rasterEndMilliseconds,
      sL: x0 => ({files: x0}),
      sM: (x0,x1) => x0.setCustomParameters(x1),
      sN: () => globalThis.firebase_auth.browserSessionPersistence,
      sO: (x0,x1) => x0.connect(x1),
      t: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      tB: o => o instanceof Int16Array,
      tC: () => globalThis.window.flutterConfiguration,
      tD: x0 => new Intl.Locale(x0),
      tE: (o, p, r) => o.replace(p, () => r),
      tF: (x0,x1) => x0.go(x1),
      tG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      tH: () => Date.now(),
      tI: (x0,x1) => { x0.height = x1 },
      tJ: (x0,x1) => { x0.withCredentials = x1 },
      tK: x0 => x0.rasterStartMilliseconds,
      tL: x0 => ({text: x0}),
      tM: (x0,x1) => x0.addScope(x1),
      tN: () => globalThis.firebase_auth.browserLocalPersistence,
      tO: x0 => x0.load(),
      u: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      uB: Function.prototype.call.bind(DataView.prototype.getInt16),
      uC: (x0,x1) => x0.attachShadow(x1),
      uD: x0 => x0.region,
      uE: (o, p, r) => o.replaceAll(p, () => r),
      uF: x0 => x0.hash,
      uG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      uH: (x0,x1,x2) => x0.insertBefore(x1,x2),
      uI: (x0,x1) => { x0.width = x1 },
      uJ: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      uK: x0 => x0.imageBitmaps,
      uL: () => ({}),
      uM: () => new firebase_auth.GoogleAuthProvider(),
      uN: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      uO: x0 => x0.destination,
      v: (x0,x1) => ({addView: x0,removeView: x1}),
      vB: o => o instanceof Uint8ClampedArray,
      vC: (x0,x1) => x0.createElement(x1),
      vD: x0 => x0.script,
      vE: x0 => x0.deltaMode,
      vF: x0 => x0.location,
      vG: (x0,x1) => x0.dispatchEvent(x1),
      vH: x0 => x0.id,
      vI: x0 => x0.style,
      vJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      vK: (x0,x1) => { x0.height = x1 },
      vL: (x0,x1,x2) => new File(x0,x1,x2),
      vM: (x0,x1) => x0.getIdToken(x1),
      vN: (x0,x1,x2) => globalThis.firebase_auth.sendPasswordResetEmail(x0,x1,x2),
      vO: x0 => x0.code,
      w: (l, r) => l === r,
      wB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      wC: x0 => x0.scale,
      wD: x0 => x0.language,
      wE: x0 => x0.deltaY,
      wF: x0 => x0.search,
      wG: (x0,x1) => x0.createEvent(x1),
      wH: x0 => x0.offsetHeight,
      wI: (x0,x1) => { x0.src = x1 },
      wJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      wK: (x0,x1) => { x0.width = x1 },
      wL: (x0,x1) => { x0.type = x1 },
      wM: x0 => x0.providerId,
      wN: (x0,x1,x2) => globalThis.firebase_auth.createUserWithEmailAndPassword(x0,x1,x2),
      wO: x0 => x0.message,
      x: x0 => x0.random(),
      xB: Function.prototype.call.bind(DataView.prototype.setInt32),
      xC: x0 => x0.visualViewport,
      xD: x0 => x0.languages,
      xE: x0 => x0.deltaX,
      xF: x0 => x0.pathname,
      xG: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      xH: x0 => x0.offsetWidth,
      xI: () => globalThis.document,
      xJ: (x0,x1) => x0.getResponseHeader(x1),
      xK: x0 => x0.convertToBlob(),
      xL: x0 => x0.baseURI,
      xM: x0 => x0.uid,
      xN: (x0,x1,x2) => globalThis.firebase_auth.signInWithEmailAndPassword(x0,x1,x2),
      xO: x0 => x0.error,
      y: () => globalThis.Math,
      yB: Function.prototype.call.bind(DataView.prototype.setUint32),
      yC: x0 => x0.devicePixelRatio,
      yD: (x0,x1) => x0.observe(x1),
      yE: x0 => x0.wheelDeltaY,
      yF: x0 => x0.parentElement,
      yG: x0 => x0.readText(),
      yH: x0 => x0.stopPropagation(),
      yI: x0 => x0.src,
      yJ: x0 => x0.responseText,
      yK: (x0,x1,x2) => new ImageData(x0,x1,x2),
      yL: x0 => x0.document,
      yM: x0 => x0.providerData,
      yN: (x0,x1) => globalThis.firebase_auth.signInWithCredential(x0,x1),
      yO: x0 => x0.duration,
      z: (x0,x1) => x0.prepend(x1),
      zB: Function.prototype.call.bind(DataView.prototype.setInt16),
      zC: x0 => x0.height,
      zD: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      zE: x0 => x0.wheelDeltaX,
      zF: (x0,x1) => x0.querySelectorAll(x1),
      zG: x0 => x0.clipboard,
      zH: x0 => x0.disabled,
      zI: (x0,x1) => x0.revokeObjectURL(x1),
      zJ: x0 => x0.status,
      zK: (x0,x1) => x0.getContext(x1),
      zL: x0 => x0.measurementId,
      zM: x0 => x0.tenantId,
      zN: x0 => x0.signOut(),
      zO: (x0,x1) => { x0.playbackRate = x1 },

    };

    const baseImports = {
      _: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
