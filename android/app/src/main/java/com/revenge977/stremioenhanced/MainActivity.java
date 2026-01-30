package com.revenge977.stremioenhanced;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        injectPreload();
    }

    @Override
    public void onResume() {
        super.onResume();
        injectPreload();
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
