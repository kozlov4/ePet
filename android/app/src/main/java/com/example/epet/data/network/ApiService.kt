package com.example.epet.data.network

import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.InputResetPassword
import com.example.epet.data.model.auth.OutputAuth
import com.example.epet.data.model.auth.OutputResetPassword
import com.example.epet.data.model.passport.OutputPetItem
import com.example.epet.data.model.passport.OutputPassportDetail
import com.example.epet.data.model.passport.OutputVaccinationsList
import com.example.epet.data.model.service.InputExtractPet
import com.example.epet.data.model.service.OutputExtractPet
import com.example.epet.data.model.settings.InputUpdateProfile
import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.model.service.InputRequestShelter
import com.example.epet.data.model.service.OutputShelterPet
import com.example.epet.data.model.service.OutputRequestShelter
import com.example.epet.data.model.settings.OutputUpdateProfile
import com.example.epet.data.model.settings.OutputUserDetail
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.FormUrlEncoded
import retrofit2.http.Field
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {

    /** Аутентифікація **/

    @FormUrlEncoded
    @POST("login/")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String): Response<OutputAuth.Success>

    @POST("users/register/")
    suspend fun registration(
        @Body inputRegistration: InputRegistration): Response<OutputAuth.Success>

    @POST("forgot-password/")
    suspend fun resetPassword(
        @Body inputResetPassword: InputResetPassword): Response<OutputResetPassword>

    /** Дані паспорта **/

    @GET("users/me/pets")
    suspend fun getPassportsList(
        @Header("Authorization") token: String): Response<List<OutputPetItem>>

    @GET("pets/{pet_id}")
    suspend fun getPassportDetail(
        @Header("Authorization") token: String,
        @Path("pet_id") petId: String): Response<OutputPassportDetail>

    @GET("pets/{pet_id}/vaccinations")
    suspend fun getVaccinationsList(
        @Header("Authorization") token: String,
        @Path("pet_id") petId: String): Response<OutputVaccinationsList>

    /** Витяги **/

    @POST("pets/generate-report")
    suspend fun generateReport(
        @Header("Authorization") token: String,
        @Body inputResetPassword: InputExtractPet): Response<OutputExtractPet>

    /** Налаштування **/

    @GET("users/me")
    suspend fun getUserDetail(
        @Header("Authorization") token: String): Response<OutputUserDetail>

    @PUT("users/me/update-profile")
    suspend fun updateProfile(
        @Header("Authorization") token: String,
        @Body inputUpdateProfile: InputUpdateProfile): Response<OutputUpdateProfile.Success>

    /** Список повідомлень **/

    @GET("users/notifications")
    suspend fun getNotificationsList(
        @Header("Authorization") token: String): Response<List<OutputNotification>>

    /** Притулок **/

    @GET("/requests/list")
    suspend fun getShelterPetsList(
        @Header("Authorization") token: String): Response<List<OutputShelterPet>>

    @POST("/requests/apply")
    suspend fun requestShelter(
        @Header("Authorization") token: String,
        @Body inputRequestShelter: InputRequestShelter): Response<OutputRequestShelter.Success>

}
