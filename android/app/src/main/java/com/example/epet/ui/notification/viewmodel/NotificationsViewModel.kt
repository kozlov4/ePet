package com.example.epet.ui.notification.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.repository.NotificationsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NotificationsViewModel : ViewModel() {

    private val repository = NotificationsRepository()

    private val _outputGetNotifications = MutableStateFlow<List<OutputNotification>>(emptyList())
    val outputGetNotifications = _outputGetNotifications.asStateFlow()

    fun getNotifications(token: String?) {
        viewModelScope.launch {
            val output = repository.getNotifications(token)
            _outputGetNotifications.value = output
        }
    }
}