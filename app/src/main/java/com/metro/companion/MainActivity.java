package com.metro.companion;

import android.os.Bundle;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends AppCompatActivity {

    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWebView = findViewById(R.id.webview);
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // Configure WebViewAssetLoader to resolve file:// CORS issues in WebView
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        myWebView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
        });

        myWebView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override
    public void onBackPressed() {
        // Query the Web App navigation stack size dynamically
        myWebView.evaluateJavascript("stack.length", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                int stackLength = 1;
                try {
                    if (value != null && !value.equals("null")) {
                        stackLength = Integer.parseInt(value);
                    }
                } catch (NumberFormatException e) {
                    stackLength = 1;
                }

                if (stackLength > 1) {
                    // Navigate back within the Web App stack
                    myWebView.evaluateJavascript("back();", null);
                } else {
                    // Quit the app if on the main page
                    MainActivity.super.onBackPressed();
                }
            }
        });
    }
}
