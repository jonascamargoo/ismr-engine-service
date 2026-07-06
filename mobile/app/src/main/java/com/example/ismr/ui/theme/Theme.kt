package com.example.ismr.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = TextDark,
    secondary = IconDark,
    tertiary = TabIconDefaultDark,
    background = BackgroundDark,
    surface = CardDark,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onTertiary = Color.Black,
    onBackground = TextDark,
    onSurface = TextDark,
    outline = BorderDark,
    error = ErrorColor
)

private val LightColorScheme = lightColorScheme(
    primary = TextLight,
    secondary = IconLight,
    tertiary = TabIconDefaultLight,

    /* Other default colors to override */
    background = BackgroundLight,
    surface = CardLight,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onTertiary = Color.White,
    onBackground = TextLight,
    onSurface = TextLight,
    outline = BorderLight,
    error = ErrorColor
)

@Composable
fun IsmrTheme(
    darkTheme: Boolean = !isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}