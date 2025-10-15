package com.example.epet.data.repository

import com.example.epet.data.model.InputLogin
import com.example.epet.data.model.InputRegistration
import com.example.epet.data.model.OutputAuth

class AuthRepository {

    fun login(inputLogin: InputLogin): OutputAuth {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputLogin.email).matches()) {
            return OutputAuth.Error("Некорректний email")
        }

        if (inputLogin.password.length < 6) {
            return OutputAuth.Error("Невірний пароль")
        }

        return OutputAuth.Success(
            token = "abc123token",
            name = "Захар"
        )
    }

    fun regisatration(inputRegistration: InputRegistration): OutputAuth {
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(inputRegistration.email).matches()) {
            return OutputAuth.Error("Некорректний email")
        }

        if (inputRegistration.password.length < 6) {
            return OutputAuth.Error("Пароль має містити більше 6 символів")
        }

        return OutputAuth.Success(
            token = "abc123token",
            name = "Захар"
        )
    }
}
