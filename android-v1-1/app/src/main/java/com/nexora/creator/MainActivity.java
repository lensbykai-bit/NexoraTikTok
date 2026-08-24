package com.nexora.creator;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1201;
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                String js = "(function(){" +
                        "var tabs=document.querySelector('.feed-tabs');" +
                        "if(!tabs)return;" +
                        "tabs.innerHTML=" +
                        "'<button onclick=\"feedTab(this,\\'STEM\\')\">STEM</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'COMMUNITY\\')\">COMMUNITY</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'LOCAL\\')\">LOCAL</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'FOLLOWING\\')\">FOLLOWING</button>' +" +
                        "'<button class=\"active\" onclick=\"feedTab(this,\\'FOR YOU\\')\">FOR YOU</button>';" +
                        "if(!document.getElementById('nexora-header-tabs-style')){" +
                        "var s=document.createElement('style');" +
                        "s.id='nexora-header-tabs-style';" +
                        "s.textContent='" +
                        ".home-top{grid-template-columns:34px minmax(0,1fr) 34px!important;padding-left:4px!important;padding-right:4px!important;}" +
                        ".home-top .circlebtn{width:30px!important;height:30px!important;font-size:16px!important;}" +
                        ".feed-tabs{min-width:0!important;gap:4px!important;justify-content:center!important;overflow-x:auto!important;white-space:nowrap!important;scrollbar-width:none!important;-ms-overflow-style:none!important;}" +
                        ".feed-tabs::-webkit-scrollbar{display:none!important;}" +
                        ".feed-tabs button{font-size:9.5px!important;padding:8px 2px!important;flex:0 0 auto!important;white-space:nowrap!important;letter-spacing:.1px!important;}" +
                        "@media(max-width:360px){.feed-tabs{gap:2px!important}.feed-tabs button{font-size:8.8px!important;padding-left:1px!important;padding-right:1px!important}}" +
                        "';document.head.appendChild(s);}" +
                        "})();";

                view.evaluateJavascript(js, null);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> uploadMessage,
                                             FileChooserParams fileChooserParams) {
                if (fileCallback != null) {
                    fileCallback.onReceiveValue(null);
                }
                fileCallback = uploadMessage;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST && fileCallback != null) {
            Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
            fileCallback.onReceiveValue(result);
            fileCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
