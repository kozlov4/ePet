package com.example.epet.ui.messages.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.notification.OutputNotification

class NotificationsListAdapter(private val notificationsList: List<OutputNotification>) : RecyclerView.Adapter<NotificationsListAdapter.NotificationsViewHolder>() {

    class NotificationsViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tv_main: TextView = itemView.findViewById(R.id.tv_main)
        val tv_description: TextView = itemView.findViewById(R.id.tv_description)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationsViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification, parent, false)
        return NotificationsViewHolder(view)
    }

    override fun onBindViewHolder(holder: NotificationsViewHolder, position: Int) {
        val notification = notificationsList[position]
        holder.tv_main.text = notification.extract_name
        holder.tv_description.text = notification.message
    }

    override fun getItemCount(): Int = notificationsList.size
}
