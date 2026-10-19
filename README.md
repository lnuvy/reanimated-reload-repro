# reanimated-reload-repro

Minimal repro for a crash in the `ReanimatedModuleProxy` constructor when a reload happens while the first bundle is still running.

- react-native 0.78.3 (New Architecture, bridgeless), Hermes
- react-native-reanimated 3.19.1

## What it does

`index.js` triggers one reload right at startup through a tiny native module (`ios/ReanimatedReloadRepro/ReproReload.m`). It calls `RCTTriggerReloadCommandListeners` on the main queue, the same way react-native-code-push does when it rolls back an update on launch. A flag in `Settings` makes it happen only once per cold start.

## Run

```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npx react-native run-ios --mode Release
```

Then cold start the app a few times (kill it and open it again). Or loop it on a booted simulator:

```sh
for i in $(seq 1 30); do
  xcrun simctl terminate booted org.reactjs.native.example.ReanimatedReloadRepro
  xcrun simctl launch booted org.reactjs.native.example.ReanimatedReloadRepro
  sleep 2.5
done
ls ~/Library/Logs/DiagnosticReports | grep ReanimatedReloadRepro
```

On my machine (Xcode 26.6, iOS 26.4 simulator, Release) this crashed 15 of 30 launches with:

```
EXC_BAD_ACCESS (SIGSEGV) KERN_INVALID_ADDRESS
worklets::WorkletsModuleProxy::getValueUnpackerCode() const (WorkletsModuleProxy.h:34)
reanimated::ReanimatedModuleProxy::ReanimatedModuleProxy(...) (ReanimatedModuleProxy.cpp:61)
reanimated::createReanimatedModule(...) (NativeProxy.mm:73)
-[REAModule installTurboModule] (REAModule.mm:255)
```

The crash report shows two `com.facebook.react.runtime.JavaScript` threads: one crashing in `installTurboModule`, the other evaluating the new bundle.

## Fix check

`fix/react-native-reanimated+3.19.1.patch` adds a null check on the worklets proxy. To try it:

```sh
npx patch-package --patch-dir fix
```

Rebuild and run the same loop. With the patch it was 0 of 30.

## Note

The `fmt` pod is built with C++17 in the `Podfile` because Xcode 26 doesn't compile fmt 11.0.2 (bundled with RN 0.78) under C++20. Not related to the crash.
