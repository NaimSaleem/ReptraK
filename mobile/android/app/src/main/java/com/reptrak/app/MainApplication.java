package com.reptrak.app;

import android.app.ActivityManager;
import android.app.Application;
import android.widget.Toast;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.react.modules.core.ModuleRegistry;
import com.facebook.soloader.SoLoader;

import expo.modules.core.interfaces.Package;
import expo.modules.core.interfaces.SingletonModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected String getBundleAssetName() {
            return "index.android.bundle";
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new ArrayList<>();
            return packages;
        }

        @Override
        protected String getJSBundleFile() {
            return super.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);

        if (BuildConfig.DEBUG) {
            try {
                java.lang.Class<?> amd = java.lang.Class.forName("android.app.ActivityManagerNative");
                java.lang.reflect.Method method = amd.getMethod("getDefault", (java.lang.Class[]) null);
                Object amn = method.invoke(null, (java.lang.Object[]) null);
                java.lang.reflect.Method setAlwaysFinish = amn.getClass().getMethod("setAlwaysFinish", new java.lang.Class[] { java.lang.Boolean.TYPE });
                setAlwaysFinish.invoke(amn, false);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
