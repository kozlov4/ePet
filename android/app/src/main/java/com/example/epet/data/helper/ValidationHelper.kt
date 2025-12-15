package com.example.epet.data.helper

import android.util.Patterns
import com.example.epet.data.model.auth.InputRegistration
import com.example.epet.data.model.auth.InputLogin
import com.example.epet.data.model.auth.InputResetPassword
import com.example.epet.data.model.settings.InputUpdateProfile

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
            input.last_name.length !in 2..100 -> "Прізвище має містити від 2 символів"
            !input.last_name.matches(Regex("^[А-Яа-яІіЇїЄєҐґ\\-\\s']+$")) -> "Прізвище повинно містити тільки кирилицю, дефіс або апостроф"

            input.first_name.length !in 2..100 -> "Ім'я має містити від 2 символів"
            !input.first_name.matches(Regex("^[А-Яа-яІіЇїЄєҐґ\\-\\s']+$")) -> "Ім'я повинно містити тільки кирилицю, дефіс або апостроф"

            input.patronymic.length !in 2..100 -> "По батькові має містити від 2 символів"
            !input.patronymic.matches(Regex("^[А-Яа-яІіЇїЄєҐґ\\-\\s']+$")) -> "По батькові повинно містити тільки кирилицю, дефіс або апостроф"

            !Regex("^([А-ЯІЇЄ]{2}\\d{6}|\\d{9})$").matches(input.passport_number.uppercase()) -> "Номер паспорта некоректний"

            input.city?.length !in 2..50 -> "Місто має містити від 3 символів"

            input.street?.length !in 3..100 -> "Вулиця має містити від 3 символів"

            input.house_number?.length !in 1..20 -> "Номер будинку має містити від 1 символу"
            input.house_number?.none { it.isDigit() } == true -> "Номер будинку повинен містити цифру"
            input.house_number?.matches(Regex("^[0-9а-яА-Яa-zA-Z\\-/]+$")) == false -> "Номер будинку містить недопустимі символи"

            !Regex("^\\d{5}$").matches(input.postal_index) -> "Поштовий індекс повинен містити 5 цифр"

            !Patterns.EMAIL_ADDRESS.matcher(input.email).matches() -> "Некоректний формат email"

            input.password.length !in 8..100 -> "Пароль має містити від 8 символів"
            input.password.none { it.isDigit() } -> "Пароль повинен містити хоча б одну цифру"
            input.password.none { it.isUpperCase() } -> "Пароль повинен містити хоча б одну велику літеру"
            input.password.none { it.isLowerCase() } -> "Пароль повинен містити хоча б одну малу літеру"
            input.password.none { "!@#$%^&*()_+".contains(it) } -> "Пароль повинен містити спеціальний символ (!@#$%^&*()_+)"

            else -> null
        }
    }

    fun validateResetPassword(input: InputResetPassword): String? {
        return when {
            !Patterns.EMAIL_ADDRESS.matcher(input.email).matches() -> "Некоректний формат email"
            else -> null
        }
    }

    fun validateUpdateProfile(input: InputUpdateProfile): String? {
        input.new_email?.let {
            if (!Patterns.EMAIL_ADDRESS.matcher(it).matches()) {
                return "Некоректний формат email"
            }
        }

        input.new_password?.let { password ->
            if (password.length !in 8..100) return "Пароль має містити від 8 символів"
            if (password.none { it.isDigit() }) return "Пароль повинен містити хоча б одну цифру"
            if (password.none { it.isUpperCase() }) return "Пароль повинен містити хоча б одну велику літеру"
            if (password.none { it.isLowerCase() }) return "Пароль повинен містити хоча б одну малу літеру"
            if (password.none { "!@#$%^&*()_+".contains(it) }) return "Пароль повинен містити спеціальний символ (!@#$%^&*()_+)"
        }

        return null
    }
}