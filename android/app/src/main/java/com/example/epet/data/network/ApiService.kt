package com.example.epet.data.network

import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.InputResetPassword
import com.example.epet.data.model.auth.OutputAuth
import com.example.epet.data.model.auth.OutputResetPassword
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.FormUrlEncoded
import retrofit2.http.Field

interface ApiService {

    @FormUrlEncoded
    @POST("login/")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): Response<OutputAuth.Success>

    @POST("users/register/")
    suspend fun registration(@Body inputRegistration: InputRegistration): Response<OutputAuth.Success>

    @POST("forgot-password/")
    suspend fun resetPassword(@Body inputResetPassword: InputResetPassword): Response<OutputResetPassword>
}
