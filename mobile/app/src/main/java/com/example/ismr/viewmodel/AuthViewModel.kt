package com.example.ismr.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ismr.network.RetrofitClient
import com.example.ismr.network.TokenManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthState {
    object LoggedOut : AuthState()
    object Loading : AuthState()
    object LoggedIn : AuthState()
    data class Error(val mensagem: String) : AuthState()
}

class AuthViewModel : ViewModel() {
    private val _state = MutableStateFlow<AuthState>(AuthState.LoggedOut)
    val state: StateFlow<AuthState> = _state.asStateFlow()

    fun login(username: String, password: String) {
        viewModelScope.launch {
            _state.value = AuthState.Loading
            try {
                val token = RetrofitClient.api.login(username, password)
                TokenManager.token = token.accessToken
                _state.value = AuthState.LoggedIn
            } catch (e: Exception) {
                _state.value = AuthState.Error(e.message ?: "Falha no login")
            }
        }
    }
}
