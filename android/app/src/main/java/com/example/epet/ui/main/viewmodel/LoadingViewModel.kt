package com.example.epet.ui.main.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class LoadingViewModel : ViewModel() {

    private val _loading = MutableStateFlow<Boolean>(false)
    val loading = _loading.asStateFlow()

    fun show() {
        _loading.value = true
    }

    fun hide() {
        _loading.value = false
    }
}