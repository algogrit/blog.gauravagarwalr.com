---
title: "Setting up Flutter - Google's cross-platform native app development framework"
canonicalUrl: https://blog.gauravagarwalr.com/posts/2018-04-11-setting-up-flutter
license: all-rights-reserved
tags: flutter,native-apps,cross-platform,mobile,ios,android,dart
published: true
---

Since you are reading this post, I am guessing, you are probably familiar with [Flutter][FlutterSite]. If not,

  > Flutter is Google’s mobile UI framework for crafting high-quality native interfaces on iOS and Android in record time. Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.

"... in record time.", well I am sold! You can see it in action in this [Google I/O '17][SingleCodebaseTwoApps] talk. Let's begin by setting it up.

# Installation

Flutter can be [installed][FlutterInstall] by cloning it, for the master channel. Or you can be safer by sticking to the [Beta or Dev release][BetaDevRelease] channels.

Once you have cloned or downloaded the zip and extract it to the desired location. You will need to add `flutter` tool to your $PATH.

```bash
  $ export FLUTTER_HOME="$HOME/Developer/experimental/sdk/flutter"
  $ export PATH="$FLUTTER_HOME/bin:$PATH"
```

You would have the `flutter` tool available now.

```bash
  $ flutter --version
```
```snippet
  Flutter 0.2.11-pre.23 • channel master • git@github.com:flutter/flutter.git
  Framework • revision a2951a9a1f (7 hours ago) • 2018-04-10 18:12:34 -0700
  Engine • revision ed303c628f
  Tools • Dart 2.0.0-dev.47.0.flutter-23ae4fa098
```

You should see something like the above output. Now its time to install all dependencies of flutter. `flutter doctor -v` should check and let you know about all the dependencies.

# Android

I get the following output from `flutter doctor -v`.

```snippet
[✗] Android toolchain - develop for Android devices
    ✗ ANDROID_HOME = /usr/local/share/android-sdk/
      but Android SDK not found at this location.
```

## Brew cask installations

I have installed `android-sdk` and `android-ndk`.

```bash
  $ brew cask install android-sdk android-ndk
```

## Setting up PATH and environment variables

I have set the environment variables.

```bash
export ANDROID_SDK_ROOT="/usr/local/share/android-sdk/"
export ANDROID_NDK_HOME="/usr/local/share/android-ndk/"
```

and $PATH

```bash
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH="$ANDROID_HOME""tools:$ANDROID_HOME""tools/bin:$ANDROID_HOME""platform-tools:$PATH"
```

## Using `sdkmanager` to install android dependencies

But this is not enough! It says it can't find the 'Android SDK' at the location. Time to install using `sdkmanager`.

```bash
  $ sdkmanager --list
```
```snippet
  Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema
    at com.android.repository.api.SchemaModule$SchemaModuleVersion.<init>(SchemaModule.java:156)
    at com.android.repository.api.SchemaModule.<init>(SchemaModule.java:75)
    at com.android.sdklib.repository.AndroidSdkHandler.<clinit>(AndroidSdkHandler.java:81)
    at com.android.sdklib.tool.SdkManagerCli.main(SdkManagerCli.java:117)
    at com.android.sdklib.tool.SdkManagerCli.main(SdkManagerCli.java:93)
  Caused by: java.lang.ClassNotFoundException: javax.xml.bind.annotation.XmlSchema
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:190)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:499)
    ... 5 more
```

Uh, oh! Looks like my java version is different than expected. Perhaps I am on Java 10. Using [`jenv`][jenvSite]

```bash
  $ jenv versions
```
```snippet
  system
  1.8
  1.8.0.162
* 10 (set by /private/tmp/.java-version)
  oracle64-1.8.0.162
  oracle64-10
```

Let's [switch][macOSMultipleJava] to Java 1.8, restarting the shell and retrying...

```bash
  $ jenv local 1.8
  $ exec bash
  $ sdkmanager --list
```
```snippet
...
Installed packages:
  Path    | Version | Description              | Location
  ------- | ------- | -------                  | -------
  tools   | 26.0.1  | Android SDK Tools 26.0.1 | tools/
done
```

Flutter doctor is still not happy. Perhaps we need to look more closely. Reading the [`travis_setup.sh`][TravisSetup] file in the repository, I can see that the `sdkmanager` is used to install a bunch of stuff. Let's do the same locally.

```bash
  $ sdkmanager "tools"
  $ sdkmanager "platform-tools"
  $ sdkmanager "build-tools;27.0.3"
  $ sdkmanager "platforms;android-27"
  $ sdkmanager "extras;android;m2repository"
  $ sdkmanager "extras;google;m2repository"
  $ sdkmanager "patcher;v4"
```

This seems to take care of *almost* everything.

```bash
  $ flutter doctor -v
```
```snippet
  [!] Android toolchain - develop for Android devices (Android SDK 27.0.3)
      • Android SDK at /usr/local/share/android-sdk/
      • Android NDK location not configured (optional; useful for native profiling support)
      • Platform android-27, build-tools 27.0.3
      • ANDROID_HOME = /usr/local/share/android-sdk/
      • Java binary at: /Applications/Android Studio.app/Contents/jre/jdk/Contents/Home/bin/java
      • Java version OpenJDK Runtime Environment (build 1.8.0_152-release-1024-b01)
      ! Some Android licenses not accepted.  To resolve this, run: flutter doctor --android-licenses
```

One last thing, I suppose:

```bash
  $ flutter doctor --android-licenses
```

# iOS

I get the following output from `flutter doctor -v`.

```snippet
[✓] iOS toolchain - develop for iOS devices (Xcode 9.3)
    • Xcode at /Applications/Xcode.app/Contents/Developer
    • Xcode 9.3, Build version 9E145
    • ios-deploy 1.9.2
    • CocoaPods version 1.5.0
```

All my dependencies for iOS are in place. Well I am an iOS developer after all.

## Setting up Cocoapods

I generally prefer installing `Cocoapods` using `bundler`. I have my `Gemfile` written:

```ruby
  source "https://rubygems.org"

  gem 'cocoapods'
```

And running `bundle install`. After that `pod setup` should do the trick.

## Setting up Xcode

After installing Xcode, install the 'Command Line Tools' using `xcode-select --install`.

Install the xcode dependency `six`, as reported by the `flutter doctor`.

```bash
  $ pip install six
```

## Brew installations

```bash
  $ brew install --HEAD libimobiledevice
  $ brew install ideviceinstaller ios-deploy
```

# IDE

Flutter works best with 'Android Studio'. It also detects 'IntelliJ Idea' and 'Visual Studio Code'. You will need to install the appropriate plugins.

# Connect device

Connect your iOS or Android device to your machine over USB. That should take care of itself.

Hopefully, `flutter doctor` is happy now. And you can begin writing your first application (`flutter create`) in Dart or run from the examples directory.

```bash
  $ cd examples/flutter_gallery/
  $ flutter run
```

For iOS, you will need to configure the development team by opening Xcode workspace in `ios/Runner.xcworkspace`.

As always, please leave your comments and feedback in the comment section below. I hope you found this post useful. Happy developing.


[FlutterSite]: https://flutter.io/
[SingleCodebaseTwoApps]: https://www.youtube.com/watch?v=w2TcYP8qiRI
[FlutterInstall]: https://flutter.io/setup-macos/
[BetaDevRelease]: https://flutter.io/sdk-archive/#macos
[jenvSite]: http://www.jenv.be/
[macOSMultipleJava]: https://stackoverflow.com/questions/26252591/mac-os-x-and-multiple-java-versions
[TravisSetup]: https://github.com/flutter/flutter/blob/master/dev/bots/travis_setup.sh#L35
