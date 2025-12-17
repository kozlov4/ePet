package com.example.epet.ui.notification.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.repository.NotificationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class NotificationsViewModel : ViewModel() {

    private val repository = NotificationRepository()

    private val _outputNotificationsList = MutableStateFlow<List<OutputNotification>>(emptyList())
    val outputNotificationsList = _outputNotificationsList.asStateFlow()

    fun getNotificationsList(token: String?) {
        viewModelScope.launch {
            val output = repository.getNotificationsList(token)
            _outputNotificationsList.value = output
        }
    }
}