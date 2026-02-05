package com.revenge977.stremioenhanced;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import com.getcapacitor.BridgeWebViewClient;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends BridgeActivity {

    private View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // Initial injection (fallback)
        injectPreload();
        setupWebView();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Re-inject in case of reload/navigation (fallback)
        injectPreload();
        setImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            setImmersiveMode();
        }
    }

    private void setImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    private void setupWebView() {
        try {
            if (this.getBridge() == null) return;
            WebView webView = this.getBridge().getWebView();
            if (webView == null) return;

            // Setup Custom WebChromeClient for Fullscreen
            webView.setWebChromeClient(new BridgeWebChromeClient(this.getBridge()) {
                @Override
                public void onShowCustomView(View view, CustomViewCallback callback) {
                    if (mCustomView != null) {
                        callback.onCustomViewHidden();
                        return;
                    }

                    mCustomView = view;
                    mCustomViewCallback = callback;

                    FrameLayout decor = (FrameLayout) getWindow().getDecorView();
                    decor.addView(mCustomView, new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT));

                    setImmersiveMode();
                }

                @Override
                public void onHideCustomView() {
                    if (mCustomView == null) {
                        return;
                    }

                    FrameLayout decor = (FrameLayout) getWindow().getDecorView();
                    decor.removeView(mCustomView);
                    mCustomView = null;

                    if (mCustomViewCallback != null) {
                        mCustomViewCallback.onCustomViewHidden();
                        mCustomViewCallback = null;
                    }

                    setImmersiveMode();
                }
            });

            // Setup Custom WebViewClient for Injection on Navigation
            webView.setWebViewClient(new BridgeWebViewClient(this.getBridge()) {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    injectPreload();
                }
            });

        } catch (Exception e) {
             e.printStackTrace();
        }
    }

    private void injectPreload() {
        try {
            if (this.getBridge() == null) return;
            WebView webView = this.getBridge().getWebView();
            if (webView == null) return;

            InputStream is = getAssets().open("preload.js");
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            String script = sb.toString();

            // Execute as anonymous function to avoid scope pollution if run multiple times
            String safeScript = "if (!window.stremioEnhanced) { (function() { " + script + " })(); }";

            webView.evaluateJavascript(safeScript, null);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
