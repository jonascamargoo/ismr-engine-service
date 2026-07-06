package com.example.ismr.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.example.ismr.R

// Set of Material typography styles to start with
val spaceMonoFontFamily = FontFamily(
    Font(R.font.spacemono_regular, FontWeight.Normal),
    Font(R.font.spacemono_bold, FontWeight.Bold)
)

val wixMadeForDisplayFontFamily = FontFamily(
    Font(R.font.wixmadefordisplay_regular, FontWeight.Normal),
    Font(R.font.wixmadefordisplay_bold, FontWeight.Bold)
)

private val defaultTypography = Typography()

val Typography = Typography(
    displayLarge = defaultTypography.displayLarge.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 24.sp,
    ),
    displayMedium = defaultTypography.displayMedium.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 20.sp,
    ),
    displaySmall = defaultTypography.displaySmall.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 16.sp,
    ),

    headlineLarge = defaultTypography.headlineLarge.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 28.sp,
        lineHeight = 36.sp
    ),
    headlineMedium = defaultTypography.headlineMedium.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 24.sp,
        lineHeight = 32.sp
    ),
    headlineSmall = defaultTypography.headlineSmall.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 20.sp,
        lineHeight = 28.sp
    ),

    titleLarge = defaultTypography.titleLarge.copy(
        fontFamily = spaceMonoFontFamily
    ),
    titleMedium = defaultTypography.titleMedium.copy(
        fontFamily = spaceMonoFontFamily
    ),
    titleSmall = defaultTypography.titleSmall.copy(
        fontFamily = spaceMonoFontFamily
    ),

    bodyLarge = defaultTypography.bodyLarge.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.sp
    ),
    bodyMedium = defaultTypography.bodyMedium.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 12.sp,
        lineHeight = 16.sp
    ),
    bodySmall = defaultTypography.bodySmall.copy(
        fontFamily = wixMadeForDisplayFontFamily,
        fontSize = 11.sp,
        lineHeight = 16.sp
    ),

    labelLarge = defaultTypography.labelLarge.copy(
        fontFamily = spaceMonoFontFamily,
        fontSize = 13.sp,
        lineHeight = 18.sp
    ),
    labelMedium = defaultTypography.labelMedium.copy(
        fontFamily = spaceMonoFontFamily,
        fontSize = 11.sp,
        lineHeight = 16.sp
    ),
    labelSmall = defaultTypography.labelSmall.copy(
        fontFamily = spaceMonoFontFamily,
        fontSize = 10.sp,
        lineHeight = 14.sp
    )
)