package com.example.epet.data.network

import com.example.epet.data.model.InputRegistration
import com.example.epet.data.model.OutputAuth
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("users/register/")
    suspend fun registration(@Body user: InputRegistration): Response<OutputAuth.Success>
}
