package com.example.ismr.network

import com.example.ismr.model.Preferences
import com.example.ismr.model.Token
import retrofit2.http.Body
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT

interface ApiService {
    // OAuth2 password flow: o backend espera form-urlencoded com username/password
    @FormUrlEncoded
    @POST("auth/login")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): Token

    @GET("preferences")
    suspend fun listarPreferencias(): Preferences

    @PUT("preferences")
    suspend fun atualizarPreferencias(@Body preferences: Preferences): Preferences
}
