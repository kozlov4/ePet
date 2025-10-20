package com.example.epet.data.helper

import android.util.Patterns
import com.example.epet.data.model.InputRegistration

object ValidationHelper {
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
            input.password.length !in 8..100 -> "Пароль має містити від 6 символів"
            else -> null
        }
    }
}