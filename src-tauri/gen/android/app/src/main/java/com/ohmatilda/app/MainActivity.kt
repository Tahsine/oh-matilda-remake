package com.ohmatilda.app

import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge

private fun insetsPayload(t: Float, r: Float, b: Float, l: Float): String =
  "(function(){var t=$t,r=$r,b=$b,l=$l;" +
    "window.__safeArea={t:t,r:r,b:b,l:l};" +
    "var de=document.documentElement;" +
    "if(de){var s=de.style;" +
    "s.setProperty('--sat',t+'px');s.setProperty('--sar',r+'px');" +
    "s.setProperty('--sab',b+'px');s.setProperty('--sal',l+'px');}})()"

class MainActivity : TauriActivity() {

  class SafeAreaBridge(private val webView: WebView) {
    @JavascriptInterface
    fun requestInsets() {
      webView.post {
        val i = webView.rootWindowInsets ?: return@post
        val d = webView.resources.displayMetrics.density
        val t = i.systemWindowInsetTop / d
        val r = i.systemWindowInsetRight / d
        val b = i.systemWindowInsetBottom / d
        val l = i.systemWindowInsetLeft / d
        Log.i("SafeArea", "bridge requestInsets top=$t right=$r bottom=$b left=$l")
        webView.evaluateJavascript(insetsPayload(t, r, b, l), null)
      }
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    Log.i("SafeArea", "onWebViewCreate: webview=${webView.id}")
    val d = webView.resources.displayMetrics.density
    val push = {
      val i = webView.rootWindowInsets
      if (i != null) {
        Log.i("SafeArea", "push insets top=${i.systemWindowInsetTop / d} (density=$d)")
        webView.evaluateJavascript(
          insetsPayload(
            i.systemWindowInsetTop / d,
            i.systemWindowInsetRight / d,
            i.systemWindowInsetBottom / d,
            i.systemWindowInsetLeft / d
          ),
          null
        )
      }
    }
    webView.addJavascriptInterface(SafeAreaBridge(webView), "SafeAreaBridge")
    webView.setOnApplyWindowInsetsListener { _, insets ->
      push()
      insets
    }
    webView.postDelayed({ push() }, 500)
    webView.postDelayed({ push() }, 1500)
    webView.postDelayed({ push() }, 3000)
  }
}
