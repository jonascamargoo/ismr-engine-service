package com.example.ismr.ui

import com.example.ismr.model.Preferences

sealed class UiState {
    object Loading : UiState()
    data class Success(val data: Preferences) : UiState()
    data class Error(val mensagem: String) : UiState()
}