package com.example.epet.data.helper

import android.util.Patterns
import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.InputLogin
import com.example.epet.data.model.auth.InputResetPassword

object ValidationHelper {

    fun validateLogin(input: InputLogin): String? {
        return when {
            !Patterns.EMAIL_ADDRESS.matcher(input.username).matches() -> "Некоректний формат email"
            input.password.length !in 8..100 -> "Пароль має містити від 8 символів"
            else -> null
        }
    }

    fun validateRegistration(input: InputRegistration): String? {
        return when {
            input.last_name.length !in 3..100 -> "Прізвище має містити від 3 символів"
            input.first_name.length !in 3..100 -> "Ім'я має містити від 3 символів"
            input.patronymic.length !in 3..100 -> "По батькові має містити від 3 символів"
            input.passport_number.length !in 3..20 -> "Номер паспорта має містити від 3 символів"
            input.city?.length !in 2..50 -> "Місто має містити від 3 символів"
            input.street?.length !in 3..100 -> "Вулиця має містити від 3 символів"
            input.house_number?.length !in 1..20 -> "Номер будинку має містити від 1 символу"
            input.postal_index.length !in 1..10 -> "Поштовий індекс має містити від 1 символу"
            !Patterns.EMAIL_ADDRESS.matcher(input.email).matches() -> "Некоректний формат email"
            input.password.length !in 8..100 -> "Пароль має містити від 8 символів"
            else -> null
        }
    }

    fun validateResetPassword(input: InputResetPassword): String? {
        return when {
            !Patterns.EMAIL_ADDRESS.matcher(input.email).matches() -> "Некоректний формат email"
            else -> null
        }
    }
}