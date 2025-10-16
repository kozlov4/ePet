package com.example.epet.data.repository

import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.InputRegistration
import com.example.epet.data.model.OutputAuth
import com.example.epet.data.network.RetrofitClient
import com.example.epet.data.helper.ValidationHelper
import com.google.gson.GsonBuilder

class AuthRepository {

    fun login(inputLogin: InputLogin): OutputAuth {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputLogin.email).matches()) {
            return OutputAuth.Error("Некорректний email")
        }

        if (inputLogin.password.length < 6) {
            return OutputAuth.Error("Невірний пароль")
        }

        return OutputAuth.Success(
            access_token = "test_token",
            token_type = "test_token_type"
        )
    }

    suspend fun registration(inputRegistration: InputRegistration): OutputAuth {
        ValidationHelper.validate_registration(inputRegistration)?.let {
            return OutputAuth.Error(it)
        }

        return try {
            val response = RetrofitClient.api.registration(inputRegistration)

            if (response.isSuccessful) {
                response.body()!!
            } else {
                val errorJson = response.errorBody()?.string()
                val errorObj = GsonBuilder().create().fromJson(errorJson, OutputAuth.Error::class.java)
                errorObj ?: OutputAuth.Error("Невідома помилка, спробуйте ще раз")
            }
        } catch (e: Exception) {
            OutputAuth.Error(e.localizedMessage ?: "Помилка мережі, спробуйте ще раз")
        }
    }

    fun reset_password(inputEmail: String): String {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputEmail).matches()) {
            return "Некорректний email"
        }

        return "Тимчасовий пароль буде надіслано вам найближчим часом на email"
    }

}
