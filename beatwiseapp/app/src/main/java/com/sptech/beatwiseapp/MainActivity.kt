package com.sptech.beatwiseapp

import android.os.Bundle
import android.os.SystemClock
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.sptech.beatwiseapp.screens.MainScreen

private const val SPLASH_MIN_DURATION_MS = 1200L

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        val startTime = SystemClock.uptimeMillis()
        splashScreen.setKeepOnScreenCondition {
            SystemClock.uptimeMillis() - startTime < SPLASH_MIN_DURATION_MS
        }

        setContent {
            MainScreen()
        }
    }
}
