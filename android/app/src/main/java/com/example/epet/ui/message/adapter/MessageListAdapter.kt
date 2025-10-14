package com.example.epet.ui.messages.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.Message

class MessageListAdapter(private val messages: List<Message>) : RecyclerView.Adapter<MessageListAdapter.MessageViewHolder>() {

    class MessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tv_main: TextView = itemView.findViewById(R.id.tv_main)
        val tv_description: TextView = itemView.findViewById(R.id.tv_description)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_message, parent, false)
        return MessageViewHolder(view)
    }

    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        val message = messages[position]
        holder.tv_main.text = message.main
        holder.tv_description.text = message.description
    }

    override fun getItemCount(): Int = messages.size
}
