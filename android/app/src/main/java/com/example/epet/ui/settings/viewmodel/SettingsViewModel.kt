package com.example.epet.ui.settings.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.settings.OutputUserDetail
import com.example.epet.data.repository.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SettingsViewModel : ViewModel() {

    private val repository = SettingsRepository()

    private val _outputUserDetail = MutableStateFlow(OutputUserDetail())
    val outputUserDetail = _outputUserDetail.asStateFlow()

    fun userDetail(token: String?) {
        viewModelScope.launch {
            val output = repository.userDetail(token)
            _outputUserDetail.value = output.copy()
        }
    }
}