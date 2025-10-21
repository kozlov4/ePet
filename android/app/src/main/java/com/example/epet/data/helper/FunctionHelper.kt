package com.example.epet.data.helper

object FunctionHelper {

    fun parseAddress(input: String): Triple<String, String, String> {
        if (input.isBlank()) return Triple("", "", "")

        var text = input.trim().replace(Regex("[\\s,]+"), " ")

        val streetMarkers = setOf("вул", "вул.", "вулиця", "улица", "ул", "ул.", "street", "str.", "str")
        val houseMarkers = setOf("будинок", "буд.", "буд", "дом", "д.", "д", "house", "№", "no.", "n.", "no")
        val locationPrefixes = setOf("м", "м.", "місто")

        val tokens = text.split(" ")
        val cleaned = mutableListOf<String>()
        for (token in tokens) {
            val lower = token.lowercase()
            if (lower !in streetMarkers && lower !in houseMarkers && lower !in locationPrefixes) {
                cleaned.add(token)
            }
        }

        var city = ""
        var street = ""
        var houseNumber = ""

        if (cleaned.isNotEmpty() && cleaned.last().matches(Regex("\\d+[A-Za-zА-Яа-я/-]*"))) {
            houseNumber = cleaned.removeAt(cleaned.lastIndex)
        }

        if (cleaned.isNotEmpty()) {
            val first = cleaned.getOrNull(0) ?: ""
            val second = cleaned.getOrNull(1)
            val third = cleaned.getOrNull(2)

            val cityTwoWordSuffixes = listOf("ськ", "цьк", "піль", "нів", "риг", "град", "дар", "дол", "ське", "бург")

            val isTwoWordCity = second != null &&
                    first.firstOrNull()?.isUpperCase() == true &&
                    second.firstOrNull()?.isUpperCase() == true &&
                    cityTwoWordSuffixes.any { second.lowercase().endsWith(it) }

            if (isTwoWordCity) {
                city = "$first $second"
                street = cleaned.drop(2).joinToString(" ")
            } else {
                city = first
                street = cleaned.drop(1).joinToString(" ")
            }
        }

        return Triple(city.trim(), street.trim(), houseNumber.trim())
    }
}