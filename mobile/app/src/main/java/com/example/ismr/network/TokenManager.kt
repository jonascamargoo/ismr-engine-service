package com.example.ismr.network

/**
 * Guarda o JWT em memória para a sessão atual.
 * O interceptor do RetrofitClient injeta este token no header Authorization.
 */
object TokenManager {
    @Volatile
    var token: String? = null
}
