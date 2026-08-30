# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ---- Capacitor bridge core ----
# @capacitor/android already ships its own consumerProguardFiles covering
# @CapacitorPlugin / @NativePlugin annotated methods and com.getcapacitor.Plugin
# subclasses, so this is technically redundant with what gets auto-applied. Kept
# here explicitly anyway as a project-owned safety net instead of relying on that
# upstream file existing/staying correct. Also keeps the rest of the bridge package
# (JSObject, PluginCall, Bridge, etc.) used for JS <-> native marshalling, which the
# upstream rules don't cover as a blanket package keep.
-keep class com.getcapacitor.** { *; }

-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

# Deprecated Capacitor v2 plugin annotation, kept for safety.
-keep @com.getcapacitor.NativePlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

-keep public class * extends com.getcapacitor.Plugin { *; }

# ---- Cordova plugins ----
# No cordova-plugin-* packages are installed as of this writing (capacitor-cordova-android-plugins
# is Capacitor's always-generated empty bridge module), but this keeps working if one is added later.
-keep public class * extends org.apache.cordova.* {
    public <methods>;
    public <fields>;
}

# ---- Installed Capacitor/Capawesome plugin classes ----
# Matches every entry in android/app/src/main/assets/capacitor.plugins.json by package
# prefix: @capacitor/app, @capacitor/haptics, @capacitor/local-notifications,
# @capacitor/preferences, @capacitor/push-notifications, @capacitor/splash-screen
# all publish under com.capacitorjs.plugins.**; @capawesome/capacitor-app-review
# publishes under io.capawesome.capacitorjs.plugins.**. This also protects any future
# plugin added from either publisher without needing an edit here.
-keep class com.capacitorjs.plugins.** { *; }
-keep class io.capawesome.capacitorjs.plugins.** { *; }

# ---- Firebase Cloud Messaging ----
-keep class com.google.firebase.messaging.** { *; }
-keep public class * extends com.google.firebase.messaging.FirebaseMessagingService

# ---- WebView JavaScript bridge ----
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
