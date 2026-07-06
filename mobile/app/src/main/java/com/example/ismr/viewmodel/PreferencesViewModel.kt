package com.example.ismr.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ismr.model.Preferences
import com.example.ismr.network.RetrofitClient
import com.example.ismr.ui.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
class PreferencesViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        buscarPreferencias()
    }

    fun buscarPreferencias() {
        viewModelScope.launch {
            try {
                val preferences = RetrofitClient.api.listarPreferencias()
                _uiState.value = UiState.Success(preferences)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Erro ao carregar preferências")
            }
        }
    }

    fun atualizarPreferencia(update: (Preferences) -> Preferences) {
        val currentState = _uiState.value
        if (currentState is UiState.Success) {

            val preferenciasAtualizadas = update(currentState.data)

            viewModelScope.launch {
                try {
                    _uiState.value = UiState.Success(preferenciasAtualizadas)

                    RetrofitClient.api.atualizarPreferencias(preferenciasAtualizadas)
                } catch (e: Exception) {
                    _uiState.value = UiState.Error("Erro ao salvar: ${e.message}")
                }
            }
        }
    }
}

