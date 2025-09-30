package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.PetPassport

class PassportAdapter(
    private val passportList: List<PetPassport>,
    private val onMenuClick: () -> Unit) : RecyclerView.Adapter<PassportAdapter.PassportViewHolder>() {

    inner class PassportViewHolder(val card: CardView) : RecyclerView.ViewHolder(card) {
        val tv_name_ua: TextView = card.findViewById(R.id.tv_name_ua)
        val tv_name_en: TextView = card.findViewById(R.id.tv_name_en)
        val tv_birth_date: TextView = card.findViewById(R.id.tv_birth_date)
        val tv_passport_number: TextView = card.findViewById(R.id.tv_passport_number)
        val tv_last_update: TextView = card.findViewById(R.id.tv_last_update)
        val iv_menu: ImageView = card.findViewById(R.id.iv_menu)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PassportViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_passport, parent, false) as CardView

        val screenWidth = parent.context.resources.displayMetrics.widthPixels
        view.layoutParams.width = (screenWidth * 0.83).toInt()
        return PassportViewHolder(view)
    }

    override fun onBindViewHolder(holder: PassportViewHolder, position: Int) {
        val passport = passportList[position]
        holder.tv_name_ua.text = passport.nameUA
        holder.tv_name_en.text = passport.nameEN
        holder.tv_birth_date.text = passport.birthDate
        holder.tv_passport_number.text = passport.passportNumber

        val repeatedText = "Паспорт оновлено ${passport.lastUpdate} "
        holder.tv_last_update.text = repeatedText.repeat(100)
        holder.tv_last_update.isSelected = true

        holder.iv_menu.setOnClickListener {
            onMenuClick()
        }
    }

    override fun getItemCount(): Int = passportList.size
}
