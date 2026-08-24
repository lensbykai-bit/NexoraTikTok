package com.nexora.creator;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Window;
import android.webkit.JavascriptInterface;
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

        webView.addJavascriptInterface(new NativeBridge(), "NexoraNative");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                String js = "(function(){" +
                        "var top=document.querySelector('.home-top');" +
                        "if(top){var old=top.querySelector('.circlebtn:not(.search)');if(old)old.remove();}" +
                        "var tabs=document.querySelector('.feed-tabs');" +
                        "if(tabs){tabs.innerHTML=" +
                        "'<button onclick=\"feedTab(this,\\'STEM\\')\">STEM</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'COMMUNITY\\')\">COMMUNITY</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'LOCAL\\')\">LOCAL</button>' +" +
                        "'<button onclick=\"feedTab(this,\\'FOLLOWING\\')\">FOLLOWING</button>' +" +
                        "'<button class=\"active\" onclick=\"feedTab(this,\\'FOR YOU\\')\">FOR YOU</button>';" +
                        "}" +
                        "var s=document.getElementById('nexora-v170-style');" +
                        "if(!s){s=document.createElement('style');s.id='nexora-v170-style';" +
                        "s.textContent='" +
                        ".home-top{grid-template-columns:minmax(0,1fr) 42px!important;padding-left:8px!important;padding-right:8px!important;gap:10px!important;}" +
                        ".feed-tabs{min-width:0!important;gap:22px!important;justify-content:flex-start!important;overflow-x:auto!important;white-space:nowrap!important;scrollbar-width:none!important;-ms-overflow-style:none!important;padding-left:5px!important;}" +
                        ".feed-tabs::-webkit-scrollbar{display:none!important;}" +
                        ".feed-tabs button{font-size:13px!important;padding:8px 1px!important;flex:0 0 auto!important;white-space:nowrap!important;}" +
                        ".bottom{height:calc(70px + env(safe-area-inset-bottom))!important;background:rgba(5,5,8,.98)!important;border-top:1px solid rgba(255,255,255,.08)!important;box-shadow:0 -10px 30px rgba(0,0,0,.28)!important;}" +
                        ".nav{font-size:10.5px!important;color:#8f8f98!important;padding-top:6px!important;}" +
                        ".nav span{font-size:23px!important;line-height:26px!important;}" +
                        ".nav.active{color:#fff!important;}" +
                        ".create-icon{width:50px!important;height:34px!important;border-radius:11px!important;background:linear-gradient(135deg,#ff3c8d,#8b5cf6,#4f7cff)!important;color:#fff!important;box-shadow:0 7px 20px rgba(139,92,246,.35)!important;}" +
                        ".act .ico{width:44px!important;height:44px!important;margin:auto!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:rgba(18,18,24,.72)!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:0 7px 22px rgba(0,0,0,.38)!important;}" +
                        "';document.head.appendChild(s);}" +
                        "function nav(go,icon,label){var n=document.querySelector('.nav[data-go=\"'+go+'\"]');if(n){n.innerHTML='<span>'+icon+'</span>'+label;}}" +
                        "nav('home','⌂','Home');nav('friends','♙','Friend');" +
                        "var post=document.querySelector('.nav[data-go=\"create\"]');if(post)post.innerHTML='<span class=\"create-icon\">＋</span>Post';" +
                        "nav('inbox','✉','Inbox');nav('profile','◉','Profile');" +
                        "var home=document.getElementById('home');" +
                        "if(home&&!home.dataset.swipeProfile){home.dataset.swipeProfile='1';var sx=0,sy=0,st=0;" +
                        "home.addEventListener('touchstart',function(e){if(e.touches.length!==1||e.target.closest('.feed-tabs,.modal,button,input,textarea')){st=0;return;}sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();},{passive:true});" +
                        "home.addEventListener('touchend',function(e){if(!st||!e.changedTouches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy,dt=Date.now()-st;st=0;if(dx<-75&&Math.abs(dx)>Math.abs(dy)*1.25&&dt<650&&typeof go==='function')go('profile');},{passive:true});}" +
                        "window.NexoraShare=function(){if(window.NexoraNative)window.NexoraNative.share('Nexora Tok','Check this video on Nexora Tok');};" +
                        "})();";

                view.evaluateJavascript(js, null);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> uploadMessage,
                                             FileChooserParams fileChooserParams) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
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

    public class NativeBridge {
        @JavascriptInterface
        public void share(String title, String text) {
            runOnUiThread(() -> {
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("text/plain");
                send.putExtra(Intent.EXTRA_SUBJECT, title);
                send.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(send, "Share Nexora Tok"));
            });
        }

        @JavascriptInterface
        public void copyText(String text) {
            runOnUiThread(() -> {
                ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                clipboard.setPrimaryClip(ClipData.newPlainText("Nexora Tok", text));
            });
        }
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
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
