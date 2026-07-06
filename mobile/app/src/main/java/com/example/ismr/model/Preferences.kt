package com.example.ismr.model

import com.google.gson.annotations.SerializedName

data class Preferences(
    @SerializedName("ai_personality") val aiPersonality: String = "Helpful and polite",
    @SerializedName("read_only_headphones") val readOnlyHeadphones: Boolean = false,
    @SerializedName("focus_mode_active") val focusModeActive: Boolean = false,
    @SerializedName("hide_sensitive_data") val hideSensitiveData: Boolean = false
)
